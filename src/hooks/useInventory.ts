import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Home, Room, InventoryItem } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useInventory() {
  const getHomes = (callback: (homes: Home[]) => void) => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'homes'), 
      where('user_id', '==', auth.currentUser.uid),
      orderBy('created_at', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Home)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'homes'));
  };

  const addHome = async (home: Partial<Home>) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'homes'), {
        ...home,
        user_id: auth.currentUser.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'homes');
    }
  };

  const getRooms = (homeId: string, callback: (rooms: Room[]) => void) => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'homes', homeId, 'rooms'),
      where('user_id', '==', auth.currentUser.uid),
      orderBy('created_at', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, `homes/${homeId}/rooms`));
  };

  const addRoom = async (homeId: string, room: Partial<Room>) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'homes', homeId, 'rooms'), {
        ...room,
        home_id: homeId,
        user_id: auth.currentUser.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `homes/${homeId}/rooms`);
    }
  };

  const getItems = (callback: (items: InventoryItem[]) => void) => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'inventory_items'),
      where('user_id', '==', auth.currentUser.uid),
      orderBy('created_at', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'inventory_items'));
  };

  const addItem = async (item: Partial<InventoryItem>) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'inventory_items'), {
        ...item,
        user_id: auth.currentUser.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inventory_items');
    }
  };

  return {
    getHomes,
    addHome,
    getRooms,
    addRoom,
    getItems,
    addItem
  };
}
