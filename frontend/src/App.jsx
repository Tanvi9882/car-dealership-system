import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ShoppingBagDrawer from './components/ShoppingBagDrawer';
import CheckoutModal from './components/CheckoutModal';
import { vehicleAPI } from './services/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Shopping Bag Cart State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('car_dealership_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [refreshInventoryTrigger, setRefreshInventoryTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('car_dealership_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Cart operations
  const handleAddToCart = (vehicle) => {
    if (vehicle.quantity <= 0) {
      alert("This vehicle is currently out of stock.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.vehicle.id === vehicle.id);
      if (existing) {
        if (existing.quantity >= vehicle.quantity) {
          alert(`Maximum available stock (${vehicle.quantity}) reached for this vehicle.`);
          return prev;
        }
        return prev.map((item) =>
          item.vehicle.id === vehicle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { vehicle, quantity: 1 }];
    });

    setIsBagOpen(true);
  };

  const handleUpdateQuantity = (vehicleId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.vehicle.id === vehicleId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.vehicle.quantity) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (vehicleId) => {
    setCart((prev) => prev.filter((item) => item.vehicle.id !== vehicleId));
  };

  const handleCompletePurchase = async (cartItems, formData) => {
    for (const item of cartItems) {
      for (let i = 0; i < item.quantity; i++) {
        await vehicleAPI.purchase(item.vehicle.id);
      }
    }
    setCart([]);
    setRefreshInventoryTrigger((prev) => prev + 1);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar
          user={user}
          onLogout={handleLogout}
          cartCount={cartCount}
          onOpenBag={() => setIsBagOpen(true)}
        />
        
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard
                    user={user}
                    cart={cart}
                    onAddToCart={handleAddToCart}
                    onRefreshInventory={refreshInventoryTrigger}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register />}
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </main>

        {/* Shopping Bag Side Drawer */}
        <ShoppingBagDrawer
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onProceedToCheckout={() => {
            setIsBagOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Boutique Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          user={user}
          onCompletePurchase={handleCompletePurchase}
        />

        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <p>© 2026 DrivePulse Dealership System. TDD Architecture & JWT Authentication.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

