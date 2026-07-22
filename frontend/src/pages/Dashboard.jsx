import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Car, CheckCircle2, AlertTriangle, Sparkles, IndianRupee } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import SmartSearchBar from '../components/SmartSearchBar';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import { vehicleAPI } from '../services/api';

export default function Dashboard({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchMakeModel, setSearchMakeModel] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // AI Smart Search state
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);
  const [activeFilterSummary, setActiveFilterSummary] = useState('');

  // Details Modal state
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState(null);

  const brands = ['All', 'Mahindra', 'Kia', 'Skoda'];
  const categories = ['All', 'Compact SUV', 'SUV', 'Off-road SUV', 'Electric SUV', 'Luxury', 'Electric', 'Sedan', 'Sports'];

  const fetchVehicles = async () => {
    if (isAiSearchActive) return;

    setLoading(true);
    setError('');
    try {
      let response;
      if (searchMakeModel || selectedMake !== 'All' || selectedCategory !== 'All' || minPrice || maxPrice) {
        const params = {};
        if (searchMakeModel) params.make = searchMakeModel;
        if (selectedMake !== 'All') params.make = selectedMake;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        response = await vehicleAPI.search(params);
      } else {
        response = await vehicleAPI.getAll();
      }
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicle inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [searchMakeModel, selectedMake, selectedCategory, minPrice, maxPrice]);

  const handleSmartSearch = async (queryText) => {
    setLoading(true);
    setError('');
    setIsAiSearchActive(true);
    try {
      const res = await vehicleAPI.smartSearch(queryText);
      setVehicles(res.data.vehicles);
      setActiveFilterSummary(res.data.parsed_filters);
    } catch (err) {
      setError('AI Smart Search encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAiSearch = () => {
    setIsAiSearchActive(false);
    setActiveFilterSummary('');
    fetchVehicles();
  };

  const handlePurchase = async (vehicleId) => {
    try {
      const response = await vehicleAPI.purchase(vehicleId);
      const updatedVehicle = response.data;

      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? updatedVehicle : v))
      );

      if (selectedVehicleForModal && selectedVehicleForModal.id === vehicleId) {
        setSelectedVehicleForModal(updatedVehicle);
      }

      setNotification({
        type: 'success',
        message: `Congratulations! Successfully purchased ${updatedVehicle.make} ${updatedVehicle.model}.`
      });

      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Purchase failed.';
      setNotification({
        type: 'error',
        message: errorMsg
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicleForModal(vehicle);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 animate-slide-up max-w-md ${
          notification.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              {notification.type === 'success' ? 'Transaction Confirmed' : 'Purchase Error'}
            </p>
            <p className="text-sm font-medium mt-0.5">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl -z-0"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Enhanced Fleet Collection
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Discover Exceptional <span className="gradient-text">Performance</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our handpicked inventory of luxury SUVs, sports cars, and electric vehicles with AI Smart Search & Price Insights.
          </p>
        </div>
      </div>

      {/* AI Smart Search Bar */}
      <SmartSearchBar
        onSmartSearch={handleSmartSearch}
        onReset={handleResetAiSearch}
        activeFilterSummary={activeFilterSummary}
        loading={loading}
      />

      {/* Standard Search & Filter Controls */}
      {!isAiSearchActive && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Make / Model Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search make or model..."
                value={searchMakeModel}
                onChange={(e) => setSearchMakeModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-36">
                <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  placeholder="Min Price (₹)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <span className="text-slate-600 font-bold">-</span>
              <div className="relative flex-1 md:w-36">
                <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none border-t border-slate-800/60">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
              <Car className="w-3.5 h-3.5" />
              Brand:
            </span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedMake(b)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 ${
                  selectedMake === b
                    ? 'bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Showroom Vehicle Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Processing live fleet database...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 p-6 glass-card rounded-2xl border border-rose-900/40">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Failed to Load Vehicles</h3>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchVehicles}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Vehicles Match Criteria</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your natural language prompt or clear filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onPurchase={handlePurchase}
              isUserLoggedIn={!!user}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Vehicle Details & Recommendations Modal */}
      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={selectedVehicleForModal}
        onPurchase={handlePurchase}
        isUserLoggedIn={!!user}
        onSelectVehicle={(vehicle) => setSelectedVehicleForModal(vehicle)}
      />

    </div>
  );
}
