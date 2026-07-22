import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;
      onLoginSuccess(access_token, user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-slate-800">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30 mb-4">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your DrivePulse account</p>
          </div>

          {/* Quick Demo Login Fillers */}
          <div className="mb-6 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wider">⚡ One-Click Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@dealership.com', 'admin123')}
                className="flex items-center justify-center gap-1.5 p-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/60 rounded-xl text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Account
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('user@dealership.com', 'user123')}
                className="flex items-center justify-center gap-1.5 p-2 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 rounded-xl text-xs font-semibold transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                User Account
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-950/60 border border-rose-900 text-rose-300 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  id="login-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
