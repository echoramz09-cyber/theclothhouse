import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
      id={`product-${product.id}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-white border border-black/5">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-brand-white hover:bg-brand-offwhite text-black py-3 px-6 font-display font-medium flex items-center justify-center gap-2 transition-colors border border-black text-xs"
            id={`add-to-cart-${product.id}`}
          >
            <ShoppingBag size={14} />
            ADD TO BAG
          </button>
          <button
            onClick={() => {
              const message = encodeURIComponent(`Hello! I'm interested in buying the ${product.name} ($${product.price}). Is it available?`);
              window.open(`https://wa.me/917002493059?text=${message}`, '_blank');
            }}
            className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-black py-3 px-6 font-display font-medium flex items-center justify-center gap-2 transition-colors border border-black text-xs font-bold"
            id={`buy-now-${product.id}`}
          >
            BUY NOW
          </button>
        </div>
        {/* Category Label */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 border border-black text-[10px] uppercase tracking-widest font-bold">
          {product.category}
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-start gap-1">
        <div className="flex justify-between w-full items-start">
          <h3 className="text-xl font-display font-medium uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="text-xl font-display font-bold">
            ${product.price}
          </p>
        </div>
        <p className="text-sm text-black/50 line-clamp-2 max-w-[280px]">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
