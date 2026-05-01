import { motion } from 'motion/react';
import { ShoppingBag, Menu, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="hover:opacity-60 transition-opacity" id="nav-menu">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-xs uppercase tracking-widest font-medium hover:text-brand-yellow-dark transition-colors">Shop</a>
            <a href="#" className="text-xs uppercase tracking-widest font-medium hover:text-brand-yellow-dark transition-colors">Collections</a>
            <a href="#" className="text-xs uppercase tracking-widest font-medium hover:text-brand-yellow-dark transition-colors">About</a>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <a href="/" className="font-display text-2xl font-bold tracking-tighter uppercase whitespace-nowrap" id="logo">
            THE CLOTH <span className="text-brand-yellow-dark">HOUSE</span>
          </a>
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden sm:block hover:opacity-60 transition-opacity" id="nav-search">
            <Search size={22} />
          </button>
          <button 
            onClick={onOpenCart}
            className="group relative flex items-center gap-2"
            id="nav-cart"
          >
            <div className="bg-brand-yellow p-2 border border-black group-hover:bg-brand-yellow-dark transition-colors">
              <ShoppingBag size={18} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
