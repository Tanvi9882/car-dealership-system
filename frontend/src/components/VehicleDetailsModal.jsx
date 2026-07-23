import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingDown, Info, ShoppingBag, AlertTriangle, Layers, ArrowRight, ShieldCheck, Fuel, Cog, Users } from 'lucide-react';
import { vehicleAPI } from '../services/api';

export default function VehicleDetailsModal({ isOpen, onClose, vehicle, onAddToCart, isUserLoggedIn, onSelectVehicle, inBagCount = 0 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const defaultImage = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    if (isOpen && vehicle) {
      fetchRecommendations();
    }
  }, [isOpen, vehicle]);

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await vehicleAPI.getRecommendations(vehicle.id, 3);
      setRecommendations(res.data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;
  const isMaxInBag = inBagCount >= vehicle.quantity;

  const handlePurchase = () => {
    if (onAddToCart) {
      onAddToCart(vehicle);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / Close button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 rounded-full backdrop-blur-md transition-colors border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Info Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Image */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={vehicle.image_url || defaultImage}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                {vehicle.category}
              </span>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Layers className="w-4 h-4" />
                  {vehicle.make}
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">{vehicle.model}</h2>
              </div>

              {/* Key Specifications Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                <div>
                  <Fuel className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-slate-500">Fuel Type</p>
                  <p className="text-xs font-bold text-white mt-0.5">{vehicle.fuel_type || 'Petrol'}</p>
                </div>
                <div>
                  <Cog className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-slate-500">Transmission</p>
                  <p className="text-xs font-bold text-white mt-0.5">{vehicle.transmission || 'Automatic'}</p>
                </div>
                <div>
                  <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-slate-500">Seating</p>
                  <p className="text-xs font-bold text-white mt-0.5">{vehicle.seating_capacity} Seater</p>
                </div>
              </div>

              {/* Price & Price Insight */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">Price Range</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                      {vehicle.price_range || `₹${vehicle.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {vehicle.price_insight === 'Good Value' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/10 shrink-0">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <span>Good Value</span>
                    </div>
                  )}
                  {vehicle.price_insight === 'Premium' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/10 shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Premium Segment</span>
                    </div>
                  )}
                  {vehicle.price_insight === 'Average' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 shrink-0">
                      <Info className="w-4 h-4 text-indigo-400" />
                      <span>Market Average</span>
                    </div>
                  )}
                </div>

                {/* Category Average & Insight Explanation */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-400 font-medium flex items-center gap-1.5">
                    <span>Category Avg:</span>
                    <strong className="text-slate-100 font-bold">
                      ₹{vehicle.category_average ? vehicle.category_average.toLocaleString('en-IN') : 'N/A'}
                    </strong>
                  </div>

                  {vehicle.price_insight === 'Good Value' && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
                      15%+ Below Category Average
                    </span>
                  )}
                  {vehicle.price_insight === 'Premium' && (
                    <span className="text-[11px] font-bold text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-800/60">
                      15%+ Above Category Average
                    </span>
                  )}
                  {vehicle.price_insight === 'Average' && (
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                      Within Normal Category Range
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status & Purchase */}
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                  isOutOfStock ? 'bg-rose-950/60 text-rose-300 border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units Available`}
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isOutOfStock || isMaxInBag}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : isMaxInBag
                      ? 'bg-slate-800 text-amber-400/70 border border-amber-500/30 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-slate-500" /> Out of Stock
                    </>
                  ) : isMaxInBag ? (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Max Stock in Bag ({inBagCount})
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Purchase Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendation Section */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Customers who viewed this car may also like...
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">AI Recommendations</span>
            </div>

            {loadingRecs ? (
              <div className="py-8 text-center text-xs text-slate-400">Finding similar vehicles...</div>
            ) : recommendations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No additional recommendations found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectVehicle && onSelectVehicle(rec)}
                    className="glass-card p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="h-28 rounded-lg overflow-hidden bg-slate-950">
                        <img
                          src={rec.image_url || defaultImage}
                          alt={rec.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => { e.target.src = defaultImage; }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-400">{rec.make}</p>
                        <h4 className="text-sm font-bold text-white truncate">{rec.model}</h4>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between mt-3">
                      <span className="text-xs font-black text-emerald-400">
                        ₹{rec.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-300 flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
