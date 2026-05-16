import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ChevronLeft, ShieldCheck } from 'lucide-react';
import nriBg from '../assets/nri.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Teacher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedCollege = localStorage.getItem('selectedCollege');
    if (!savedCollege) {
      navigate('/');
    } else {
      setCollegeName(savedCollege);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        ...formData,
        college: collegeName
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#080f1d] p-6 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 scale-105"
        style={{ backgroundImage: `url(${nriBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080f1d] via-transparent to-[#080f1d]" />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 flex justify-start px-2">
           <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group"
          >
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Switch Institution
          </button>
        </div>

        <div className="rounded-[40px] border border-white/20 bg-[#0a1221]/60 p-10 text-white shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl border-t-white/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 opacity-50" />
          
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-5 relative">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
                <UserPlus className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">Create Account</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/30">Joining {collegeName}</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-sm animate-in zoom-in-95 duration-300">
               <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-indigo-500/30 focus:bg-white/10 shadow-inner"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4 text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-indigo-500/30 focus:bg-white/10 shadow-inner"
                  placeholder="name@college.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/20 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-12 py-4 text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-indigo-500/30 focus:bg-white/10 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Teacher' })}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    formData.role === 'Teacher'
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]'
                      : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                  } border`}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'HOD' })}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    formData.role === 'HOD'
                      ? 'bg-indigo-600/30 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]'
                      : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                  } border`}
                >
                  HOD
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 py-4.5 font-bold text-white transition-all duration-500 hover:bg-indigo-500 hover:shadow-[0_0_32px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? 'Processing...' : 'Register Account'}
                {!loading && <ShieldCheck size={18} className="transition-transform duration-500 group-hover:scale-110" />}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-white/30 pt-8 border-t border-white/5">
            Already a member?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
