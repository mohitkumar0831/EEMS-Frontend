import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { Sliders, Save, Database, Key, ShieldCheck, Mail, Globe, Clock, Power, RefreshCw, HardDrive } from 'lucide-react';

const DEFAULT_CONFIG = {
  platformName: 'ExpenseFlow-EEMS',
  supportEmail: 'support@eems-system.com',
  selfReg: true,
  defaultCurrency: 'INR',
  timeZone: 'Asia/Kolkata',
  passwordMinLength: 8,
  mfaRequired: true,
  sessionTimeout: 60,
  backupDest: 'AWS S3 (ap-south-1)',
  backupSchedule: 'Daily',
  maintenanceMode: false
};

export const PlatformSettings = () => {
  const { showToast } = useAppState();
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('eems_superadmin_settings');
    if (saved) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem('eems_superadmin_settings', JSON.stringify(config));
      setIsSaving(false);
      showToast('Platform settings updated successfully', 'success');
    }, 600);
  };

  const tabs = [
    { id: 'config', label: 'Platform Config', icon: Sliders, color: 'text-indigo-400', bg: 'bg-indigo-500' },
    { id: 'security', label: 'Security Policy', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { id: 'system', label: 'System & Backup', icon: Database, color: 'text-rose-400', bg: 'bg-rose-500' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sliders className="w-48 h-48 text-white rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Global Settings
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
            Manage root-level platform configurations, security protocols, and system maintenance for all active tenant workspaces.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer border ${activeTab === tab.id
                ? `${tab.bg} text-white border-transparent shadow-lg shadow-${tab.bg.split('-')[1]}-500/20 scale-[1.02]`
                : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-slate-200 hover:border-white/10'
                }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Form Area */}
        <div className="lg:col-span-9 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSave} className="relative z-10 flex flex-col h-full gap-8">

            {/* PLATFORM CONFIG TAB */}
            {activeTab === 'config' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    Platform Identity & Localization
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Configure global branding and localization defaults.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-indigo-400 transition-colors">Platform Name</span>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={config.platformName}
                        onChange={e => setConfig({ ...config, platformName: e.target.value })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-indigo-400 transition-colors">Support Email</span>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={config.supportEmail}
                        onChange={e => setConfig({ ...config, supportEmail: e.target.value })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-indigo-400 transition-colors">Default Currency</span>
                    <select
                      value={config.defaultCurrency}
                      onChange={e => setConfig({ ...config, defaultCurrency: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-indigo-400 transition-colors">System Timezone</span>
                    <select
                      value={config.timeZone}
                      onChange={e => setConfig({ ...config, timeZone: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all shadow-inner appearance-none cursor-pointer"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC (Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </label>
                </div>

                <div className="mt-2 p-5 rounded-2xl bg-slate-950/30 border border-slate-800/80 flex items-center justify-between group hover:border-indigo-500/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200">Tenant Self-Registration</span>
                    <span className="text-xs text-slate-500 mt-0.5">Allow new companies to sign up and provision workspaces autonomously.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config.selfReg} onChange={e => setConfig({ ...config, selfReg: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Security & Access Policies
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Enforce strict authentication and authorization protocols across all tenants.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-emerald-400 transition-colors">Minimum Password Length</span>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        min="8"
                        max="32"
                        value={config.passwordMinLength}
                        onChange={e => setConfig({ ...config, passwordMinLength: Number(e.target.value) })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-emerald-400 transition-colors">Session Timeout (Minutes)</span>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        min="15"
                        max="1440"
                        value={config.sessionTimeout}
                        onChange={e => setConfig({ ...config, sessionTimeout: Number(e.target.value) })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-2 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between group hover:border-emerald-500/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-emerald-100">Enforce Multi-Factor Auth (MFA)</span>
                    <span className="text-xs text-emerald-500/70 mt-0.5">Require all admin users to configure 2FA on their next login.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config.mfaRequired} onChange={e => setConfig({ ...config, mfaRequired: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-rose-400" />
                    Infrastructure & Maintenance
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Manage database archiving, routine backups, and system downtime states.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-rose-400 transition-colors">Backup Destination</span>
                    <div className="relative">
                      <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={config.backupDest}
                        onChange={e => setConfig({ ...config, backupDest: e.target.value })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-rose-500 focus:bg-slate-900 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 group">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase group-focus-within:text-rose-400 transition-colors">Automated Snapshot Frequency</span>
                    <div className="relative">
                      <RefreshCw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select
                        value={config.backupSchedule}
                        onChange={e => setConfig({ ...config, backupSchedule: e.target.value })}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-rose-500 focus:bg-slate-900 transition-all shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="Hourly">Hourly Incremental</option>
                        <option value="Daily">Daily Full Snapshot</option>
                        <option value="Weekly">Weekly Deep Archive</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="mt-2 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between group hover:border-rose-500/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-rose-100 flex items-center gap-2">
                      <Power className="w-4 h-4" /> Global Maintenance Mode
                    </span>
                    <span className="text-xs text-rose-500/70 mt-0.5">Suspends all tenant access. Displays a maintenance screen to end users.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig({ ...config, maintenanceMode: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="mt-auto pt-6 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving Changes...' : 'Save Configuration'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
