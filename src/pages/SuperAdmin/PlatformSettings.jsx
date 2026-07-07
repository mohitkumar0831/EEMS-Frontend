import React, { useState } from 'react';
import { Sliders, Save, Server, Shield, CreditCard } from 'lucide-react';
import { useAppState } from '../../context/StateContext';

export const PlatformSettings = () => {
  const { showToast } = useAppState();
  const [isSaving, setIsSaving] = useState(false);

  // Simple state for dummy settings
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    requireMfa: true,
    allowSignups: true,
    systemCurrency: 'INR'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Platform settings updated successfully', 'success');
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-indigo-400" />
            Global Platform Settings
          </h3>
          <p className="text-slate-400 text-xs mt-1">Configure system-wide variables and platform accessibility.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-5">
          <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 pb-3 border-b border-white/5">
            <Server className="w-4 h-4 text-emerald-400" /> Core System
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-slate-200">Maintenance Mode</span>
              <span className="text-xs text-slate-500">Temporarily disables tenant access for system upgrades.</span>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-indigo-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.maintenanceMode ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-slate-200">Public Signups</span>
              <span className="text-xs text-slate-500">Allow new companies to register via the public website.</span>
            </div>
            <button 
              onClick={() => handleToggle('allowSignups')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.allowSignups ? 'bg-indigo-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.allowSignups ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Security & Billing Settings */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-5">
          <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 pb-3 border-b border-white/5">
            <Shield className="w-4 h-4 text-purple-400" /> Security & Billing
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-slate-200">Force MFA Globally</span>
              <span className="text-xs text-slate-500">Require all users across all tenants to use MFA.</span>
            </div>
            <button 
              onClick={() => handleToggle('requireMfa')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.requireMfa ? 'bg-indigo-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.requireMfa ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="block text-sm font-semibold text-slate-200 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Default Currency
              </span>
              <span className="text-xs text-slate-500">Base currency for platform subscription billing.</span>
            </div>
            <select 
              value={settings.systemCurrency}
              onChange={(e) => setSettings(prev => ({ ...prev, systemCurrency: e.target.value }))}
              className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
