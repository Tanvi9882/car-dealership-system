import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles, Building2, MapPin, User, Mail, Truck, Calculator, Tag, Award, Check, PhoneCall, Landmark, QrCode, Palette } from 'lucide-react';
import { getColorsForModel, COLOR_HEX_MAP } from '../utils/carColors';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  user,
  onCompletePurchase
}) {
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+91 98765 43210',
    streetAddress: 'SG Highway, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380054',
    selectedColor: 'Diamond White',
    includeAccessories: true,
    paymentMode: 'booking', // 'booking', 'full', 'upi', 'bank_transfer', 'loan'
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/28',
    cvv: '888',
    upiId: 'user@okhdfcbank'
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Vehicle & Spec, 2: Delivery, 3: Payment
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showEmiCalculator, setShowEmiCalculator] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || 'Tanvi',
        lastName: nameParts.slice(1).join(' ') || 'Patel',
        email: user.email || 'tanvi.patel@dealership.com',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        firstName: 'Tanvi',
        lastName: 'Patel',
        email: 'tanvi.patel@dealership.com',
      }));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const defaultImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

  // Calculations for Indian Dealership On-Road Pricing
  const exShowroomTotal = cart.reduce((acc, item) => acc + (item.vehicle.price * item.quantity), 0);
  
  // Realistic Indian Dealership Breakdown
  const rtoCharges = Math.round(exShowroomTotal * 0.08); // 8% RTO Registration
  const insuranceCharges = Math.round(exShowroomTotal * 0.035); // 3.5% Comprehensive Insurance
  const fastagHandling = 2500; // FASTag & Logistics
  const accessoriesCost = formData.includeAccessories ? 15000 : 0;
  
  const grossTotal = exShowroomTotal + rtoCharges + insuranceCharges + fastagHandling + accessoriesCost;
  const onRoadTotal = Math.max(0, grossTotal - discountAmount);

  // Booking amount fixed token price
  const bookingAmount = 25000;
  const amountToPayNow = formData.paymentMode === 'booking' ? bookingAmount : onRoadTotal;

  // EMI Estimate (80% loan for 5 years @ 8.5% interest)
  const estLoanAmount = onRoadTotal * 0.8;
  const estEmiPerMonth = Math.round((estLoanAmount * (1 + 0.085 * 5)) / 60);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const codeUpper = promoCode.trim().toUpperCase();

    if (codeUpper === 'DRIVEPULSE25' || codeUpper === 'FESTIVE25K') {
      setDiscountAmount(25000);
      setAppliedCode(codeUpper);
    } else if (codeUpper === 'MAHINDRA10') {
      const disc = Math.round(exShowroomTotal * 0.05);
      setDiscountAmount(disc);
      setAppliedCode(codeUpper);
    } else if (codeUpper === 'WELCOME5000') {
      setDiscountAmount(5000);
      setAppliedCode(codeUpper);
    } else {
      setPromoError('Invalid promo code. Try DRIVEPULSE25 or FESTIVE25K');
    }
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
        exShowroomTotal,
        rtoCharges,
        insuranceCharges,
        fastagHandling,
        accessoriesCost,
        discountAmount,
        onRoadTotal,
        paidNow: amountToPayNow,
        paymentMode: formData.paymentMode,
        client: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.postalCode}`
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700/50 transition-colors"
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
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Booking Reservation Confirmed</span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-1">Vehicle Reserved Successfully!</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
                Thank you, <strong className="text-white">{orderConfirmed.client}</strong>! Booking reference <span className="text-indigo-400 font-mono font-bold">#{orderConfirmed.orderId}</span> has been issued. Our relationship manager will contact you at <strong className="text-white">{orderConfirmed.phone}</strong> for paperwork & delivery schedule.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="max-w-2xl mx-auto glass-card p-6 rounded-2xl border border-slate-800 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Booking Summary & On-Road Price
                </h4>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase rounded-full">
                  Status: Reserved
                </span>
              </div>

              {/* Reserved Vehicle Info */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {orderConfirmed.items.map((item) => (
                  <div key={item.vehicle.id} className="flex gap-3 items-center text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <img
                      src={item.vehicle.image_url || defaultImage}
                      alt={item.vehicle.model}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{item.vehicle.make} {item.vehicle.model}</p>
                      <p className="text-slate-400 text-[11px]">
                        Variant: Top Spec • Fuel: {item.vehicle.specs?.fuel_type || 'Diesel'} • Transmission: {item.vehicle.specs?.transmission || 'Manual'}
                      </p>
                      <p className="text-[10px] text-indigo-400 font-mono mt-0.5">VIN: MA1{Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white text-sm block">₹{(item.vehicle.price * item.quantity).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Ex-Showroom</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Ex-Showroom Total</span>
                  <span className="text-white font-semibold">₹{orderConfirmed.exShowroomTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>RTO Registration Charges (8%)</span>
                  <span className="text-white">₹{orderConfirmed.rtoCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Comprehensive Insurance</span>
                  <span className="text-white">₹{orderConfirmed.insuranceCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>FASTag & Dealer Handling</span>
                  <span className="text-white">₹{orderConfirmed.fastagHandling.toLocaleString('en-IN')}</span>
                </div>
                {orderConfirmed.accessoriesCost > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Genuine Accessories Package</span>
                    <span className="text-white">₹{orderConfirmed.accessoriesCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {orderConfirmed.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo Discount Applied</span>
                    <span>- ₹{orderConfirmed.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                  <span className="text-white">Total On-Road Price</span>
                  <span className="text-amber-400">₹{orderConfirmed.onRoadTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300">
                  <span>Amount Paid Now (Token Booking)</span>
                  <span>₹{orderConfirmed.paidNow.toLocaleString('en-IN')}</span>
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
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header Title */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" /> DrivePulse Official Dealership Checkout
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">Reserve & Purchase Vehicle</h1>
              </div>

              {/* Delivery Estimate Pill */}
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
                <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Delivery Location</p>
                  <p className="font-bold text-white text-xs">📍 {formData.city || 'Ahmedabad'} • <span className="text-emerald-400">7–10 Days</span></p>
                </div>
              </div>
            </div>

            {/* 9. Interactive Progress Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStep === 1
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white bg-slate-950/40'
                  }`}
                >
                  <span>1.</span> Specs & Plan
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStep === 2
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white bg-slate-950/40'
                  }`}
                >
                  <span>2.</span> Delivery Address
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStep === 3
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white bg-slate-950/40'
                  }`}
                >
                  <span>3.</span> Payment
                </button>
                <div className="py-2 rounded-xl text-slate-600 bg-slate-950/20 flex items-center justify-center gap-1">
                  <span>4.</span> Confirmation
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" autoComplete="off">
              
              {/* Form Input Columns (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* STEP 1: CLIENT & VEHICLE SPECS */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* 6. Vehicle Spec Card */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        Selected Vehicle Details
                      </h3>

                      {cart.map((item) => (
                        <div key={item.vehicle.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                          <div className="flex gap-4 items-center">
                            <img
                              src={item.vehicle.image_url || defaultImage}
                              alt={item.vehicle.model}
                              className="w-20 h-16 rounded-xl object-cover bg-slate-950 border border-slate-800"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-base">{item.vehicle.make} {item.vehicle.model}</h4>
                              <p className="text-xs text-amber-400 font-semibold">{item.vehicle.category}</p>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                VIN: MA1{Math.random().toString(36).substring(2, 11).toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-white block">₹{item.vehicle.price.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-500 uppercase">Ex-Showroom</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                              <span className="text-slate-500 block text-[10px]">Fuel Type</span>
                              <strong className="text-white">{item.vehicle.specs?.fuel_type || 'Diesel'}</strong>
                            </div>
                            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                              <span className="text-slate-500 block text-[10px]">Transmission</span>
                              <strong className="text-white">{item.vehicle.specs?.transmission || 'Manual'}</strong>
                            </div>
                            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                              <span className="text-slate-500 block text-[10px]">Seating</span>
                              <strong className="text-white">{item.vehicle.specs?.seating_capacity || '5 Seats'}</strong>
                            </div>
                            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                              <span className="text-slate-500 block text-[10px]">Variant</span>
                              <strong className="text-emerald-400">B6 (Top Spec)</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Color & Accessories Selection */}
                    <div className="space-y-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-amber-400" /> Official Exterior Color Option
                          </label>
                          <span className="text-xs font-bold text-amber-400">
                            {formData.selectedColor || (cart[0]?.vehicle ? getColorsForModel(cart[0].vehicle.model)[0] : 'Everest White')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(cart[0]?.vehicle ? getColorsForModel(cart[0].vehicle.model) : ['Everest White', 'Stealth Black', 'DSAT Silver']).map((color) => {
                            const hex = COLOR_HEX_MAP[color.toLowerCase()] || '#94A3B8';
                            const isSelected = formData.selectedColor === color;
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, selectedColor: color }))}
                                className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                                  isSelected
                                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-md'
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-slate-600 shrink-0"
                                  style={{ backgroundColor: hex }}
                                />
                                <span>{color}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          name="includeAccessories"
                          checked={formData.includeAccessories}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <div className="flex-1 text-xs">
                          <span className="font-bold text-white block">Include Genuine Dealership Accessories Package (+₹15,000)</span>
                          <span className="text-slate-400 text-[11px]">Includes All-Weather Floor Mats, Mudflaps, Body Cover & Chrome Accents.</span>
                        </div>
                      </label>
                    </div>

                    {/* Client Information */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                        <User className="w-4 h-4 text-indigo-400" />
                        Buyer / Owner Information
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
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
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Email Address
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
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Mobile Number (for WhatsApp Updates)
                          </label>
                          <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                    >
                      Proceed to Delivery Address →
                    </button>
                  </div>
                )}

                {/* STEP 2: 2. DELIVERY ADDRESS */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* 2. Delivery Address */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        2. Vehicle Delivery Address
                      </h3>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Doorstep / Residence Address
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            City / District
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
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Pincode
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

                    {/* 5. Add Delivery Estimate Box */}
                    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Estimated Doorstep Delivery</h4>
                          <p className="text-xs text-emerald-400 font-bold">📍 {formData.city || 'Ahmedabad'} Hub • Ready in 7–10 Days</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-11">
                        Free doorstep delivery or handover ceremony at nearest authorized DrivePulse Dealership.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-1/3 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-800"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="w-2/3 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                      >
                        Proceed to Payment Mode →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: 3. PAYMENT DETAILS & MODES */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* 3. Payment Methods Selector */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                        <CreditCard className="w-4 h-4 text-indigo-400" />
                        3. Choose Payment Method
                      </h3>

                      <div className="grid grid-cols-1 gap-2.5">
                        
                        {/* Option A: Pay Token Booking Amount */}
                        <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMode === 'booking'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="booking"
                            checked={formData.paymentMode === 'booking'}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-xs text-white block">Pay Token Booking Amount (₹25,000)</span>
                            <span className="text-[11px] text-slate-400">Reserve vehicle online; pay remaining balance at delivery.</span>
                          </div>
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase rounded-md">Recommended</span>
                        </label>

                        {/* Option B: UPI Instant Booking */}
                        <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMode === 'upi'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="upi"
                            checked={formData.paymentMode === 'upi'}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-xs text-white flex items-center gap-1.5">
                              <QrCode className="w-4 h-4 text-indigo-400" /> Instant UPI (GPay / PhonePe / Paytm)
                            </span>
                            <span className="text-[11px] text-slate-400">Fast 1-click token booking payment via VPA ID.</span>
                          </div>
                        </label>

                        {/* Option C: Loan / EMI Financing */}
                        <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMode === 'loan'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="loan"
                            checked={formData.paymentMode === 'loan'}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-xs text-white flex items-center gap-1.5">
                              <Calculator className="w-4 h-4 text-emerald-400" /> Apply Dealership Loan / EMI
                            </span>
                            <span className="text-[11px] text-slate-400">Zero down-payment options from HDFC, ICICI & SBI Auto Loans.</span>
                          </div>
                          <span className="text-emerald-400 font-bold text-xs">Est. ₹{estEmiPerMonth.toLocaleString('en-IN')}/mo</span>
                        </label>

                        {/* Option D: Bank Transfer / RTGS */}
                        <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMode === 'bank_transfer'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMode"
                            value="bank_transfer"
                            checked={formData.paymentMode === 'bank_transfer'}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-amber-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="font-bold text-xs text-white flex items-center gap-1.5">
                              <Landmark className="w-4 h-4 text-sky-400" /> Bank Transfer (RTGS / NEFT)
                            </span>
                            <span className="text-[11px] text-slate-400">Direct transfer to DrivePulse Corporate Account.</span>
                          </div>
                        </label>

                      </div>
                    </div>

                    {/* Payment Inputs depending on Mode */}
                    {(formData.paymentMode === 'booking' || formData.paymentMode === 'full') && (
                      <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Credit / Debit Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              required
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
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
                              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMode === 'upi' && (
                      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Enter UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          name="upiId"
                          required
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="username@upi"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
                        />
                        <p className="text-[10px] text-slate-400">A payment collect request will be sent to your UPI app.</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-1/3 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-800"
                      >
                        ← Back
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Order Summary Sidebar (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-base font-serif font-bold text-white">Dealership On-Road Summary</h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">INR (₹)</span>
                </div>

                {/* 1. Realistic Tax & On-Road Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Ex-Showroom Price</span>
                    <span className="font-bold text-white">₹{exShowroomTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>RTO Registration Charges (8%)</span>
                    <span className="text-white">₹{rtoCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Comprehensive Insurance</span>
                    <span className="text-white">₹{insuranceCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>FASTag & Logistics</span>
                    <span className="text-white">₹{fastagHandling.toLocaleString('en-IN')}</span>
                  </div>
                  {formData.includeAccessories && (
                    <div className="flex justify-between text-slate-400">
                      <span>Genuine Accessories Package</span>
                      <span className="text-white">₹{accessoriesCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
                      <span>Promo Discount ({appliedCode})</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">Total On-Road Price</span>
                      <span className="text-[10px] text-slate-500">Includes All Taxes & RTO</span>
                    </div>
                    <span className="text-xl font-black text-amber-400">₹{onRoadTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 7. EMI Calculator Banner */}
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Est. Dealership EMI:
                    </span>
                    <span className="text-xs font-black text-emerald-400">₹{estEmiPerMonth.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmiCalculator(!showEmiCalculator)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline block text-right"
                  >
                    {showEmiCalculator ? 'Hide EMI Details' : 'Check EMI Breakdown →'}
                  </button>

                  {showEmiCalculator && (
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1 animate-fade-in">
                      <div className="flex justify-between"><span>Down Payment (20%):</span><span className="text-white font-bold">₹{Math.round(onRoadTotal * 0.2).toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Loan Tenure:</span><span className="text-white font-bold">60 Months (5 Years)</span></div>
                      <div className="flex justify-between"><span>Interest Rate:</span><span className="text-white font-bold">8.5% p.a.</span></div>
                    </div>
                  )}
                </div>

                {/* 10. Add Coupon / Promo Code */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Have a Dealership Promo / Referral Code?
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. DRIVEPULSE25"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase focus:outline-none font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] text-rose-400 font-medium">{promoError}</p>}
                  {appliedCode && <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Coupon {appliedCode} applied successfully!</p>}
                </div>

                {/* 4. Action Button */}
                <button
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="w-full py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      Processing Reservation...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {formData.paymentMode === 'booking'
                        ? `PAY BOOKING AMOUNT (₹${bookingAmount.toLocaleString('en-IN')})`
                        : formData.paymentMode === 'loan'
                        ? `SUBMIT LOAN APPLICATION & RESERVE`
                        : `PAY ON-ROAD PRICE (₹${onRoadTotal.toLocaleString('en-IN')})`}
                    </>
                  )}
                </button>

                {/* 8. Trust Section */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>256-Bit Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>3-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Doorstep Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Relationship Manager</span>
                  </div>
                </div>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

