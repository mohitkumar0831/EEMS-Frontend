import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Database, Server, RefreshCw, AlertTriangle, ShieldCheck, Power, Activity } from 'lucide-react';

export const TenantStatus = () => {
  const { tenants, showToast } = useAppState();
  const [tenantsState, setTenantsState] = useState(() => 
    tenants.map(t => ({
      ...t,
      status: t.id === 'tenant-1' ? 'Active' : t.id === 'tenant-2' ? 'Active' : 'Suspended',
      storageUsed: t.id === 'tenant-1' ? 142.5 : t.id === 'tenant-2' ? 62.1 : 0,
      latency: t.id === 'tenant-1' ? '12ms' : t.id === 'tenant-2' ? '16ms' : 'Offline',
      node: t.id === 'tenant-1' ? 'AWS-AP-SOUTH-1a' : t.id === 'tenant-2' ? 'AWS-US-EAST-1b' : 'AWS-EU-WEST-1a'
    }))
  );

  const toggleStatus = (id) => {
    setTenantsState(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Active' ? 'Suspended' : 'Active';
        const nextLatency = nextStatus === 'Active' ? '15ms' : 'Offline';
        showToast(`Tenant ${t.name} workspace set to ${nextStatus.toUpperCase()}!`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...t, status: nextStatus, latency: nextLatency };
      }
      return t;
    }));
  };

  const triggerSync = (name) => {
    showToast(`Sync request dispatched for ${name} database tables...`, 'info');
    setTimeout(() => {
      showToast(`Successfully re-indexed indices on secondary replica for ${name}!`, 'success');
    }, 1200);
  };

  const totalStorage = tenantsState.reduce((acc, curr) => acc + curr.storageUsed, 0);
  const activeCount = tenantsState.filter(t => t.status === 'Active').length;
  const suspendedCount = tenantsState.filter(t => t.status === 'Suspended').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Telemetry row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Utilized</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">{totalStorage.toFixed(1)} GB</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Across multi-tenant directories</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Database className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Instances</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{activeCount} Node{activeCount !== 1 ? 's' : ''}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Syncing with workspace routing</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Server className="w-5.5 h-5.5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended Tenancies</span>
            <span className="text-2xl font-extrabold text-amber-500 mt-1 font-mono">{suspendedCount} Workspace{suspendedCount !== 1 ? 's' : ''}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Billing overdue / inactive spaces</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Tenant status table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="border-b border-white/5 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-400" />
            Infrastructure Status & Control Panel
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">Control live microservice deployment structures and instance states.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-3.5">Company Workspace</th>
                <th className="px-6 py-3.5">Cluster Node</th>
                <th className="px-6 py-3.5">Storage Used</th>
                <th className="px-6 py-3.5">Sync Latency</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {tenantsState.map((t) => (
                <tr key={t.id} className="transition-all hover:bg-white/[0.01]">
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    <div className="flex flex-col">
                      <span>{t.name}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5 font-mono">{t.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">{t.node}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono font-medium">{t.storageUsed.toFixed(1)} GB</td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-400">{t.latency}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      t.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => toggleStatus(t.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          t.status === 'Active' 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={t.status === 'Active' ? 'Suspend tenant' : 'Activate tenant'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerSync(t.name)}
                        className="p-1.5 rounded-lg border bg-slate-800 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
                        title="Force sync database"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
