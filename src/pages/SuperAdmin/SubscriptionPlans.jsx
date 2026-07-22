import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { BILLING_ENDPOINTS } from '../../constants/apiConstants';
import { Shield, Users, Database, DollarSign, Award, Layers, Save, Plus, TrendingUp, CreditCard, AlertTriangle, Loader2 } from 'lucide-react';
import { PageSkeleton } from '../../components/PageSkeleton';

export const SubscriptionPlans = () => {
  const { showToast, currentUser } = useAppState();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingStats, setBillingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewCycle, setViewCycle] = useState('Monthly');

  const CYCLE_DISCOUNT = { Monthly: 0, Quarterly: 0.10, 'Half-Yearly': 0.20, Yearly: 0.30 };
  const CYCLE_MONTHS   = { Monthly: 1, Quarterly: 3,    'Half-Yearly': 6,    Yearly: 12 };

  const getEffectivePrice = (plan, cycle) => {
    const disc = CYCLE_DISCOUNT[cycle] ?? 0;
    return Math.round((plan.priceMonthly || 0) * (1 - disc));
  };

  const getBilledTotal = (plan, cycle) => {
    return getEffectivePrice(plan, cycle) * (CYCLE_MONTHS[cycle] ?? 1);
  };

  // Editable form state for the selected plan
  const [editForm, setEditForm] = useState({
    priceMonthly: 0,
    priceQuarterly: 0,
    priceHalfYearly: 0,
    priceYearly: 0,
    userLimit: 0,
    storageGB: 0,
    branchLimit: 1,
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
  };

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(BILLING_ENDPOINTS.GET_PLANS, { headers });
        const data = await res.json();
        if (data.success && data.data) {
          setPlans(data.data);
          if (data.data.length > 0) {
            setSelectedPlan(data.data[data.data.length - 1]); // Select Enterprise by default
            setEditForm({
              priceMonthly: data.data[data.data.length - 1].priceMonthly,
              priceQuarterly: data.data[data.data.length - 1].priceQuarterly,
              priceHalfYearly: data.data[data.data.length - 1].priceHalfYearly || Math.round((data.data[data.data.length - 1].priceMonthly || 0) * 6 * 0.8),
              priceYearly: data.data[data.data.length - 1].priceYearly,
              userLimit: data.data[data.data.length - 1].userLimit,
              storageGB: data.data[data.data.length - 1].storageGB,
              branchLimit: data.data[data.data.length - 1].branchLimit,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(BILLING_ENDPOINTS.GET_BILLING_STATS, { headers });
        const data = await res.json();
        if (data.success) setBillingStats(data.data);
      } catch (error) {
        console.error('Failed to fetch billing stats:', error);
      }
    };

    fetchPlans();
    fetchStats();
  }, [currentUser]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setEditForm({
      priceMonthly: plan.priceMonthly,
      priceQuarterly: plan.priceQuarterly,
      priceHalfYearly: plan.priceHalfYearly || Math.round((plan.priceMonthly || 0) * 6 * 0.8),
      priceYearly: plan.priceYearly,
      userLimit: plan.userLimit,
      storageGB: plan.storageGB,
      branchLimit: plan.branchLimit,
    });
  };

  const handleUpdateLimit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setSaving(true);
    try {
      const res = await fetch(BILLING_ENDPOINTS.UPDATE_PLAN(selectedPlan._id), {
        method: 'PUT',
        headers,
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully updated ${selectedPlan.name} plan limits!`, 'success');
        // Update local state
        setPlans(prev => prev.map(p => p._id === selectedPlan._id ? { ...p, ...editForm } : p));
        setSelectedPlan(prev => ({ ...prev, ...editForm }));
      } else {
        showToast(data.message || 'Failed to update plan', 'error');
      }
    } catch (error) {
      showToast('Network error while updating plan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const planColors = {
    Trial: { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: 'text-amber-400' },
    Free: { badge: 'bg-slate-800 text-slate-400 border border-white/5', icon: 'text-slate-500' },
    Basic: { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: 'text-emerald-400' },
    Standard: { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: 'text-blue-400' },
    Enterprise: { badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', icon: 'text-purple-400' },
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue Stats */}
      {billingStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Revenue</span>
              <span className="text-2xl font-extrabold text-slate-100 font-mono">₹{(billingStats.mrr || 0).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500">MRR from active subscriptions</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
              <span className="text-2xl font-extrabold text-indigo-400 font-mono">{billingStats.activeSubs || 0}</span>
              <span className="text-[10px] text-slate-500">Paid & active tenants</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trial Users</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{billingStats.trialSubs || 0}</span>
              <span className="text-[10px] text-slate-500">In 1-month trial period</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue / Expired</span>
              <span className="text-2xl font-extrabold text-rose-400 font-mono">{(billingStats.expiredSubs || 0) + (billingStats.suspendedSubs || 0)}</span>
              <span className="text-[10px] text-slate-500">Needs attention</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
          </div>
        </div>
      )}

      {/* Billing Cycle Switcher */}
      <div className="flex items-center gap-1 bg-slate-900 border border-white/5 rounded-xl p-1 w-fit">
        {['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map(cycle => (
          <button
            key={cycle}
            onClick={() => setViewCycle(cycle)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewCycle === cycle ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cycle}
            {CYCLE_DISCOUNT[cycle] > 0 && (
              <span className="ml-1 text-[9px] text-emerald-400">-{Math.round(CYCLE_DISCOUNT[cycle] * 100)}%</span>
            )}
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const effPerMonth = getEffectivePrice(plan, viewCycle);
          const billedTotal = getBilledTotal(plan, viewCycle);
          const disc = CYCLE_DISCOUNT[viewCycle];
          return (
            <div
              key={plan._id || plan.name}
              onClick={() => handleSelectPlan(plan)}
              className={`bg-slate-900 border p-5 rounded-2xl flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                selectedPlan?._id === plan._id ? 'border-indigo-500 bg-indigo-500/[0.02] shadow-indigo-500/5' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    planColors[plan.name]?.badge || 'bg-slate-800 text-slate-400 border border-white/5'
                  }`}>
                    {plan.name}
                  </span>
                  {disc > 0 && (
                    <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      -{Math.round(disc * 100)}% off
                    </span>
                  )}
                  <div className="text-2xl font-extrabold text-slate-100 mt-3 font-mono">
                    ₹{effPerMonth}<span className="text-sm text-slate-500 font-normal">/mo</span>
                  </div>
                  {viewCycle !== 'Monthly' && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      Billed <span className="font-semibold text-slate-200">₹{billedTotal.toLocaleString()}</span> {viewCycle.toLowerCase()}
                    </div>
                  )}
                </div>
                <Award className={`w-5 h-5 ${selectedPlan?._id === plan._id ? 'text-indigo-400' : planColors[plan.name]?.icon || 'text-slate-500'}`} />
              </div>
              <div className="flex flex-col gap-2 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> {plan.userLimit} User Capacity</div>
                <div className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-500" /> {plan.storageGB} GB Cloud Storage</div>
              </div>
              {billingStats?.planDistribution?.[plan.name] > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-slate-500">{billingStats.planDistribution[plan.name]} tenant{billingStats.planDistribution[plan.name] !== 1 ? 's' : ''} on this plan</span>
                </div>
              )}
            </div>
          );
        })}
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
                  {plans.map(p => (
                    <th key={p._id || p.name} className="py-3 px-4">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map(cycle => (
                  <tr key={cycle}>
                    <td className="py-3 pr-4 font-semibold text-slate-400">
                      {cycle} Price
                      {CYCLE_DISCOUNT[cycle] > 0 && (
                        <span className="ml-2 text-[9px] font-bold text-emerald-400">(-{Math.round(CYCLE_DISCOUNT[cycle] * 100)}%)</span>
                      )}
                    </td>
                    {plans.map(p => (
                      <td key={p._id || p.name} className={`py-3 px-4 font-mono ${selectedPlan?._id === p._id ? 'text-indigo-400' : ''}`}>
                        ₹{getEffectivePrice(p, cycle)}/mo
                        {cycle !== 'Monthly' && (
                          <span className="block text-[10px] text-slate-500">₹{getBilledTotal(p, cycle).toLocaleString()} total</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Total User Capacity limit</td>
                  {plans.map(p => (
                    <td key={p._id || p.name} className="py-3 px-4 font-mono">{p.userLimit?.toLocaleString() || '0'} Accounts</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Provisioned File Storage</td>
                  {plans.map(p => (
                    <td key={p._id || p.name} className="py-3 px-4 font-mono">{p.storageGB || 0} GB</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Priority Support SLA</td>
                  {plans.map(p => (
                    <td key={p._id || p.name} className="py-3 px-4">{p.supportLevel || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-400">Corporate Domain Alias</td>
                  {plans.map(p => (
                    <td key={p._id || p.name} className="py-3 px-4">{p.customDomain ? 'Yes' : 'No'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {selectedPlan && (
          <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-indigo-400" />
                Configure {selectedPlan.name} Limits
              </h4>
              <p className="text-slate-400 text-xs mt-1">Adjust resource constraints globally for all tenants assigned this tier.</p>
            </div>

            <form onSubmit={handleUpdateLimit} className="flex flex-col gap-4 mt-2">
              <p className="text-[10px] text-slate-500 -mb-2">Discounts (Q 10%, HY 20%, Y 30%) are auto-calculated from monthly price.</p>
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Monthly Base Price (₹)</span>
                <input
                  type="number"
                  value={editForm.priceMonthly}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priceMonthly: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>

              {/* Auto-derived discount preview */}
              {editForm.priceMonthly > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {[['Quarterly', 0.10, 3], ['Half-Yearly', 0.20, 6], ['Yearly', 0.30, 12]].map(([label, disc, months]) => (
                    <div key={label} className="rounded-lg bg-slate-800/60 border border-white/5 px-2 py-1.5 text-center">
                      <p className="text-[9px] text-slate-400 font-bold">{label}</p>
                      <p className="text-xs font-mono text-emerald-400">₹{Math.round(editForm.priceMonthly * (1 - disc))}/mo</p>
                      <p className="text-[9px] text-slate-500">₹{(Math.round(editForm.priceMonthly * (1 - disc)) * months).toLocaleString()} total</p>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span className="font-medium text-slate-300">User Account Quota</span>
                <input
                  type="number"
                  value={editForm.userLimit}
                  onChange={(e) => setEditForm(prev => ({ ...prev, userLimit: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span className="font-medium text-slate-300">File Storage Capacity (GB)</span>
                <input
                  type="number"
                  value={editForm.storageGB}
                  onChange={(e) => setEditForm(prev => ({ ...prev, storageGB: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Plan Overrides'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
