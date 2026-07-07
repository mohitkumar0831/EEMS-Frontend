import React from 'react';
import { useAppState } from '../../context/StateContext';
import {
  Building2,
  Users,
  ShieldCheck,
  Activity,
  AlertCircle,
  Database
} from 'lucide-react';

export const PlatformReportsTab = () => {
  const { tenants, showToast } = useAppState();

  // Compute Platform KPIs
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'Active').length;
  const suspendedTenants = tenants.filter(t => t.status === 'Suspended').length;
  const totalUsers = tenants.reduce((acc, t) => acc + (t.userCount || 0), 0);

  // Static Plan mappings for visual rendering
  const getTenantPlan = (tenant) => {
    // Ideally this would come from tenant object if we implement subscriptions in DB
    if (tenant.subscriptionPlan) return tenant.subscriptionPlan;
    if (tenant.id === 'tenant-1') return 'Enterprise';
    if (tenant.id === 'tenant-2') return 'Standard';
    return 'Basic';
  };

  const getTenantBillingRate = (plan) => {
    switch (plan) {
      case 'Enterprise': return 1250;
      case 'Standard': return 450;
      case 'Basic': return 150;
      case 'Free': return 0;
      default: return 150;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            Global Platform Analytics & Reports
          </h3>
          <p className="text-slate-400 text-xs mt-1">Multi-tenant statistics, subscription tiers, and platform licensing metrics.</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Provisioned Workspaces */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Workspaces</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{totalTenants}</span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-indigo-400" /> Dedicated Databases
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 z-10">
            <Building2 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Active Subscriptions */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{activeTenants}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              {(activeTenants / (totalTenants || 1) * 100).toFixed(1)}% of total platform
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10">
            <Activity className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Suspended Accounts */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended Accounts</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{suspendedTenants}</span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
              <AlertCircle className={`w-3.5 h-3.5 ${suspendedTenants > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              Requires intervention
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 z-10">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Platform User Volume */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform User Volume</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{totalUsers}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              Avg {(totalUsers / (totalTenants || 1)).toFixed(1)} per tenant
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 z-10">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Subscription Plans & Billing control */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm mt-2">
        <div className="border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
              Multi-Tenant Subscription & Billing Control
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Manage subscription contracts, licensing limits, and billing states.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-3.5">Workspace</th>
                <th className="px-6 py-3.5">Plan tier</th>
                <th className="px-6 py-3.5">Billing Status</th>
                <th className="px-6 py-3.5">User Capacity Used</th>
                <th className="px-6 py-3.5">Monthly rate</th>
                <th className="px-6 py-3.5">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {tenants.map((t) => {
                const plan = getTenantPlan(t);
                const status = t.status || 'Active';
                const rate = getTenantBillingRate(plan);
                const tenantUsers = t.userCount || 0;
                const capacity = t.employeeCapacity || '500';

                return (
                  <tr key={t.id} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{t.name}</span>
                        <span className="font-mono text-[9px] text-slate-500 mt-0.5">{t.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${plan === 'Enterprise'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : plan === 'Standard'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                        {plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : status === 'Trial'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {tenantUsers} / <span className="text-slate-500">{capacity} Max</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200 font-mono">
                      ₹{rate.toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {t.planExpiryDate ? new Date(t.planExpiryDate).toLocaleDateString() : '08/30/2026'}
                    </td>
                  </tr>
                );
              })}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No active workspaces found. Register a new tenant to see billing details.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
