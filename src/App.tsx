import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { Product, CartItem } from './types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Architectural Linen Shirt',
    price: 185,
    description: 'A crisp, white linen shirt featuring structured seams and an oversized collar. The ultimate foundation piece for any house wardrobe.',
    category: 'Essential Tops',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Citrus Corduroy Trousers',
    price: 220,
    description: 'Tailored trousers in a vibrant lemon yellow corduroy. High-waisted with a subtle wide-leg cut for a modern architectural silhouette.',
    category: 'Statement Bottoms',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
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
                className="flex-1 bg-transparent border-b-2 border-white/20 py-4 px-2 outline-none focus:border-brand-yellow transition-colors font-display"
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
          <p className="text-[10px] text-black/40 uppercase tracking-[0.2em]">
            © 2026 THE CLOTH HOUSE STUDIO. ALL RIGHTS RESERVED.
          </p>
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
