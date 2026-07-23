import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles, Building2, MapPin, User, Mail } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  user,
  onCompletePurchase
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    streetAddress: '740 Park Avenue, Apt 12B',
    city: 'New York',
    postalCode: '10021',
    cardName: '',
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/28',
    cvv: '888'
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || 'Eleanor',
        lastName: nameParts.slice(1).join(' ') || 'Vance',
        email: user.email || 'eleanor.vance@domain.com',
        cardName: user.name || 'Eleanor Vance'
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        firstName: 'Eleanor',
        lastName: 'Vance',
        email: 'eleanor.vance@domain.com',
        cardName: 'Eleanor Vance'
      }));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const defaultImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

  const subtotal = cart.reduce((acc, item) => acc + (item.vehicle.price * item.quantity), 0);
  const taxRate = 0.08; // 8% estimated tax & registration
  const estimatedTax = Math.round(subtotal * taxRate);
  const total = subtotal + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const result = await onCompletePurchase(cart, formData);
      const orderId = `DP-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmed({
        orderId,
        items: [...cart],
        subtotal,
        tax: estimatedTax,
        total,
        client: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      });
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    setOrderConfirmed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ORDER CONFIRMATION STATE */}
        {orderConfirmed ? (
          <div className="p-8 sm:p-12 text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Transaction Successful</span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-1">Boutique Purchase Confirmed</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                Thank you, <strong className="text-white">{orderConfirmed.client}</strong>! Order confirmation <span className="text-indigo-400 font-mono font-bold">#{orderConfirmed.orderId}</span> has been dispatched to <strong className="text-white">{orderConfirmed.email}</strong>.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="max-w-xl mx-auto glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Order Breakdown
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {orderConfirmed.items.map((item) => (
                  <div key={item.vehicle.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{item.vehicle.make} {item.vehicle.model}</p>
                      <p className="text-slate-500">Qty: {item.quantity} • {item.vehicle.category}</p>
                    </div>
                    <span className="font-bold text-emerald-400">
                      ₹{(item.vehicle.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{orderConfirmed.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax & Registration</span>
                  <span className="text-white font-semibold">₹{orderConfirmed.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Delivery</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                  <span className="text-white">Total Paid</span>
                  <span className="text-emerald-400">₹{orderConfirmed.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="py-3.5 px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              Return to Showroom
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" /> DrivePulse Luxury Concierge
              </span>
              <h1 className="text-3xl font-serif text-white tracking-tight">Boutique Checkout</h1>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" autoComplete="off">
              
              {/* Form Input Columns (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Client Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    1. Client Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address (for order confirmation)
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    2. Shipping Address
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      required
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Postal / Zip Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    3. Payment Details
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        required
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        maxLength="4"
                        placeholder="•••"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Summary Sidebar (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-serif font-bold text-white">Order Summary</h3>

                {/* Items breakdown */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.vehicle.id} className="flex gap-3 items-center">
                      <img
                        src={item.vehicle.image_url || defaultImage}
                        alt={item.vehicle.model}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        onError={(e) => { e.target.src = defaultImage; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{item.vehicle.make} {item.vehicle.model}</h5>
                        <p className="text-[10px] text-slate-400">Qty: {item.quantity} • {item.vehicle.category}</p>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">
                        ₹{(item.vehicle.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-white font-semibold">₹{estimatedTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Express Courier Shipping</span>
                    <span className="text-amber-400 font-bold text-[10px] uppercase">Complimentary</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Total</span>
                    <span className="text-2xl font-black text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      COMPLETE PURCHASE (₹{total.toLocaleString('en-IN')})
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  256-Bit SSL Encrypted Checkout
                </div>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
