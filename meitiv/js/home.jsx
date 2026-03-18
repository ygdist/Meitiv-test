const { useState, useEffect, useMemo } = React;
const { motion, AnimatePresence } = window.Motion;
const { TopBar, Navbar, Footer, ShoppingListModal, QuickViewModal, HolidayCalendarModal, RenderProductCard, useCart, usePesachMode } = window;
const { products } = window.MeitivData;

const Home = () => {
  const { shoppingList, addToCart, updateQuantity, removeItem, cartItemCount } = useCart();
  const { isPassoverMode } = usePesachMode();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    const target = 2543000;
    const duration = 2000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setSavings(target);
        clearInterval(timer);
      } else {
        setSavings(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.featured && (!isPassoverMode || p.kosherForPassover));

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar currentPage="home" cartItemCount={cartItemCount} onOpenCart={() => setIsCartOpen(true)} onOpenCalendar={() => setIsCalendarOpen(true)} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" alt="Supermarket aisle" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold tracking-wider mb-4 border border-blue-500/30">
                WHOLESALE TO THE PUBLIC
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Premium Kosher Provisions at <span className="text-blue-400">Wholesale Prices</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl">
                Your trusted source for bulk kosher groceries, fresh produce, and premium meats. Serving families and institutions with uncompromising quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="catalog.html" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors text-center shadow-lg shadow-blue-600/20">
                  Shop Catalog
                </a>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors backdrop-blur-sm border border-white/10">
                  View Weekly Specials
                </button>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 inline-block">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Savings for Local Families</p>
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 flex items-center gap-2">
                  <i className="fa-solid fa-arrow-trend-down text-2xl"></i>
                  ${savings.toLocaleString()}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Specials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Specials</h2>
              <p className="text-slate-600">Hand-picked deals for your family or institution.</p>
            </div>
            <a href="catalog.html" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <RenderProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} onAddToList={addToCart} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <a href="catalog.html" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All Products <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>

        {/* Info / Features Section */}
        <div className="bg-slate-100 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-truck-fast text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bulk Delivery</h3>
                <p className="text-slate-600">Free local delivery on wholesale orders over $500. Serving the greater Monroe area.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-certificate text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Strict Kashrus</h3>
                <p className="text-slate-600">All products carry reliable certifications. We work directly with leading Kashrus agencies.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-users text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Institutional Accounts</h3>
                <p className="text-slate-600">Special pricing and dedicated support for schools, yeshivas, and catering halls.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Don't just take our word for it. See how Meitiv Wholesale is helping families and institutions save.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Chaim S.", location: "Monroe, NY", quote: "Meitiv has completely changed how our family shops for Yom Tov. The bulk deals on meat and poultry are unbeatable, and the quality is always top-notch." },
              { name: "Rivka L.", location: "Spring Valley, NY", quote: "As a caterer, I rely on consistent supply and strict hashgachas. Meitiv delivers on both, and their customer service is incredibly responsive." },
              { name: "Yossi M.", location: "Kiryas Joel", quote: "The savings are real. We track our grocery bills, and since switching to Meitiv for our staples, we've saved hundreds every month." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                <i className="fa-solid fa-quote-right text-4xl text-blue-100 absolute top-6 right-6"></i>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <i key={j} className="fa-solid fa-star text-sm"></i>)}
                </div>
                <p className="text-slate-700 mb-6 relative z-10">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
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
root.render(<Home />);
