import { useState, useEffect, useMemo } from 'react';
import type { Equipment, CartItem, LabSettings, EquipmentCategory } from './types';
import { getEquipmentList, getLabSettings } from './lib/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { EquipmentCard } from './components/EquipmentCard';
import { EquipmentModal } from './components/EquipmentModal';
import { BorrowModal } from './components/BorrowModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminLogModal } from './components/AdminLogModal';
import { LabAssistantsModal } from './components/LabAssistantsModal';
import { initialLabSettings } from './data/mockEquipment';
import { Search, CheckCircle2, Users } from 'lucide-react';

export function App() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<LabSettings>(initialLabSettings);
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('LAB_PINJAM_CART');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [activeDetailItem, setActiveDetailItem] = useState<Equipment | null>(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowItems, setBorrowItems] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [assistantsModalOpen, setAssistantsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load Initial Data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [eqData, setts] = await Promise.all([
        getEquipmentList(),
        getLabSettings(),
      ]);
      setEquipment(eqData);
      setSettings(setts);
    } catch (err) {
      console.error('Failed to load lab data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('LAB_PINJAM_CART', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Handlers
  const handleAddToCart = (item: Equipment) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.equipment.id === item.id);
      if (existing) {
        showToast(`Jumlah ${item.name} diperbarui di keranjang`);
        return prev.map((c) =>
          c.equipment.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      showToast(`${item.name} ditambahkan ke keranjang`);
      return [...prev, { equipment: item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.equipment.id === id ? { ...c, quantity: qty } : c))
    );
    // Also update borrowItems if borrow modal is open
    setBorrowItems((prev) =>
      prev.map((c) => (c.equipment.id === id ? { ...c, quantity: qty } : c))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.equipment.id !== id));
    setBorrowItems((prev) => prev.filter((c) => c.equipment.id !== id));
    showToast('Alat dihapus dari daftar pinjam');
  };

  // Direct 1-Click Borrow (e.g. from Card or Hero)
  const handleDirectBorrow = (item: Equipment) => {
    setBorrowItems([{ equipment: item, quantity: 1 }]);
    setBorrowModalOpen(true);
  };

  // Special scenario: 1-click Erlenmeyer 500 mL
  const handleQuickPickErlenmeyer = () => {
    const erlenmeyer = equipment.find(
      (e) => e.slug === 'erlenmeyer-500ml' || e.name.toLowerCase().includes('erlenmeyer')
    );
    if (erlenmeyer) {
      handleDirectBorrow(erlenmeyer);
    } else if (equipment.length > 0) {
      handleDirectBorrow(equipment[0]);
    }
  };

  // Proceed to borrow all items in cart
  const handleProceedFromCart = () => {
    if (cart.length === 0) return;
    setBorrowItems([...cart]);
    setCartDrawerOpen(false);
    setBorrowModalOpen(true);
  };

  // Filtered Equipment calculation
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.function_desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.capacity_spec && item.capacity_spec.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [equipment, selectedCategory, searchQuery]);

  const cartTotalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Semua: equipment.length,
    };
    equipment.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [equipment]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        settings={settings}
        cartCount={cartTotalCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenHistory={() => setHistoryModalOpen(true)}
        onOpenAssistants={() => setAssistantsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner */}
      <Hero
        settings={settings}
        onQuickPickErlenmeyer={handleQuickPickErlenmeyer}
        onOpenAssistants={() => setAssistantsModalOpen(true)}
      />

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        
        {/* Section Heading & Category Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Katalog Alat Laboratorium Sanitasi
                </h2>
                <button
                  onClick={() => setAssistantsModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors"
                  title="Lihat Tim Asisten Lab"
                >
                  <Users className="w-3 h-3 text-emerald-600" />
                  <span>Tim Asisten Lab</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pilih alat yang dibutuhkan untuk praktikum atau riset. Klik pada alat untuk melihat fungsi, SOP K3, dan formulir pesan WhatsApp.
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
              Total Alat: <span className="text-emerald-700 font-bold">{filteredEquipment.length}</span> dari {equipment.length}
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            itemCounts={categoryCounts}
          />
        </div>

        {/* Equipment Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-slate-200 p-4 animate-pulse space-y-4">
                <div className="bg-slate-200 h-44 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
                <div className="h-3 bg-slate-200 rounded-sm w-1/2" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onViewDetail={setActiveDetailItem}
                onDirectBorrow={handleDirectBorrow}
                onAddToCart={handleAddToCart}
                isInCart={cart.some((c) => c.equipment.id === item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Alat Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada alat laboratorium yang cocok dengan kata kunci &quot;{searchQuery}&quot; pada kategori &quot;{selectedCategory}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 pt-2"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={settings.logo_url || '/logo-poltekkes-bandung.png'}
              alt="Logo Poltekkes Bandung"
              className="h-9 w-auto object-contain"
            />
            <div>
              <span className="font-bold text-slate-800 block text-xs sm:text-sm">
                {settings.campus_name}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                {settings.department_name} • {settings.lab_name}
              </span>
            </div>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            <p>Sistem Layanan Peminjaman Alat Laboratorium Terintegrasi WhatsApp Langsung.</p>
            <p className="mt-0.5">Jl. Babakan Loa, Cimahi Utara (Kampus Kesehatan Lingkungan).</p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <EquipmentModal
        item={activeDetailItem}
        onClose={() => setActiveDetailItem(null)}
        onDirectBorrow={handleDirectBorrow}
        onAddToCart={handleAddToCart}
        isInCart={activeDetailItem ? cart.some((c) => c.equipment.id === activeDetailItem.id) : false}
      />

      {/* Borrow Modal Form with WhatsApp Generator */}
      <BorrowModal
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        items={borrowItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        settings={settings}
        onSuccess={() => {
          showToast('Permohonan berhasil disusun dan diteruskan ke WhatsApp!');
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onProceedToBorrow={handleProceedFromCart}
      />

      {/* Admin Borrow Log Modal */}
      <AdminLogModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />

      {/* Struktur Pengelola & Asisten Laboratorium Modal */}
      <LabAssistantsModal
        isOpen={assistantsModalOpen}
        onClose={() => setAssistantsModalOpen(false)}
        campusName={settings.campus_name}
        departmentName={settings.department_name}
        labName={settings.lab_name}
        adminName={settings.admin_name}
        whatsappNumber={settings.whatsapp_number}
      />

    </div>
  );
}

export default App;
