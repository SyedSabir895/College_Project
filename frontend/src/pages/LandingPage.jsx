import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, ArrowRight, CheckCircle2, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import nriBg from '../assets/nri.png';

const LandingPage = () => {
  const [collegeName, setCollegeName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Check if college is already selected
    const savedCollege = localStorage.getItem('selectedCollege');
    if (savedCollege) {
      setCollegeName(savedCollege);
    }
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    if (collegeName.trim()) {
      localStorage.setItem('selectedCollege', collegeName.trim());
      navigate('/login');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#080f1d] relative overflow-hidden p-6"
    >
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 scale-105"
        style={{ 
          backgroundImage: `url(${nriBg})`,
          transform: isVisible ? 'scale(1)' : 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080f1d]/90 via-[#080f1d]/70 to-[#080f1d]/90 backdrop-blur-[2px]" />

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />

      <div className={`w-full max-w-4xl text-center mb-12 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Next-Gen Academic Management</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Manage Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 animate-gradient-x">
            College Operations
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
          The ultimate multi-tenant task management system designed specifically for educational institutions. 
          Empower HODs, simplify teacher workflows, and elevate productivity.
        </p>
      </div>

      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="rounded-[40px] border border-white/20 bg-white/5 p-1 pt-1 shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
          
          <div className="relative rounded-[39px] bg-[#0a1221]/40 p-10 backdrop-blur-xl border border-white/5">
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="mb-5 relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                <div className="relative rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/30 to-blue-600/30 p-5 shadow-2xl backdrop-blur-md">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Institutional Access</h2>
              <p className="mt-3 text-sm text-white/50 font-medium">Please enter your college name to proceed to your dedicated portal</p>
            </div>

            <form onSubmit={handleContinue} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-indigo-400/80 ml-1">College / Organization Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. NRI Institute of Technology"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4.5 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-6 py-4.5 font-bold text-white transition-all duration-500 hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Access Portal
                  <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </button>
            </form>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors">
                <div className="rounded-full bg-green-500/20 p-1">
                  <ShieldCheck size={14} className="text-green-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors">
                <div className="rounded-full bg-indigo-500/20 p-1">
                  <Sparkles size={14} className="text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Cloud Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-12 relative z-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col items-center gap-4`}>
        <button 
          onClick={() => {
            localStorage.setItem('selectedCollege', 'System');
            navigate('/login');
          }}
          className="text-white/20 hover:text-indigo-400/60 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
        >
          System Administration Access
        </button>
        <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em]">
          Powered by Ethara AI Technologies
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
