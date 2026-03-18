const { useState, useEffect, useMemo } = React;
const { motion, AnimatePresence } = window.Motion;
const { TopBar, Navbar, Footer, ShoppingListModal, QuickViewModal, HolidayCalendarModal, RenderProductCard, useCart, usePesachMode } = window;
const { products, categories, hashgachas } = window.MeitivData;

const Catalog = () => {
  const { shoppingList, addToCart, updateQuantity, removeItem, cartItemCount } = useCart();
  const { isPassoverMode } = usePesachMode();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHashgacha, setSelectedHashgacha] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesHashgacha = selectedHashgacha === 'All' || product.hashgacha === selectedHashgacha;
      const matchesPesach = !isPassoverMode || product.kosherForPassover;
      
      return matchesSearch && matchesCategory && matchesHashgacha && matchesPesach;
    });
  }, [searchQuery, selectedCategory, selectedHashgacha, isPassoverMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Navbar currentPage="catalog" cartItemCount={cartItemCount} onOpenCart={() => setIsCartOpen(true)} onOpenCalendar={() => setIsCalendarOpen(true)} />
      
      <main className="flex-1">
        <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Search wholesale products..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <select
                    className="w-full sm:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm"></i>
                </div>
                <div className="relative">
                  <select
                    className="w-full sm:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={selectedHashgacha}
                    onChange={(e) => setSelectedHashgacha(e.target.value)}
                  >
                    {hashgachas.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Full Wholesale Catalog</h1>
              <p className="text-slate-600">Browse our complete inventory of premium kosher products.</p>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              Showing {filteredProducts.length} products
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <i className="fa-solid fa-box-open text-6xl text-slate-300 mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting your search or category selection.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedHashgacha('All'); }}
                className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <RenderProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} onAddToList={addToCart} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ShoppingListModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={shoppingList} updateQuantity={updateQuantity} removeItem={removeItem} />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToList={addToCart} />
      <HolidayCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Catalog />);
