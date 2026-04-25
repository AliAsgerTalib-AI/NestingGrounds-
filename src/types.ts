export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: 'user' | 'admin';
  created_at: any;
  updated_at: any;
}

export interface Home {
  id: string;
  user_id: string;
  home_name: string;
  owner_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  home_type?: string;
  notes?: string;
  created_at: any;
  updated_at: any;
}

export interface Room {
  id: string;
  home_id: string;
  user_id: string;
  room_name: string;
  room_description?: string;
  room_photo_url?: string;
  notes?: string;
  created_at: any;
  updated_at: any;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  home_id: string;
  room_id: string;
  item_name: string;
  category?: string;
  description?: string;
  brand?: string;
  model_number?: string;
  serial_number?: string;
  quantity: number;
  purchase_date?: string;
  purchase_price?: number;
  store_vendor?: string;
  current_estimated_value?: number;
  replacement_value?: number;
  condition?: string;
  insurance_notes?: string;
  warranty_provider?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  warranty_status?: string;
  notes?: string;
  created_at: any;
  updated_at: any;
}

export interface ItemPhoto {
  id: string;
  item_id: string;
  user_id: string;
  file_url: string;
  file_path: string;
  photo_type?: string;
  caption?: string;
  created_at: any;
}

export interface ItemDocument {
  id: string;
  item_id: string;
  user_id: string;
  document_type: string;
  file_url: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  notes?: string;
  created_at: any;
}
