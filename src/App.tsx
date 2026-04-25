import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Box, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Search, 
  Settings, 
  LogOut,
  ChevronRight,
  Package,
  LayoutDashboard,
  Calendar,
  AlertCircle,
  X,
  MapPin,
  Tag
} from 'lucide-react';
import { useInventory } from './hooks/useInventory';
import { Home, InventoryItem } from './types';

// Types
type Page = 'dashboard' | 'homes' | 'items' | 'records';

// Components
function LandingPage() {
  const { signInWithGoogle } = useAuth();
  return (
    <div className="min-h-screen bg-natural-bg text-natural-text-body flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-natural-accent rounded-2xl shadow-xl shadow-natural-accent/20">
            <Box className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-serif font-semibold tracking-tight text-natural-text-heading sm:text-7xl">
          Nesting<span className="italic">Grounds</span>
        </h1>
        <p className="text-lg text-natural-text-muted leading-relaxed font-sans max-w-lg mx-auto">
          The comprehensive digital safety deposit box for your home. Catalog items, track warranties, and organize records with organic precision.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={signInWithGoogle}
            className="px-10 py-4 bg-natural-accent text-white rounded-full font-semibold shadow-lg shadow-natural-accent/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Your Archive <ChevronRight className="w-4 h-4" />
          </button>
          <button className="px-10 py-4 bg-white text-natural-text-body border border-natural-border rounded-full font-semibold hover:bg-natural-bg transition-all cursor-pointer">
            Explore Tiers
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-natural-text-heading/30 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-natural-bg rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden border border-natural-border"
        >
          <div className="p-8 border-b border-natural-border flex justify-between items-center bg-natural-bg sticky top-0">
            <h3 className="text-2xl font-serif italic text-natural-text-heading">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-natural-sidebar rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5 text-natural-text-muted" />
            </button>
          </div>
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Dashboard() {
  const { profile, logout } = useAuth();
  const { getHomes, addHome, getItems, addItem } = useInventory();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [homes, setHomes] = useState<Home[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    const unsubHomes = getHomes(setHomes);
    const unsubItems = getItems(setItems);
    return () => {
      unsubHomes?.();
      unsubItems?.();
    };
  }, []);

  const handleAddHome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addHome({
      home_name: formData.get('home_name') as string,
      city: formData.get('city') as string,
      home_type: formData.get('home_type') as string,
    });
    setIsHomeModalOpen(false);
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addItem({
      item_name: formData.get('item_name') as string,
      category: formData.get('category') as string,
      purchase_price: parseFloat(formData.get('price') as string) || 0,
      quantity: 1,
      home_id: homes[0]?.id || '', // Multi-home support later
      room_id: 'default',
    });
    setIsItemModalOpen(false);
  };

  const totalValue = items.reduce((sum, item) => sum + (item.purchase_price || 0), 0);
  const itemsMissingReceipt = items.filter(item => !item.purchase_date); // Simplified check
  const expiringWarranties = items.filter(item => item.warranty_status === 'Expiring Soon');

  return (
    <div className="flex h-screen bg-natural-bg text-natural-text-body font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-natural-sidebar border-r border-natural-border h-full flex flex-col p-8 shrink-0">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-natural-accent rounded-xl flex items-center justify-center text-white font-serif italic text-xl shadow-lg shadow-natural-accent/20">N</div>
          <h1 className="text-xl font-serif font-semibold tracking-tight text-natural-text-heading">NestingGrounds</h1>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActivePage('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer font-medium ${activePage === 'dashboard' ? 'bg-white shadow-sm text-natural-accent' : 'text-natural-text-muted hover:bg-white/50'}`}
          >
            <span className={`w-2 h-2 rounded-full ${activePage === 'dashboard' ? 'bg-natural-accent' : 'bg-transparent border border-natural-text-muted'}`}></span>
            Dashboard
          </button>
          <button 
            onClick={() => setActivePage('homes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer font-medium ${activePage === 'homes' ? 'bg-white shadow-sm text-natural-accent' : 'text-natural-text-muted hover:bg-white/50'}`}
          >
            <span className={`w-2 h-2 rounded-full ${activePage === 'homes' ? 'bg-natural-accent' : 'bg-transparent border border-natural-text-muted'}`}></span>
            My Rooms
          </button>
          <button 
            onClick={() => setActivePage('items')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer font-medium ${activePage === 'items' ? 'bg-white shadow-sm text-natural-accent' : 'text-natural-text-muted hover:bg-white/50'}`}
          >
            <span className={`w-2 h-2 rounded-full ${activePage === 'items' ? 'bg-natural-accent' : 'bg-transparent border border-natural-text-muted'}`}></span>
            Inventory
          </button>
        </nav>

        <div className="bg-natural-border/50 p-6 rounded-3xl mt-auto space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-natural-text-muted font-bold">Storage Health</p>
            <p className="text-sm font-bold text-natural-text-body">Stable</p>
          </div>
          <div className="w-full bg-white/50 h-1.5 rounded-full">
            <div className="w-4/5 h-full bg-natural-accent rounded-full transition-all duration-1000"></div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-xs font-bold text-natural-text-muted hover:text-red-500 transition-colors w-full pt-4 border-t border-natural-border/50 cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 flex flex-col gap-10 overflow-y-auto">
        <header className="flex justify-between items-end shrink-0">
          <div>
            <h2 className="text-3xl font-serif italic text-natural-text-heading">Hello, {profile?.full_name.split(' ')[0]}.</h2>
            <p className="text-natural-text-muted">You have {items.length} items cataloged across {homes.length} records.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-natural-text-muted" />
              <input 
                type="text" 
                placeholder="Find in archive..." 
                className="pl-12 pr-6 py-3 bg-natural-sidebar border border-natural-border rounded-full focus:ring-2 focus:ring-natural-accent w-64 text-sm focus:outline-none transition-all placeholder:text-natural-text-muted/60"
              />
            </div>
            <button 
              onClick={() => setIsItemModalOpen(true)}
              className="px-8 py-3 bg-natural-accent text-white rounded-full font-medium shadow-lg shadow-natural-accent/20 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
            <div className="w-12 h-12 bg-natural-sidebar rounded-full border border-natural-border flex items-center justify-center text-natural-text-muted">
              <Settings className="w-5 h-5" />
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-10 flex-1">
          {activePage === 'dashboard' && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-natural-card-green p-8 rounded-[40px] flex flex-col gap-2 shadow-sm border border-natural-accent/5">
                  <span className="text-[10px] uppercase tracking-widest text-natural-accent font-bold">Total Value</span>
                  <span className="text-4xl font-serif text-natural-text-heading">${totalValue.toLocaleString()}</span>
                </div>
                <div className="bg-natural-card-pink p-8 rounded-[40px] flex flex-col gap-2 shadow-sm border border-[#B58371]/5">
                  <span className="text-[10px] uppercase tracking-widest text-[#B58371] font-bold">Incomplete Records</span>
                  <span className="text-4xl font-serif text-natural-text-heading">{itemsMissingReceipt.length} Items</span>
                </div>
                <div className="bg-natural-card-gray p-8 rounded-[40px] flex flex-col gap-2 shadow-sm border border-natural-text-muted/10">
                  <span className="text-[10px] uppercase tracking-widest text-natural-text-muted font-bold">Monitored Results</span>
                  <span className="text-4xl font-serif text-natural-text-heading">{items.length} Total</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 flex-1 min-h-0">
                {/* Left Section: Active Archives */}
                <section className="lg:w-2/3 flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-lg font-bold text-natural-text-heading">Archives Overview</h3>
                    <button onClick={() => setActivePage('homes')} className="text-sm text-natural-accent underline underline-offset-4 cursor-pointer hover:opacity-80">View all</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {homes.slice(0, 4).map((home) => (
                      <div key={home.id} className="group bg-white border border-natural-border p-8 rounded-[40px] hover:border-natural-accent transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-natural-sidebar rounded-2xl flex items-center justify-center text-xl shadow-sm">
                            {home.home_type === 'Apartment' ? '🏢' : '🏡'}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest bg-natural-card-gray px-3 py-1.5 rounded-full text-natural-text-muted font-bold">
                            {home.home_type || 'Archive'}
                          </span>
                        </div>
                        <p className="font-serif text-xl text-natural-text-heading mb-1">{home.home_name}</p>
                        <p className="text-sm text-natural-text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {home.city || 'Undisclosed Location'}
                        </p>
                      </div>
                    ))}
                    {homes.length === 0 && (
                      <div className="col-span-full py-16 border-2 border-dashed border-natural-border rounded-[40px] text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-natural-sidebar rounded-full flex items-center justify-center text-2xl">🐚</div>
                        <p className="text-natural-text-muted font-medium italic">No active archive foundations. Begin by adding a home.</p>
                        <button onClick={() => setIsHomeModalOpen(true)} className="text-natural-accent text-sm font-bold underline underline-offset-4 cursor-pointer">Establish Archive</button>
                      </div>
                    )}
                    <button 
                      onClick={() => setIsHomeModalOpen(true)}
                      className="border-2 border-dashed border-natural-border p-8 rounded-[40px] hover:border-natural-accent transition-all flex flex-col items-center justify-center text-natural-text-muted gap-2 group cursor-pointer"
                    >
                      <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">Establish New Foundation</span>
                    </button>
                  </div>
                </section>

                {/* Right Section: Recent Acquisitions List */}
                <section className="flex-1 bg-[#F9F8F6] border border-natural-border rounded-[40px] p-10 flex flex-col overflow-hidden shadow-sm">
                  <h3 className="text-lg font-bold text-natural-text-heading mb-8 shrink-0">Recent Acquisitions</h3>
                  <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {items.slice(0, 6).map((item) => (
                      <div key={item.id} className="flex items-center gap-5 group cursor-default">
                        <div className="w-16 h-16 bg-white rounded-2xl border border-natural-border flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {item.category === 'Electronics' ? '📱' : item.category === 'Furniture' ? '🪑' : '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-natural-text-heading truncate">{item.item_name}</p>
                          <p className="text-xs text-natural-text-muted font-medium">
                            {item.category || 'Misc'} • <span className="text-natural-accent">${(item.purchase_price || 0).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {items.length === 0 && (
                      <p className="text-sm text-natural-text-muted italic py-12 text-center">Your catalog remains pristine and empty.</p>
                    )}
                    <button 
                      onClick={() => setIsItemModalOpen(true)}
                      className="w-full py-5 border-2 border-dashed border-natural-border rounded-3xl text-natural-text-muted text-xs font-bold hover:border-natural-accent hover:text-natural-accent transition-all uppercase tracking-widest cursor-pointer mt-4"
                    >
                      + Quick Catalog Entry
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}

          {activePage === 'homes' && (
             <div className="flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif italic text-natural-text-heading">Archive Foundations</h3>
                <button 
                  onClick={() => setIsHomeModalOpen(true)}
                  className="px-8 py-3 bg-natural-accent text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Home
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homes.map((home) => (
                  <div key={home.id} className="group bg-white border border-natural-border p-10 rounded-[40px] hover:border-natural-accent transition-all duration-300 shadow-sm hover:shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-natural-sidebar rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {home.home_type === 'Apartment' ? '🏢' : '🏡'}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest bg-natural-card-gray px-4 py-2 rounded-full text-natural-text-muted font-bold">
                        {home.home_type || 'Residential'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-serif text-natural-text-heading mb-2">{home.home_name}</h4>
                    <p className="text-natural-text-muted flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" /> {home.city || 'Undisclosed'}
                    </p>
                    <div className="pt-8 flex justify-between items-center border-t border-natural-border mt-8 uppercase tracking-widest text-[10px] font-bold">
                      <span className="text-natural-text-muted">Archives</span>
                      <span className="text-natural-accent">Active Record</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === 'items' && (
            <div className="flex flex-col gap-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif italic text-natural-text-heading">Cataloged Inventory</h3>
                <button 
                  onClick={() => setIsItemModalOpen(true)}
                  className="px-8 py-3 bg-natural-accent text-white rounded-full font-medium shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
              <div className="bg-white rounded-[40px] border border-natural-border shadow-sm overflow-hidden p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] uppercase tracking-widest text-natural-text-muted border-b border-natural-border">
                      <tr>
                        <th className="px-6 py-6 font-bold">Item Identifier</th>
                        <th className="px-6 py-6 font-bold">Classification</th>
                        <th className="px-6 py-6 font-bold">Recorded Value</th>
                        <th className="px-6 py-6 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-natural-border/30 text-sm">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-natural-sidebar/30 transition-all">
                          <td className="px-6 py-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-natural-sidebar rounded-xl flex items-center justify-center text-xl shadow-sm">
                                {item.category === 'Electronics' ? '📱' : item.category === 'Furniture' ? '🪑' : '📦'}
                              </div>
                              <span className="font-bold text-natural-text-heading text-base">{item.item_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-8">
                            <span className="flex items-center gap-2 text-natural-text-body font-medium">
                              <Tag className="w-4 h-4 text-natural-accent" /> {item.category || 'Unclassified'}
                            </span>
                          </td>
                          <td className="px-6 py-8 font-serif text-lg text-natural-text-heading">${(item.purchase_price || 0).toLocaleString()}</td>
                          <td className="px-6 py-8">
                            <button className="text-natural-accent font-bold hover:underline cursor-pointer uppercase tracking-widest text-[10px]">Inspect</button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-32 text-center text-natural-text-muted italic">
                            Your archives are pristine. No items cataloged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Modals */}
        <Modal isOpen={isHomeModalOpen} onClose={() => setIsHomeModalOpen(false)} title="Add New Archive Foundation">
          <form onSubmit={handleAddHome} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                <HomeIcon className="w-3 h-3" /> Archive Nickname
              </label>
              <input name="home_name" required placeholder="e.g. Primary Residence" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all placeholder:text-natural-text-muted/40" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Location
                </label>
                <input name="city" placeholder="e.g. New York" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all placeholder:text-natural-text-muted/40" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Foundation Type
                </label>
                <select name="home_type" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all cursor-pointer">
                  <option value="House">Residential House</option>
                  <option value="Apartment">Apartment Suite</option>
                  <option value="Condo">City Condo</option>
                  <option value="Rental">Leased Property</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-natural-accent text-white rounded-full font-bold shadow-lg shadow-natural-accent/20 hover:opacity-90 transition-all cursor-pointer mt-4">
              Archive Foundation
            </button>
          </form>
        </Modal>

        <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Catalog New Acquisition">
          <form onSubmit={handleAddItem} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                <Package className="w-3 h-3" /> Item Nomenclature
              </label>
              <input name="item_name" required placeholder="e.g. Vintage Eames" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all placeholder:text-natural-text-muted/40" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Classification
                </label>
                <select name="category" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all cursor-pointer">
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Tools">Artisanal Tools</option>
                  <option value="Art">Fine Art</option>
                  <option value="Other">Miscellaneous</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-natural-text-muted flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Valuation
                </label>
                <input name="price" type="number" placeholder="0.00" className="w-full px-6 py-4 bg-natural-sidebar border border-natural-border rounded-2xl focus:ring-2 focus:ring-natural-accent outline-none transition-all placeholder:text-natural-text-muted/40" />
              </div>
            </div>
            {homes.length === 0 && (
              <p className="text-xs text-[#B58371] font-bold italic bg-natural-card-pink px-4 py-2 rounded-xl border border-[#B58371]/10">Warning: No foundation established. Records will be unanchored.</p>
            )}
            <button type="submit" className="w-full py-5 bg-natural-accent text-white rounded-full font-bold shadow-lg shadow-natural-accent/20 hover:opacity-90 transition-all cursor-pointer mt-4">
              Catalog Record
            </button>
          </form>
        </Modal>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E2DB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7B836D;
        }
      `}</style>
    </div>
  );
}

function MainContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-natural-bg">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-natural-accent border-t-transparent rounded-full shadow-lg shadow-natural-accent/10"
        />
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
