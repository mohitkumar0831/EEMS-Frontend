import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Shield, Plus, X, UserPlus, Mail, Briefcase } from 'lucide-react';

export const SuperAdmins = () => {
  const { users, showToast } = useAppState();
  const [adminsList, setAdminsList] = useState(() => 
    users.filter(u => u.role === 'SuperAdmin')
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Platform Operations'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    const newAdmin = {
      id: 'user-sa-' + Date.now(),
      name: formData.name,
      email: formData.email,
      role: 'SuperAdmin',
      tenantId: 'platform',
      department: formData.department
    };

    setAdminsList(prev => [...prev, newAdmin]);
    showToast(`Super Admin privileges granted to ${formData.name}!`, 'success');
    setFormData({ name: '', email: '', department: 'Platform Operations' });
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header Option */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-indigo-400" />
            Super Admins Index
          </h3>
          <p className="text-slate-400 text-xs mt-1">Platform operations executives with root-level orchestration access.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {isFormOpen ? 'Cancel' : 'Grant Root Privileges'}
        </button>
      </div>

      {/* Admin registration form */}
      {isFormOpen && (
        <form onSubmit={handleAddAdmin} className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex flex-col gap-4 animate-slide-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              New Platform Operator Details
            </h4>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-200">Full Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Alex Mercer"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-200">Corporate Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="alex.m@ems.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="font-medium text-slate-200">Department</span>
              <select
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              >
                <option value="Platform Operations">Platform Operations</option>
                <option value="Security Audits">Security Audits</option>
                <option value="Executive Administration">Executive Administration</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 cursor-pointer"
            >
              Grant Access
            </button>
          </div>
        </form>
      )}

      {/* Admins Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {adminsList.map((admin) => (
                <tr key={admin.id} className="transition-all hover:bg-white/[0.01]">
                  <td className="px-6 py-4 font-semibold text-slate-200">{admin.name}</td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      {admin.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase text-[9px] tracking-wide">
                      {admin.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
