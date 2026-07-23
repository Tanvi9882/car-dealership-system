import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ShoppingBagDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const defaultImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

  const subtotal = cart.reduce((acc, item) => acc + (item.vehicle.price * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Shopping Bag</h2>
                <p className="text-xs text-slate-400">{totalItems} {totalItems === 1 ? 'vehicle' : 'vehicles'} selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors border border-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800/60 border border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Shopping Bag is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Explore our luxury showroom and add high-performance vehicles to your bag.
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const vehicle = item.vehicle;
                const isAtMaxStock = item.quantity >= vehicle.quantity;

                return (
                  <div 
                    key={vehicle.id}
                    className="glass-card p-4 rounded-2xl border border-slate-800 flex gap-4 relative group"
                  >
                    {/* Vehicle Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={vehicle.image_url || defaultImage}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = defaultImage; }}
                      />
                    </div>

                    {/* Vehicle Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                            {vehicle.make}
                          </span>
                          <button
                            onClick={() => onRemoveItem(vehicle.id)}
                            className="text-xs font-semibold text-rose-400/80 hover:text-rose-400 flex items-center gap-1 transition-colors uppercase tracking-wider text-[10px]"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{vehicle.model}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {vehicle.fuel_type || 'Petrol'} • {vehicle.transmission || 'Automatic'} • {vehicle.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
                        <span className="text-sm font-black text-emerald-400">
                          ₹{vehicle.price.toLocaleString('en-IN')}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800">
                          <button
                            onClick={() => onUpdateQuantity(vehicle.id, -1)}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(vehicle.id, 1)}
                            disabled={isAtMaxStock}
                            className={`p-1.5 transition-colors ${
                              isAtMaxStock 
                                ? 'text-slate-600 cursor-not-allowed' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title={isAtMaxStock ? "Max stock reached" : "Increase quantity"}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-sm font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Taxes and complimentary boutique shipping calculated at checkout.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Encrypted & Verified Transaction
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
