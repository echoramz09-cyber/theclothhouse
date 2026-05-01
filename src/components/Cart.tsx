import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-white z-[101] shadow-2xl flex flex-col"
            id="cart-drawer"
          >
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-brand-yellow-dark" />
                <h2 className="text-2xl font-display font-bold uppercase">Your Bag</h2>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300" id="close-cart">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-6 bg-brand-offwhite border border-dashed border-black/20 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-black/10" />
                  </div>
                  <p className="text-lg font-light text-black/40 uppercase tracking-widest">
                    Your bag is empty
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:text-brand-yellow-dark transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 aspect-[3/4] overflow-hidden bg-brand-white border border-black/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-display font-medium uppercase text-sm tracking-tight">{item.name}</h3>
                          <button onClick={() => onRemove(item.id)} className="text-black/30 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-black/50 uppercase mt-1">{item.category}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-black">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-brand-yellow transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-brand-yellow transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-display font-bold">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-brand-white border-t border-black/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest font-light">Subtotal</span>
                  <span className="text-2xl font-display font-bold">${total}</span>
                </div>
                <button 
                  onClick={() => {
                    const itemSummary = items.map(item => `- ${item.name} (x${item.quantity}): $${item.price * item.quantity}`).join('\n');
                    const message = `Hello! I'd like to place an order from The Cloth House:\n\n${itemSummary}\n\nTotal: $${total}\n\nPlease let me know the next steps!`;
                    navigator.clipboard.writeText(message).then(() => {
                      alert("Cart details copied! Paste them in the Instagram DM window that opens next.");
                      window.open(`https://ig.me/m/thecodehouse.09`, '_blank');
                    });
                  }}
                  className="w-full bg-brand-black text-white py-5 font-display font-medium uppercase tracking-[0.2em] hover:bg-brand-yellow hover:text-black hover:border-black border border-transparent transition-all"
                >
                  Proceed to Checkout
                </button>
                <p className="text-[10px] text-center text-black/40 uppercase mt-4 tracking-widest font-medium">
                  Free Worldwide Shipping on all House items
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
