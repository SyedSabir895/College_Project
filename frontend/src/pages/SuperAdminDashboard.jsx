import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { 
  Building2, 
  Users, 
  Plus, 
  Search, 
  Mail, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Globe, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [institutions, setInstitutions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    adminEmail: '',
    adminName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [instRes, statsRes] = await Promise.all([
        api.get('/superadmin/institutions'),
        api.get('/superadmin/stats')
      ]);
      setInstitutions(instRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching superadmin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/superadmin/institutions', formData);
      setShowModal(false);
      setFormData({ name: '', adminEmail: '', adminName: '' });
      fetchData();
      alert('Institution created and credentials shared with admin!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error creating institution';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && institutions.length === 0) {
    return (
      <div className="min-h-screen bg-[#080f1d] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080f1d] text-white">
      <Navbar title="SuperAdmin Central" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Platform Governance</h1>
            <p className="text-white/40 mt-1 font-medium tracking-wide uppercase text-[10px]">Manage global institutions and system access</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 rounded-2xl font-bold transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-[0.98]"
          >
            <Plus size={20} />
            Register Institution
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Total Institutions" 
            value={stats?.totalInstitutions || 0} 
            icon={<Globe className="text-blue-400" />} 
            trend="+12% this month"
          />
          <StatCard 
            label="Platform Users" 
            value={stats?.totalUsers || 0} 
            icon={<Users className="text-indigo-400" />} 
            trend="+240 active"
          />
          <StatCard 
            label="Tasks Managed" 
            value={stats?.totalTasks || 0} 
            icon={<Activity className="text-emerald-400" />} 
            trend="98% delivery rate"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Building2 className="text-indigo-400" />
              Registered Organizations
            </h3>
            <div className="relative group max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  <th className="px-6 py-4">Institution Name</th>
                  <th className="px-6 py-4">Primary Admin</th>
                  <th className="px-6 py-4">User Base</th>
                  <th className="px-6 py-4">Security</th>
                  <th className="px-6 py-4">Created On</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map((inst) => (
                  <tr key={inst._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 bg-white/5 rounded-l-2xl border-y border-l border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <Building2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="font-bold tracking-tight">{inst.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{inst.adminEmail}</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Institutional Admin</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5 text-center">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-indigo-400" />
                        <span className="font-bold text-lg">{inst.userCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5">
                      <span className="text-xs font-medium text-white/50">
                        {new Date(inst.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-5 bg-white/5 rounded-r-2xl border-y border-r border-white/5">
                      <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10 group-hover:border-indigo-500/30">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-[#080f1d]/60">
          <div className="w-full max-w-md bg-[#0a1221] rounded-[40px] border border-white/10 p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-6">
                <Plus className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold">New Institution</h2>
              <p className="text-white/40 text-sm mt-2">Initialize a new organization node and provision admin credentials.</p>
            </div>

            <form onSubmit={handleCreateInstitution} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Admin Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Miller"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all text-sm"
                  value={formData.adminName}
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    type="email"
                    required
                    placeholder="admin@institution.edu"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-indigo-500/50 transition-all text-sm"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-white/5 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-500 px-6 py-4 rounded-2xl font-bold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Initializing...' : 'Confirm & Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, trend }) => (
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
    </div>
    <div className="flex items-end gap-3">
      <span className="text-4xl font-black tracking-tight">{value}</span>
      <div className="mb-2 flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full">
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
  </div>
);

export default SuperAdminDashboard;
