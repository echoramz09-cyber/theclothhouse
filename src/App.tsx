import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Admin from './components/Admin';
import { Product, CartItem } from './types';

function StoreFront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const path = 'products';
      try {
        const q = query(collection(db, path), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
        setLoading(false);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      <main>
        <Hero />
        
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32" id="products">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-yellow-dark mb-4">The Selection</p>
              <h2 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter">
                FEATURED <br /> PIECES
              </h2>
            </div>
            <p className="max-w-sm text-black/50 font-light leading-relaxed">
              Our curated house favorites. Minimal white meets architectural yellow in a celebration of modern silhouettes.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-yellow border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-black/10 text-black/20 font-display font-bold uppercase tracking-widest">
                  Store collection is coming soon
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-brand-black text-white py-24 md:py-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-brand-yellow-dark opacity-5 mix-blend-overlay" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter mb-12">
              JOIN THE <span className="text-brand-yellow italic">HOUSE</span>
            </h2>
            <p className="text-white/60 max-w-lg mb-12 font-light">
              Receive updates on new collections, exclusive drops, and architectural style inspiration.
            </p>
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="flex-1 bg-transparent border-b-2 border-white/20 py-4 px-2 outline-none focus:border-brand-yellow transition-colors font-display text-white"
              />
              <button className="bg-brand-yellow text-black px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-white py-12 border-t border-black/5 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-display text-lg font-bold tracking-tighter uppercase mb-2">
            THE CLOTH <span className="text-brand-yellow-dark">HOUSE</span>
          </p>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] text-black/40 uppercase tracking-[0.2em]">
              © 2026 THE CLOTH HOUSE STUDIO. ALL RIGHTS RESERVED.
            </p>
            <Link 
              to="/admin" 
              className="text-[10px] text-black/20 hover:text-brand-yellow-dark uppercase tracking-widest transition-colors font-bold border border-black/10 px-3 py-1"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeItem}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

