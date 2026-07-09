import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock, Eye, EyeOff, Building2, ChevronLeft } from 'lucide-react';
import nriBg from '../assets/nri.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [isCollegeValidating, setIsCollegeValidating] = useState(true);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const validateSelectedCollege = async () => {
      const savedCollege = localStorage.getItem('selectedCollege');
      if (!savedCollege) {
        navigate('/');
        return;
      }

      if (savedCollege === 'System') {
        setCollegeName(savedCollege);
        setIsCollegeValidating(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/institutions');
        const institutions = Array.isArray(data?.institutions) ? data.institutions : [];
        const matched = institutions.find(
          (name) => name.toLowerCase() === savedCollege.toLowerCase()
        );

        if (!matched) {
          localStorage.removeItem('selectedCollege');
          navigate('/');
          return;
        }

        setCollegeName(matched);
      } catch (e) {
        setError('Unable to validate institution. Please try again.');
      } finally {
        setIsCollegeValidating(false);
      }
    };

    validateSelectedCollege();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isCollegeValidating || !collegeName) {
      setError('Institution validation is in progress. Please wait.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/login', { 
        email, 
        password,
        college: collegeName 
      });
      login(data);
      if (data.role === 'SuperAdmin') {
        navigate('/super-admin');
      } else if (data.role === 'HOD') {
        navigate('/hod-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during login');
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
      
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />

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
                <Building2 className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">{collegeName}</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/30">Secure Portal Sign In</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-sm animate-in zoom-in-95 duration-300">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Institutional Email</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/20 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-4 py-4.5 text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-indigo-500/30 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                  placeholder="name@college.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Account Password</label>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-white/5 bg-white/5 pl-12 pr-12 py-4.5 text-white placeholder:text-white/10 outline-none transition-all duration-300 focus:border-indigo-500/30 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/5 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 py-4.5 font-bold text-white transition-all duration-500 hover:bg-indigo-500 hover:shadow-[0_0_32px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                {loading ? 'Authenticating...' : 'Enter Dashboard'}
                {!loading && <LogIn size={18} className="transition-transform duration-500 group-hover:translate-x-1" />}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </form>

          <div className="mt-10 text-center space-y-4 pt-8 border-t border-white/5">
            <Link to="/reset-password" size="sm" className="block text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
              Forgot Password?
            </Link>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30">
              New Member?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-10 relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
          Encrypted Session
        </p>
      </footer>
    </div>
  );
};

export default Login;
