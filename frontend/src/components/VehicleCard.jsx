import React, { useState } from 'react';
import { ShoppingBag, AlertTriangle, Layers, Sparkles, TrendingDown, Info, Eye, Fuel, Cog, Users } from 'lucide-react';

export default function VehicleCard({ vehicle, onPurchase, isUserLoggedIn, onViewDetails }) {
  const [purchasing, setPurchasing] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

  const handlePurchaseClick = async (e) => {
    e.stopPropagation();
    if (!isUserLoggedIn) {
      alert("Please login to purchase vehicles!");
      return;
    }
    setPurchasing(true);
    try {
      await onPurchase(vehicle.id);
    } finally {
      setPurchasing(false);
    }
  };

  const isOutOfStock = vehicle.quantity <= 0;

  // Price Insight Badge Styling
  const getPriceInsightBadge = () => {
    switch (vehicle.price_insight) {
      case 'Good Value':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingDown className="w-3 h-3" />
            Good Value
          </span>
        );
      case 'Premium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" />
            Premium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Info className="w-3 h-3 text-indigo-400" />
            Average
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(vehicle)}
      className="group glass-card rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={vehicle.image_url || defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider">
          {vehicle.category}
        </span>

        {/* Stock Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
          isOutOfStock 
            ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' 
            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
        }`}>
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Available`}
        </span>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 bg-slate-900/90 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 shadow-lg">
            <Eye className="w-4 h-4 text-indigo-400" />
            View Details & Recommendations
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              {vehicle.make}
            </div>
            {getPriceInsightBadge()}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
            {vehicle.model}
          </h3>

          {/* Specs Bar (Fuel, Transmission, Seating) */}
          <div className="flex items-center gap-2 flex-wrap mb-3 text-[11px] font-semibold text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300">
              <Fuel className="w-3 h-3 text-indigo-400" />
              {vehicle.fuel_type || 'Petrol'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Cog className="w-3 h-3 text-purple-400" />
              {vehicle.transmission || 'Automatic'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Users className="w-3 h-3 text-emerald-400" />
              {vehicle.seating_capacity} Seats
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mb-4">
            <span className="text-xs text-slate-400 font-medium">
              {vehicle.price_range ? 'Ex-Showroom Price' : 'Price'}
            </span>
            <div className="text-right">
              {vehicle.price_range ? (
                <span className="text-lg sm:text-xl font-black text-emerald-400">
                  {vehicle.price_range}
                </span>
              ) : (
                <span className="text-2xl font-black text-emerald-400">
                  ₹{vehicle.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Action Button */}
        <button
          onClick={handlePurchaseClick}
          disabled={isOutOfStock || purchasing}
          id={`purchase-btn-${vehicle.id}`}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
            isOutOfStock
              ? 'bg-slate-800/60 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : purchasing
              ? 'bg-indigo-700 text-white cursor-wait opacity-80'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'
          }`}
        >
          {isOutOfStock ? (
            <>
              <AlertTriangle className="w-4 h-4 text-slate-500" />
              Out of Stock
            </>
          ) : purchasing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Purchase Vehicle
            </>
          )}
        </button>
      </div>
    </div>
  );
}
