import React, { useState, useEffect } from 'react';
import { X, Edit3, RefreshCw } from 'lucide-react';

export default function EditVehicleModal({ isOpen, onClose, vehicle, onUpdate, onRestock }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sports',
    price: '',
    quantity: 0,
    image_url: ''
  });
  const [restockAmount, setRestockAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        category: vehicle.category || 'Sports',
        price: vehicle.price || '',
        quantity: vehicle.quantity || 0,
        image_url: vehicle.image_url || '',
        fuel_type: vehicle.fuel_type || 'Petrol',
        transmission: vehicle.transmission || 'Automatic',
        seating_capacity: vehicle.seating_capacity || 5
      });
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onUpdate(vehicle.id, {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        seating_capacity: parseInt(formData.seating_capacity) || 5
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update vehicle.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    setError('');
    setLoading(true);
    try {
      await onRestock(vehicle.id, parseInt(restockAmount));
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to restock vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Vehicle / Inventory</h2>
            <p className="text-xs text-slate-400">Update details or add restock units</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-900 text-rose-300 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Restock Section */}
        <div className="mb-6 p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Quick Restock Stock
            </span>
            <span className="text-xs text-slate-400">Current Stock: <strong className="text-white">{vehicle.quantity}</strong></span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleRestock}
              disabled={loading}
              className="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors shadow"
            >
              + Add {restockAmount} Units to Inventory
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 pt-2 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200">Vehicle Specification Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Sports">Sports</option>
                <option value="Luxury">Luxury</option>
                <option value="Electric">Electric</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Truck">Truck</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Specs: Fuel, Transmission, Seats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Petrol / Diesel">Petrol / Diesel</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transmission</label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Manual / Automatic">Manual / Auto</option>
                <option value="Automatic (DSG)">Automatic (DSG)</option>
                <option value="Single-Speed EV">Single-Speed EV</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Seating</label>
              <input
                type="number"
                min="2"
                max="9"
                value={formData.seating_capacity}
                onChange={(e) => setFormData({ ...formData, seating_capacity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹)</label>
            <input
              type="number"
              step="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              required
            />
          </div>


          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-all shadow-md shadow-purple-600/20"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
