import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Sliders, Save, Database, Key, Shield, HelpCircle } from 'lucide-react';

export const SettingsPage = () => {
  const { showToast } = useAppState();
  const [activeTab, setActiveTab] = useState('config'); // 'config', 'security', 'backup'
  const [config, setConfig] = useState({
    platformName: 'ExpenseFlow Enterprise Systems',
    supportEmail: 'ops-support@expenseflow.com',
    selfReg: true,
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    passwordMinLength: 8,
    mfaRequired: true,
    backupDest: 's3://eems-tenant-archives-prod',
    backupSchedule: 'Daily'
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform settings saved successfully!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Tabs */}
      <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex flex-col gap-1.5 self-start shadow-sm">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'config' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Platform Profile Config
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'security' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Key className="w-4 h-4" />
          Security & Auth Policy
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === 'backup' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Database className="w-4 h-4" />
          Backup & Archiving
        </button>
      </div>

      {/* Main Settings Form Container */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl lg:col-span-3 flex flex-col gap-5 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col justify-between h-full gap-5">
          {activeTab === 'config' && (
            <div className="flex flex-col gap-4 animate-slide-in">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Platform Profile Config</h4>
                <p className="text-slate-400 text-xs mt-1">Configure user-facing brand identities and global portal rules.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <label className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Platform Instance Name</span>
                  <input
                    type="text"
                    value={config.platformName}
                    onChange={(e) => setConfig(prev => ({ ...prev, platformName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Global Operations Support Email</span>
                  <input
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs text-slate-400 md:col-span-2">
                  <span className="font-medium text-slate-300">SMTP Relay Gateway Host</span>
                  <input
                    type="text"
                    value={config.smtpHost}
                    onChange={(e) => setConfig(prev => ({ ...prev, smtpHost: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    required
                  />
                </label>

                <label className="flex items-center gap-3 border border-slate-850 bg-slate-950/20 p-4 rounded-xl mt-2 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={config.selfReg}
                    onChange={(e) => setConfig(prev => ({ ...prev, selfReg: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded accent-indigo-500 border border-slate-800 bg-slate-900 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Allow Tenant Self-Registration</span>
                    <span className="text-[10px] text-slate-500 leading-normal">Allows companies to register and provision spaces from the public sign-up route.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-4 animate-slide-in">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Security & Authorization Policy</h4>
                <p className="text-slate-400 text-xs mt-1">Enforce system login protocols and corporate credential settings.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <label className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Minimum Password Length</span>
                  <input
                    type="number"
                    value={config.passwordMinLength}
                    onChange={(e) => setConfig(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 8 }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    min="8"
                    max="32"
                  />
                </label>

                <label className="flex items-center gap-3 border border-slate-850 bg-slate-950/20 p-4 rounded-xl md:col-span-2">
                  <input
                    type="checkbox"
                    checked={config.mfaRequired}
                    onChange={(e) => setConfig(prev => ({ ...prev, mfaRequired: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded accent-indigo-500 border border-slate-800 bg-slate-900 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">Enforce Multi-Factor Authentication (MFA)</span>
                    <span className="text-[10px] text-slate-500 leading-normal">Require code verification on next login for all Operator/Admin accounts.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="flex flex-col gap-4 animate-slide-in">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Backup & Archiving Strategy</h4>
                <p className="text-slate-400 text-xs mt-1">Configure automatic backup destinations for tenant databases.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-2">
                <label className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Backup Frequency</span>
                  <select
                    value={config.backupSchedule}
                    onChange={(e) => setConfig(prev => ({ ...prev, backupSchedule: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Hourly">Hourly Incremental</option>
                    <option value="Daily">Daily Snapshot</option>
                    <option value="Weekly">Weekly Full</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs text-slate-400">
                  <span className="font-medium text-slate-300">AWS S3 Archiving Target Endpoint</span>
                  <input
                    type="text"
                    value={config.backupDest}
                    onChange={(e) => setConfig(prev => ({ ...prev, backupDest: e.target.value }))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                    required
                  />
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-slate-800 pt-4 mt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Save className="h-4 w-4" />
              Save Configuration Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
