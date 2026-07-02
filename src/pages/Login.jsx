import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import { Shield, Lock, Mail, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Default password for simplicity
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password');
    setTimeout(() => {
      const res = login(roleEmail, 'password');
      if (res.success) {
        navigate('/dashboard');
      }
    }, 100);
  };

  const demoAccounts = [
    { name: 'Super Admin', email: 'superadmin@ems.com', role: 'Platform', color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:border-cyan-400/50 hover:bg-cyan-500/10' },
    { name: 'Company Admin', email: 'admin@acme.com', role: 'Admin', color: 'border-teal-500/20 text-teal-400 bg-teal-500/5 hover:border-teal-400/50 hover:bg-teal-500/10' },
    { name: 'Manager', email: 'manager@acme.com', role: 'Approver', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-400/50 hover:bg-emerald-500/10' },
    { name: 'Employee', email: 'employee@acme.com', role: 'Filer', color: 'border-sky-500/20 text-sky-400 bg-sky-500/5 hover:border-sky-400/50 hover:bg-sky-500/10' },
    { name: 'Finance Team', email: 'finance@acme.com', role: 'Disburser', color: 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:border-indigo-400/50 hover:bg-indigo-500/10' },
    { name: 'Auditor', email: 'auditor@acme.com', role: 'Compliance', color: 'border-violet-500/20 text-violet-400 bg-violet-500/5 hover:border-violet-400/50 hover:bg-violet-500/10' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#050811]">
      {/* Dynamic glowing background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-center">
        
        {/* Left Side: Brand Showcase */}
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
              Streamlining Enterprise Spendings
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the next generation of multi-tenant expense automation. Robust compliance check, instant settlements, and flawless audit trails.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
              <span>Multi-Tenant Enterprise Isolation</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
              <span>Role-Based Workflow Automation</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-350 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
              <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
              <span>₹ INR Currency Settlement Standard</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Header info */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Secure Access Portal
              </span>
              <h2 className="text-2xl font-bold text-slate-100 mt-1">Welcome Back</h2>
              <p className="text-slate-400 text-xs">Login with your credentials or choose a pre-configured profile.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    placeholder="name@company.com"
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

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
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-650 text-slate-950 font-bold rounded-xl py-3 px-4 text-xs shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                Sign In to Account
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Demo Access Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-slate-800/60 flex-grow" />
              <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Quick Demo Profiles</span>
              <div className="h-px bg-slate-800/60 flex-grow" />
            </div>

            {/* Quick Login Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.name}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  className={`border rounded-2xl p-3 text-left flex flex-col gap-1 transition-all hover:scale-[1.03] cursor-pointer ${account.color}`}
                >
                  <span className="text-[10px] font-bold tracking-wide truncate">{account.name}</span>
                  <span className="text-[8px] opacity-60 truncate max-w-full font-medium">{account.email}</span>
                </button>
              ))}
            </div>

            <div className="text-center mt-2 text-xs text-slate-400">
              Need a new company or user profile?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer transition-all"
              >
                Register here
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
