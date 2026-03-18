const { useState, useEffect, useMemo } = React;
const { motion, AnimatePresence } = window.Motion;

// Shared Cart Hook
window.useCart = () => {
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('meitiv_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('meitiv_cart', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToCart = (product) => {
    setShoppingList(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setShoppingList(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (productId) => {
    setShoppingList(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartItemCount = shoppingList.reduce((sum, item) => sum + item.quantity, 0);

  return { shoppingList, addToCart, updateQuantity, removeItem, cartItemCount };
};

// Shared Pesach Mode Hook
window.usePesachMode = () => {
  const [isPassoverMode, setIsPassoverMode] = useState(() => localStorage.getItem('meitiv_pesach') === 'true');

  useEffect(() => {
    const handleStorage = () => {
      setIsPassoverMode(localStorage.getItem('meitiv_pesach') === 'true');
    };
    window.addEventListener('pesachModeChanged', handleStorage);
    return () => window.removeEventListener('pesachModeChanged', handleStorage);
  }, []);

  const toggle = () => {
    const newValue = !isPassoverMode;
    setIsPassoverMode(newValue);
    localStorage.setItem('meitiv_pesach', newValue);
    window.dispatchEvent(new Event('pesachModeChanged'));
  };

  return { isPassoverMode, toggle };
};

// TopBar
window.TopBar = () => {
  const getTodayHours = () => {
    const day = new Date().getDay();
    if (day >= 0 && day <= 3) return "Open today until 12:00 AM";
    if (day === 4) return "Open today until 1:00 AM";
    if (day === 5) return "Open today until 2 hrs before sundown";
    if (day === 6) return "Closed today for Shabbat";
    return "";
  };

  return (
    <div className="bg-blue-900 text-white text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot"></i> 123 Kosher Way, Monroe NY</span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-phone"></i> (718) 555-0198</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-blue-800 px-2 py-1 rounded text-xs uppercase tracking-wide">Wholesale Only</span>
          <span className="text-blue-200">{getTodayHours()}</span>
        </div>
      </div>
    </div>
  );
};

// Navbar
window.Navbar = ({ currentPage, cartItemCount, onOpenCart, onOpenCalendar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPassoverMode, toggle } = window.usePesachMode();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <a href="index.html" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <i className="fa-solid fa-cart-shopping text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Meitiv <span className="text-blue-600">Wholesale</span></span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="index.html" className={`font-medium transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Home</a>
              <a href="catalog.html" className={`font-medium transition-colors ${currentPage === 'catalog' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Full Catalog</a>
              <button onClick={onOpenCalendar} className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                <i className="fa-solid fa-calendar-days"></i> Holiday Hours
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                isPassoverMode ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <i className="fa-solid fa-star"></i>
              {isPassoverMode ? 'Pesach Mode On' : 'Pesach Mode Off'}
            </button>
            <button onClick={onOpenCart} className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 overflow-hidden bg-white"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <a href="index.html" className={`font-medium ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-600'}`}>Home</a>
              <a href="catalog.html" className={`font-medium ${currentPage === 'catalog' ? 'text-blue-600' : 'text-slate-600'}`}>Full Catalog</a>
              <button onClick={onOpenCalendar} className="text-left font-medium text-slate-600 flex items-center gap-2">
                <i className="fa-solid fa-calendar-days"></i> Holiday Hours
              </button>
              <button
                onClick={toggle}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isPassoverMode ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <i className="fa-solid fa-star"></i>
                {isPassoverMode ? 'Pesach Mode On' : 'Pesach Mode Off'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Footer
window.Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <i className="fa-solid fa-cart-shopping text-white"></i>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Meitiv Wholesale</span>
          </div>
          <p className="mb-4 max-w-md">Your trusted partner for wholesale kosher provisions. Serving the community with quality, value, and exceptional service.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="catalog.html" className="hover:text-white transition-colors">Full Catalog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Weekly Specials</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Wholesale Application</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><i className="fa-solid fa-location-dot w-4"></i> 123 Kosher Way, Monroe NY</li>
            <li className="flex items-center gap-2"><i className="fa-solid fa-phone w-4"></i> (718) 555-0198</li>
            <li className="flex items-center gap-2"><i className="fa-solid fa-envelope w-4"></i> orders@meitivwholesale.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Meitiv Wholesale. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// ShoppingListModal
window.ShoppingListModal = ({ isOpen, onClose, items, updateQuantity, removeItem }) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-cart-shopping"></i> Shopping List
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <i className="fa-solid fa-cart-shopping text-4xl mb-4 opacity-20"></i>
                  <p>Your list is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-white" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-slate-900 text-sm leading-tight">{item.product.name}</h3>
                          <button onClick={() => removeItem(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <p className="text-blue-600 font-bold mt-1">${item.product.price.toFixed(2)} <span className="text-xs text-slate-500 font-normal">/ {item.product.unit}</span></p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"><i className="fa-solid fa-minus text-xs"></i></button>
                            <span className="px-2 py-1 text-sm font-medium w-8 text-center border-x border-slate-200">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="px-2 py-1 text-slate-600 hover:bg-slate-50 transition-colors"><i className="fa-solid fa-plus text-xs"></i></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-600 font-medium">Estimated Total</span>
                  <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                    <i className="fa-solid fa-print"></i> Print
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    <i className="fa-solid fa-download"></i> Save PDF
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// QuickViewModal
window.QuickViewModal = ({ product, onClose, onAddToList }) => {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow-sm backdrop-blur-sm transition-all">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="flex flex-col md:flex-row h-full overflow-y-auto">
              <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center min-h-[300px]">
                <img src={product.image} alt={product.name} className="w-full max-w-sm object-contain mix-blend-multiply drop-shadow-xl" />
              </div>
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md uppercase tracking-wide">{product.category}</span>
                  {product.kosherForPassover && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-md uppercase tracking-wide border border-amber-200">Kosher for Passover</span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.name}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm text-slate-500">Hashgacha:</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-100">{product.hashgacha}</span>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-slate-500 mb-1">/ {product.unit}</span>
                  </div>
                  {product.bulkDeal && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-100">
                      <i className="fa-solid fa-tag text-xs"></i> {product.bulkDeal}
                    </div>
                  )}
                </div>
                <div className="prose prose-sm text-slate-600 mb-8 flex-1">
                  <p>{product.description}</p>
                </div>
                <button onClick={() => { onAddToList(product); onClose(); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                  <i className="fa-solid fa-plus"></i> Add to Shopping List
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// HolidayCalendarModal
window.HolidayCalendarModal = ({ isOpen, onClose }) => {
  const holidays = [
    { name: "Purim", date: "March 24, 2026", hours: "8:00 AM - 2:00 PM", note: "Early closing for Megillah reading" },
    { name: "Passover (Pesach) Eve", date: "April 22, 2026", hours: "6:00 AM - 12:00 PM", note: "Last minute essentials only" },
    { name: "Passover (Pesach)", date: "April 23 - April 30, 2026", hours: "Closed", note: "Closed for the duration of Yom Tov" },
    { name: "Shavuot Eve", date: "June 11, 2026", hours: "8:00 AM - 4:00 PM", note: "Stock up on dairy!" },
    { name: "Shavuot", date: "June 12 - June 13, 2026", hours: "Closed", note: "Closed for Yom Tov" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <i className="fa-solid fa-calendar-days text-blue-600"></i> Holiday Schedule
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-slate-600 mb-6">Please note our special operating hours for upcoming holidays. Plan your shopping accordingly!</p>
              <div className="space-y-4">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors shadow-sm">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-bold text-slate-900 text-lg">{holiday.name}</h3>
                      <p className="text-sm text-slate-500">{holiday.date}</p>
                    </div>
                    <div className="sm:text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-100 mb-1">
                        <i className="fa-solid fa-clock text-xs"></i> {holiday.hours}
                      </div>
                      {holiday.note && <p className="text-xs text-slate-500 italic">{holiday.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// RenderProductCard
window.RenderProductCard = ({ product, onQuickView, onAddToList }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
    <div className="relative aspect-square bg-slate-50 p-6 overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {product.kosherForPassover && (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-amber-200 shadow-sm">Pesach</span>
        )}
        {product.bulkDeal && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Deal</span>
        )}
      </div>
      <button onClick={() => onQuickView(product)} className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-blue-600">
        <i className="fa-solid fa-eye"></i>
      </button>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{product.category}</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{product.hashgacha}</span>
      </div>
      <h3 className="font-bold text-slate-900 mb-1 leading-tight flex-1">{product.name}</h3>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <span className="text-sm text-slate-500 ml-1">/ {product.unit}</span>
        </div>
        <button onClick={() => onAddToList(product)} className="bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  </div>
);
