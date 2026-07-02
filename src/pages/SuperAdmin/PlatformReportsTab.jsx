import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import {
  TrendingUp,
  Building2,
  Users,
  Settings,
  Cpu,
  Database,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const PlatformReportsTab = () => {
  const { tenants, users, policies, expenses, showToast } = useAppState();
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '30days', 'quarter'
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [dbHealth, setDbHealth] = useState({
    cpu: 24,
    latency: '14ms',
    status: 'Healthy',
    uptime: '99.99%',
    connections: 18
  });

  // Filter expenses based on selected time range
  const filterExpenses = (items) => {
    const today = new Date('2026-07-01'); // Treat local system date 2026-07-01 as "today" for mock data consistency
    return items.filter(exp => {
      if (timeFilter === 'all') return true;
      const expDate = new Date(exp.date);
      const diffTime = Math.abs(today - expDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilter === '30days') {
        return diffDays <= 30;
      }
      if (timeFilter === 'quarter') {
        return diffDays <= 90;
      }
      return true;
    });
  };

  const filteredExpenses = filterExpenses(expenses);

  // Compute Platform KPIs
  const totalSpend = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalClaims = filteredExpenses.length;
  const avgClaimValue = totalClaims > 0 ? totalSpend / totalClaims : 0;
  const flaggedClaims = filteredExpenses.filter(e => e.status === 'Under Review').length;

  // Tenant-wise spending distribution
  const tenantSpendMap = filteredExpenses.reduce((acc, exp) => {
    acc[exp.tenantId] = (acc[exp.tenantId] || 0) + exp.amount;
    return acc;
  }, {});

  const tenantShares = tenants.map((t, idx) => {
    const amount = tenantSpendMap[t.id] || 0;
    const share = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
    const colors = [
      { bg: 'bg-indigo-500', text: 'text-indigo-400', from: 'from-indigo-500', to: 'to-purple-600', border: 'border-indigo-500/20' },
      { bg: 'bg-emerald-500', text: 'text-emerald-400', from: 'from-emerald-500', to: 'to-teal-600', border: 'border-emerald-500/20' },
      { bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', from: 'from-fuchsia-500', to: 'to-pink-600', border: 'border-fuchsia-500/20' },
      { bg: 'bg-amber-500', text: 'text-amber-400', from: 'from-amber-500', to: 'to-orange-600', border: 'border-amber-500/20' }
    ];
    return {
      id: t.id,
      name: t.name,
      amount,
      share,
      color: colors[idx % colors.length]
    };
  }).sort((a, b) => b.amount - a.amount);

  // Run simulated platform check
  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    showToast('Initializing Platform Diagnostic Engine...', 'info');

    setTimeout(() => {
      setDbHealth({
        cpu: Math.floor(Math.random() * 15) + 10, // 10% - 25%
        latency: `${Math.floor(Math.random() * 8) + 8}ms`, // 8ms - 16ms
        status: 'Healthy',
        uptime: '99.99%',
        connections: tenants.length * 8 + Math.floor(Math.random() * 5)
      });
      setIsDiagnosing(false);
      showToast('All multi-tenant nodes and DB connections healthy!', 'success');
    }, 1200);
  };

  // Export report helpers
  const handleExport = (reportType, format) => {
    showToast(`Compiling ${reportType} report...`, 'info');
    setTimeout(() => {
      showToast(`Download started: eems_${reportType.toLowerCase().replace(/\s+/g, '_')}_2026-07-01.${format}`, 'success');
    }, 1000);
  };

  // Static Plan mappings for seeded/mock tenants
  const getTenantPlan = (tenant) => {
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

  const getTenantStatus = (tenant) => {
    if (tenant.subscriptionStatus) return tenant.subscriptionStatus;
    return 'Active';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Filter Widget */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            Global Platform Analytics & Reports
          </h3>
          <p className="text-slate-400 text-xs mt-1">Multi-tenant expenditure distribution, database nodes orchestration, and platform licensing metrics.</p>
        </div>

        <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Time' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'quarter', label: 'Last 90 Days' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimeFilter(btn.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${timeFilter === btn.id
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Gross Spend Volume */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Spend Volume</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">
              ₹{totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-indigo-400" /> {totalClaims} claims processed
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 z-10">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 2: Active Tenants */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tenant Spaces</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{tenants.length}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              {tenants.filter(t => getTenantStatus(t) === 'Active').length} active subscriptions
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 z-10">
            <Building2 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Global User Accounts */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global User Registry</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{users.length}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              Avg {(users.length / Math.max(tenants.length, 1)).toFixed(1)} per tenant
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10">
            <Users className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Compliance Rules Coverage */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Auditing</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{policies.length}</span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
              <AlertCircle className={`w-3.5 h-3.5 ${flaggedClaims > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              {flaggedClaims} claims flag review
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 z-10">
            <Settings className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Middle Row: Tenant Expense Share and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Spending Distribution */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-5 shadow-sm lg:col-span-2">
          <div>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-indigo-400" />
              Tenant Expense Share Distribution
            </h4>
            <p className="text-slate-400 text-xs mt-1">Real-time expenditure share and volume per provisioned tenant workspace.</p>
          </div>

          <div className="flex flex-col gap-4">
            {tenantShares.map((ts) => (
              <div key={ts.id} className="p-4 bg-slate-950/20 rounded-xl border border-white/[0.02]">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-slate-300 font-bold">{ts.name}</span>
                  <span className={`font-mono font-bold ${ts.color.text}`}>
                    {ts.share.toFixed(1)}% (${ts.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${ts.color.from} ${ts.color.to} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(ts.share, 2)}%` }}
                  />
                </div>
              </div>
            ))}
            {tenantShares.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">No tenant expense data found.</div>
            )}
          </div>
        </div>

        {/* Platform Node Performance Health */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-4 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-emerald-400" />
                  Platform Node Health
                </h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Live diagnostic telemetry for database syncing.</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                ONLINE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.03] flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">API Latency</span>
                <span className="text-base font-extrabold text-slate-200 mt-0.5 font-mono">{dbHealth.latency}</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.03] flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Uptime</span>
                <span className="text-base font-extrabold text-emerald-400 mt-0.5 font-mono">{dbHealth.uptime}</span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.03] flex flex-col col-span-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">CPU Overhead</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-200 font-mono">{dbHealth.cpu}%</span>
                  <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${dbHealth.cpu}%` }} />
                  </div>
                </div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.03] flex flex-col col-span-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Links</span>
                <span className="text-xs font-semibold text-slate-300 mt-0.5 font-mono">{dbHealth.connections} DB pools connected</span>
              </div>
            </div>

            <button
              onClick={handleRunDiagnostics}
              disabled={isDiagnosing}
              className="w-full mt-2 py-2 px-3 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-slate-100 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-98"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
              {isDiagnosing ? 'Running Diagnostics...' : 'Trigger Platform Health Check'}
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans & Billing control */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
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
                <th className="px-6 py-3.5">User Capacity</th>
                <th className="px-6 py-3.5">Monthly rate</th>
                <th className="px-6 py-3.5">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {tenants.map((t) => {
                const plan = getTenantPlan(t);
                const status = getTenantStatus(t);
                const rate = getTenantBillingRate(plan);
                const tenantUsers = users.filter((u) => u.tenantId === t.id).length;
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Administrative Report Exports */}
      {/* <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Download className="w-4.5 h-4.5 text-indigo-400" />
            Administrative Report Exports
          </h4>
          <p className="text-slate-400 text-xs mt-1">Export high-fidelity diagnostic spreadsheets and accounting trails.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Global Tenant Usage Index', desc: 'Active workspace metrics and tier scopes.', type: 'Usage_Index', format: 'csv' },
            { title: 'Platform Expense Ledger', desc: 'Consolidated audits of all spending claims.', type: 'Expense_Ledger', format: 'xlsx' },
            { title: 'System Security Audit Trail', desc: 'Raw platform access records & logins.', type: 'Security_Audit', format: 'json' }
          ].map((report, idx) => (
            <div key={idx} className="p-4 bg-slate-950/30 border border-white/5 hover:border-indigo-500/30 rounded-xl flex flex-col justify-between gap-3 group transition-all duration-300">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[9px] font-bold uppercase tracking-wider">{report.format}</span>
                <h5 className="text-xs font-bold text-slate-200 mt-2">{report.title}</h5>
                <p className="text-slate-500 text-[10px] mt-1 leading-normal">{report.desc}</p>
              </div>
              <button
                onClick={() => handleExport(report.type, report.format)}
                className="w-full mt-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:scale-[1.02] cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Generate & Download
              </button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
