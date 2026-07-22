import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, ShieldAlert, LogOut, User as UserIcon, LayoutDashboard, PlusCircle, Search } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">Drive<span className="text-indigo-400">Pulse</span></span>
              <span className="block text-[10px] tracking-widest font-semibold uppercase text-indigo-300/80">Automotive Excellence</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Showroom
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-200 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
