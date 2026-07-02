import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Shield, Users, Database, DollarSign, Award, Layers, Save } from 'lucide-react';

export const SubscriptionPlans = () => {
  const { showToast } = useAppState();
  const [selectedPlan, setSelectedPlan] = useState('Enterprise');
  const [plans, setPlans] = useState({
    Enterprise: { price: 1250, users: 2000, storage: 500, support: '24/7 Dedicated', customDomain: 'Included' },
    Standard: { price: 450, users: 500, storage: 100, support: 'Email & Phone', customDomain: 'Included' },
    Basic: { price: 150, users: 100, storage: 20, support: 'Email Only', customDomain: 'Not Included' },
    Free: { price: 0, users: 10, storage: 2, support: 'Community Forum', customDomain: 'Not Included' }
  });

  const handleUpdateLimit = (e) => {
    e.preventDefault();
    showToast(`Successfully updated subscription limits for the ${selectedPlan} tier!`, 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Object.entries(plans).map(([name, details]) => (
          <div 
            key={name} 
            onClick={() => setSelectedPlan(name)}
            className={`bg-slate-900 border p-5 rounded-2xl flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-300 relative overflow-hidden group ${
              selectedPlan === name ? 'border-indigo-500 bg-indigo-500/[0.02] shadow-indigo-500/5' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  name === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  name === 'Standard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-slate-800 text-slate-400 border border-white/5'
                }`}>
                  {name}
                </span>
                <div className="text-2xl font-extrabold text-slate-100 mt-3 font-mono">₹{details.price}/mo</div>
              </div>
              <Award className={`w-5 h-5 ${selectedPlan === name ? 'text-indigo-400' : 'text-slate-500'}`} />
            </div>
            <div className="flex flex-col gap-2 mt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> {details.users} User Capacity</div>
              <div className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-500" /> {details.storage} GB Cloud Storage</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Details & Limit Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl lg:col-span-2 flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-indigo-400" />
              Plan Tier Comparison Profile
            </h4>
            <p className="text-slate-400 text-xs mt-1">Detailed feature allocation metrics for the active corporate subscriptions.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 pr-4">Feature Allocation</th>
                  <th className="py-3 px-4">Basic</th>
                  <th className="py-3 px-4">Standard</th>
                  <th className="py-3 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Monthly Licensing Fee</td>
                  <td className="py-3 px-4 font-mono">₹150.00</td>
                  <td className="py-3 px-4 font-mono">₹450.00</td>
                  <td className="py-3 px-4 font-mono text-indigo-400">₹1,250.00</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Total User Capacity limit</td>
                  <td className="py-3 px-4 font-mono">100 Accounts</td>
                  <td className="py-3 px-4 font-mono">500 Accounts</td>
                  <td className="py-3 px-4 font-mono">2,000 Accounts</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Provisioned File Storage</td>
                  <td className="py-3 px-4 font-mono">20 GB</td>
                  <td className="py-3 px-4 font-mono">100 GB</td>
                  <td className="py-3 px-4 font-mono">500 GB</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Priority Support SLA</td>
                  <td className="py-3 px-4">Email support</td>
                  <td className="py-3 px-4">Email & Phone</td>
                  <td className="py-3 px-4">24/7 Dedicated SLA</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Corporate Domain Alias</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4">Yes</td>
                  <td className="py-3 px-4">Yes (Unlimited)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-indigo-400" />
              Configure {selectedPlan} Limits
            </h4>
            <p className="text-slate-400 text-xs mt-1">Adjust resource constraints globally for all tenants assigned this tier.</p>
          </div>

          <form onSubmit={handleUpdateLimit} className="flex flex-col gap-4 mt-2">
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Monthly Licensing Cost (₹)</span>
              <input 
                type="number" 
                value={plans[selectedPlan].price}
                onChange={(e) => setPlans(prev => ({
                  ...prev,
                  [selectedPlan]: { ...prev[selectedPlan], price: parseInt(e.target.value) || 0 }
                }))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" 
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-medium text-slate-300">User Account Quota</span>
              <input 
                type="number" 
                value={plans[selectedPlan].users}
                onChange={(e) => setPlans(prev => ({
                  ...prev,
                  [selectedPlan]: { ...prev[selectedPlan], users: parseInt(e.target.value) || 0 }
                }))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" 
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-medium text-slate-300">File Storage Capacity (GB)</span>
              <input 
                type="number" 
                value={plans[selectedPlan].storage}
                onChange={(e) => setPlans(prev => ({
                  ...prev,
                  [selectedPlan]: { ...prev[selectedPlan], storage: parseInt(e.target.value) || 0 }
                }))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500" 
              />
            </label>

            <button 
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              Save Plan Overrides
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
