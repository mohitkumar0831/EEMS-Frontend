import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import { Shield, User, Mail, Lock, Building, Layers, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { registerUser, tenants, createTenant, showToast } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [companyName, setCompanyName] = useState(''); // For CompanyAdmin
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || ''); // For others
  const [department, setDepartment] = useState('Engineering');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalTenantId = selectedTenantId;

    if (role === 'CompanyAdmin') {
      if (!companyName.trim()) {
        showToast('Please enter a company name.', 'error');
        return;
      }
      const success = createTenant(companyName);
      if (!success) return;
      const savedTenants = JSON.parse(localStorage.getItem('ems_tenants')) || [];
      const newTenant = savedTenants.find(t => t.name.toLowerCase() === companyName.toLowerCase());
      if (newTenant) {
        finalTenantId = newTenant.id;
      } else {
        finalTenantId = 'tenant-' + Date.now();
      }
    }

    if (role === 'SuperAdmin') {
      finalTenantId = 'platform';
    }

    const res = registerUser(name, email, password, role, finalTenantId, department);
    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#050811]">
      {/* Dynamic glowing background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '11s' }} />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-center">
        
        {/* Left Side: Info Showcase */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 text-left pr-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-100">
              Expense<span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold text-slate-100 leading-tight">
              Create Your Spend Account
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join thousands of enterprises driving productivity and spend transparency with automated workflows.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
              <span>Register new workspace tenant or link existing</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              <span>Full compliance check checklist active</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
              <span>Zero-code setup and onboarding</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form Card */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Link */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Registration
                </span>
                <h2 className="text-xl font-bold text-slate-100">Create Account</h2>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-450 hover:text-cyan-400 cursor-pointer group transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-all" />
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'name' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe"
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="john@company.com"
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Select Role</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'role' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onFocus={() => setFocusedField('role')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-900 text-slate-200" value="Employee">Employee (Requester)</option>
                      <option className="bg-slate-900 text-slate-200" value="Manager">Manager (Approver)</option>
                      <option className="bg-slate-900 text-slate-200" value="CompanyAdmin">Company Admin (Tenant Admin)</option>
                      <option className="bg-slate-900 text-slate-200" value="Finance Team">Finance Team (Processor)</option>
                      <option className="bg-slate-900 text-slate-200" value="Auditor">Auditor (Reviewer)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Department Selection (For company staff) */}
              {role !== 'CompanyAdmin' && role !== 'SuperAdmin' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Department</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'department' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      onFocus={() => setFocusedField('department')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option className="bg-slate-900 text-slate-200" value="Engineering">Engineering</option>
                      <option className="bg-slate-900 text-slate-200" value="Sales">Sales</option>
                      <option className="bg-slate-900 text-slate-200" value="R&D">Research & Development</option>
                      <option className="bg-slate-900 text-slate-200" value="Finance">Finance / Accounting</option>
                      <option className="bg-slate-900 text-slate-200" value="HR">Human Resources</option>
                      <option className="bg-slate-900 text-slate-200" value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Company / Tenant Setup */}
              {role === 'CompanyAdmin' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Register New Company Name</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'companyName' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      onFocus={() => setFocusedField('companyName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter company name (e.g. Stark Industries)"
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              ) : role !== 'SuperAdmin' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400">Select Associated Company</label>
                  <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'selectedTenant' ? 'border-cyan-500 bg-slate-950/60 ring-2 ring-cyan-500/10' : 'border-slate-800 bg-slate-950/30'}`}>
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={selectedTenantId}
                      onChange={(e) => setSelectedTenantId(e.target.value)}
                      onFocus={() => setFocusedField('selectedTenant')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-2.5 pl-11 pr-4 text-xs text-slate-100 focus:outline-none appearance-none cursor-pointer"
                      required
                    >
                      {tenants.map(t => (
                        <option className="bg-slate-900 text-slate-200" key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-650 text-slate-950 font-bold rounded-xl py-3 px-4 text-xs shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                Create Workspace Account
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
