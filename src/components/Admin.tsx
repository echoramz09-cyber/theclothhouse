import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';
import { LogOut, Plus, Trash2, Package, DollarSign, Image as ImageIcon, Type, Upload, Loader2 } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) fetchProducts();
    });
    return unsubscribe;
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Quality 0.7 to keep it small
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProducts = async () => {
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const email = `${username.trim()}@theclothhouse.com`;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select an image file');
    
    setUploading(true);
    setFormError('');

    try {
      // 1. Compress and convert to Base64
      const base64Image = await compressImage(imageFile);

      // 2. Direct upload to Firestore (stays in the database!)
      const path = 'products';
      await addDoc(collection(db, path), {
        ...formData,
        image: base64Image,
        price: parseFloat(formData.price),
        createdAt: serverTimestamp()
      });

      setIsAdding(false);
      setFormData({ name: '', price: '', description: '', category: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
      alert('Product successfully published to the house!');
    } catch (err: any) {
      console.error('Submit error:', err);
      setFormError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
      <div className="w-12 h-12 border-4 border-brand-yellow border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite p-6">
        <div className="w-full max-w-md bg-white border border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-display font-bold uppercase mb-8 text-center">Admin <span className="text-brand-yellow-dark">Login</span></h2>
          <form onSubmit={handleLogin} className="space-y-6 text-xs uppercase tracking-widest font-bold">
            <div>
              <label className="block mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border border-black outline-none focus:bg-brand-yellow/10"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-black outline-none focus:bg-brand-yellow/10"
                required
              />
            </div>
            {error && <p className="text-red-500 text-[10px]">{error}</p>}
            <button type="submit" className="w-full bg-brand-black text-white py-5 hover:bg-brand-yellow hover:text-black transition-colors border border-black">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-offwhite p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-display font-bold uppercase tracking-tighter">House <span className="text-brand-yellow-dark">Dashboard</span></h1>
            <p className="text-black/50 text-xs uppercase tracking-widest mt-2">Logged in as: {user.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 bg-brand-yellow px-6 py-3 border border-black font-bold text-xs uppercase hover:bg-brand-yellow-dark transition-colors"
            >
              <Plus size={16} />
              {isAdding ? 'Cancel' : 'Add Product'}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-black px-6 py-3 font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {isAdding && (
          <div className="bg-white border border-black p-8 mb-12 shadow-[4px_4px_0px_0px_#FACC15]">
            <h3 className="text-xl font-display font-bold uppercase mb-8">New Architectural Piece</h3>
            <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-8 text-[10px] uppercase font-bold tracking-widest">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 mb-2"><Type size={14}/> Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border border-black outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-2"><DollarSign size={14}/> Price</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 border border-black outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-2"><Package size={14}/> Category</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Essential Tops"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-black outline-none"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 mb-4"><ImageIcon size={14}/> Image Piece</label>
                  <label className="block cursor-pointer group">
                    <div className="border-2 border-dashed border-black/20 p-8 text-center hover:border-black transition-colors bg-brand-offwhite">
                      {imagePreview ? (
                        <div className="relative aspect-video">
                          <img src={imagePreview} className="w-full h-full object-contain" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-white text-[10px] uppercase font-bold">Change Image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="mx-auto mb-4 text-black/30" size={32} />
                          <p className="text-black/40 text-[10px] uppercase font-bold tracking-widest">
                            Drop or select photographic file
                          </p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 mb-2">Description</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-black outline-none resize-none"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                {formError && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 p-3 border border-red-100">
                    {formError}
                  </p>
                )}
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-black text-white py-4 uppercase font-display font-bold tracking-widest hover:bg-brand-yellow hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Publishing to House...
                    </>
                  ) : (
                    'Publish to House'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-black overflow-hidden group">
              <div className="aspect-[4/5] relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDeleteProduct(p.id)}
                  className="absolute top-4 right-4 bg-white p-3 border border-black text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-display font-bold uppercase text-lg">{p.name}</h4>
                  <span className="font-display font-bold text-xl">${p.price}</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-black/30 mb-4">{p.category}</p>
                <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-black/10 text-black/30 uppercase font-bold tracking-[0.2em]">
              No products found in the database
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
