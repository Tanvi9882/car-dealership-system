import React, { useState, useEffect } from 'react';
import { ShieldCheck, PlusCircle, Edit, Trash2, RefreshCw, Car, IndianRupee, Layers, Package, TrendingUp, Sparkles, TrendingDown, Info, BarChart3, PieChart } from 'lucide-react';
import AddVehicleModal from '../components/AddVehicleModal';
import EditVehicleModal from '../components/EditVehicleModal';
import { vehicleAPI } from '../services/api';

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Computed Stats
  const totalVehicles = vehicles.length;
  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const totalFleetValuation = vehicles.reduce((sum, v) => sum + (v.price * v.quantity), 0);

  // Category Breakdown for Sales & Inventory Chart
  const categoryCounts = vehicles.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + v.quantity;
    return acc;
  }, {});

  const totalCatUnits = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 1;

  // Price Tier Insights Breakdown
  const priceTierCounts = vehicles.reduce((acc, v) => {
    const tier = v.price_insight || 'Average';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, { 'Good Value': 0, 'Average': 0, 'Premium': 0 });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch inventory for management.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (newVehicleData) => {
    await vehicleAPI.create(newVehicleData);
    fetchVehicles();
  };

  const handleUpdateVehicle = async (id, updatedData) => {
    await vehicleAPI.update(id, updatedData);
    fetchVehicles();
  };

  const handleRestockVehicle = async (id, amount) => {
    await vehicleAPI.restock(id, amount);
    fetchVehicles();
  };

  const handleDeleteVehicle = async (id, make, model) => {
    if (window.confirm(`Are you sure you want to delete ${make} ${model} from system database?`)) {
      try {
        await vehicleAPI.delete(id);
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-8 rounded-3xl border border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Management & Analytics</h1>
            <p className="text-sm text-slate-400">Control fleet inventory, sales metrics & restock vehicles</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          id="admin-add-vehicle-btn"
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Vehicle
        </button>
      </div>

      {/* Overview Analytics Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Fleet Models</p>
            <p className="text-3xl font-black text-white mt-1">{totalVehicles}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Stock Units Available</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{totalStock}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Fleet Asset Valuation</p>
            <p className="text-2xl font-black text-purple-400 mt-1">₹{totalFleetValuation.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Out of Stock Alerts</p>
            <p className={`text-3xl font-black mt-1 ${outOfStockCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {outOfStockCount}
            </p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales & Inventory Analytics Visual Dashboard Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Inventory Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Stock Distribution by Category
            </h3>
            <span className="text-xs text-slate-500">Live Inventory Units</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalCatUnits) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-indigo-400">{count} units ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Price Insights Distribution Breakdown Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Price Insight Breakdown
            </h3>
            <span className="text-xs text-slate-500">Model Segmentation</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20 text-center space-y-1">
              <TrendingDown className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-2xl font-black text-emerald-400">{priceTierCounts['Good Value']}</p>
              <p className="text-[11px] font-bold uppercase text-slate-400">Good Value</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-700 text-center space-y-1">
              <Info className="w-6 h-6 text-indigo-400 mx-auto" />
              <p className="text-2xl font-black text-indigo-400">{priceTierCounts['Average']}</p>
              <p className="text-[11px] font-bold uppercase text-slate-400">Average</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-purple-500/20 text-center space-y-1">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
              <p className="text-2xl font-black text-purple-400">{priceTierCounts['Premium']}</p>
              <p className="text-[11px] font-bold uppercase text-slate-400">Premium</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            * AI Price Insights automatically categorizes models based on their relative pricing vs. category averages.
          </p>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Fleet Database Records</h2>
          <span className="text-xs font-semibold text-slate-400">{vehicles.length} Models Loaded</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading inventory data...</div>
        ) : vehicles.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No vehicles available in system.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Vehicle</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price Insight</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">#{v.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"}
                          alt={v.model}
                          className="w-12 h-9 object-cover rounded-lg bg-slate-950 border border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white">{v.make} {v.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-indigo-300 text-xs rounded-lg font-medium">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {v.price_insight === 'Good Value' && (
                        <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs rounded-lg font-bold">
                          Good Value
                        </span>
                      )}
                      {v.price_insight === 'Premium' && (
                        <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 text-xs rounded-lg font-bold">
                          Premium
                        </span>
                      )}
                      {v.price_insight === 'Average' && (
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs rounded-lg font-medium">
                          Average
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      ₹{v.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        v.quantity > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {v.quantity > 0 ? `${v.quantity} Units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedVehicle(v);
                            setIsEditOpen(true);
                          }}
                          className="p-2 text-purple-400 hover:bg-purple-950/60 rounded-lg border border-purple-900/50 transition-colors"
                          title="Edit / Restock"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v.id, v.make, v.model)}
                          className="p-2 text-rose-400 hover:bg-rose-950/60 rounded-lg border border-rose-900/50 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddVehicleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddVehicle}
      />

      <EditVehicleModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        vehicle={selectedVehicle}
        onUpdate={handleUpdateVehicle}
        onRestock={handleRestockVehicle}
      />

    </div>
  );
}
