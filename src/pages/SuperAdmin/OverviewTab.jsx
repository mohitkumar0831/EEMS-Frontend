import React from 'react';
import {
  Globe, Users, Settings, ShieldAlert, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Building2, Briefcase, Clock,
  CheckCircle2, AlertTriangle, XCircle, Plane, Activity
} from 'lucide-react';

export const OverviewTab = ({ stats }) => {
  if (!stats) return null;

  // ── Computed Metrics from Backend API ─────────────────
  const {
    activeTenants = 0,
    totalTenants = 0,
    totalUsers = 0,
    roleCounts = {},
    totalSpend = 0,
    totalClaims = 0,
    pendingClaims = 0,
    approvedClaims = 0,
    flaggedClaims = 0,
    categorySpend = {},
    activePolicies = 0,
    pendingTravel = 0,
    auditLogs = [],
    tenants = [],
    usersPerTenantMap = {}
  } = stats;

  const categoryEntries = Object.entries(categorySpend).sort((a, b) => b[1] - a[1]);
  const categoryColors = ['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const categoryTextColors = ['text-indigo-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400'];

  // Monthly mock data for sparkline chart
  const monthlyData = [
    { m: 'Jan', val: 32, spend: 4200 },
    { m: 'Feb', val: 45, spend: 6800 },
    { m: 'Mar', val: 58, spend: 8100 },
    { m: 'Apr', val: 42, spend: 5400 },
    { m: 'May', val: 68, spend: 9200 },
    { m: 'Jun', val: 88, spend: 12500 }
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Welcome Banner ────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-slate-900 border border-indigo-500/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Platform Command Center
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-lg">
              Real-time overview of multi-tenant operations, expense processing pipelines, and compliance audit coverage across all provisioned workspaces.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* ── Primary KPI Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Tenants */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Admins</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{roleCounts['CompanyAdmin'] || 0}</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +1 this quarter
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Registered company administrators</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 z-10">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{totalUsers}</span>
              <span className="text-[10px] font-bold text-slate-500">across {Object.keys(usersPerTenantMap).length} companies</span>
            </div>
            <span className="text-[10px] text-slate-500">Avg {(totalUsers / Math.max(Object.keys(usersPerTenantMap).length, 1)).toFixed(1)} per tenant</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 z-10">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Spend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">
                ₹{totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">{totalClaims} total claims submitted</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Policies */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Policies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{activePolicies}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${flaggedClaims > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {flaggedClaims > 0 && <AlertTriangle className="w-3 h-3" />}
                {flaggedClaims} violations
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Compliance rules enforced</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 z-10">
            <Settings className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Pipeline Status Indicators ────────────────── */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{pendingClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Claims</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{approvedClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Approved</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{flaggedClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Flagged Review</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
            <Plane className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{pendingTravel}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Travel Requests</div>
          </div>
        </div>
      </div> */}

      {/* ── Middle Row: Chart + Category Breakdown ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Activity Chart */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                Platform Transaction Activity
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Monthly expense processing volume and financial throughput</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              H1 2026
            </span>
          </div>

          <div className="h-52 flex items-end gap-3 pt-6 px-2">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-slate-300 bg-slate-800 border border-white/10 px-2 py-1 rounded-lg whitespace-nowrap mb-1">
                  ₹{d.spend.toLocaleString()}
                </div>
                <div
                  style={{ height: `${d.val}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg shadow-lg shadow-indigo-500/10 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
              Category Allocation
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Spend distribution by expense category</p>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {categoryEntries.map(([cat, amount], idx) => {
              const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">{cat}</span>
                    <span className={`font-mono font-bold ${categoryTextColors[idx % categoryTextColors.length]}`}>
                      {pct.toFixed(1)}% · ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${categoryColors[idx % categoryColors.length]} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categoryEntries.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-4">No expense data available</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Tenant Grid + Role Distribution + Activity Log ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Workspace Health Cards */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col h-[300px]">
          <div className="shrink-0 mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-indigo-400" />
              Workspace Health Index
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Per-tenant metrics overview</p>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tenants.map((t, idx) => {
              const borderColors = ['border-indigo-500/20', 'border-emerald-500/20', 'border-fuchsia-500/20'];
              const bgColors = ['bg-indigo-500/5', 'bg-emerald-500/5', 'bg-fuchsia-500/5'];
              return (
                <div key={t.tenantId || idx} className={`p-4 rounded-xl border ${borderColors[idx % 3]} ${bgColors[idx % 3]} shrink-0`}>
                  <div className="flex justify-between items-start mb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{t.companyName || t.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500">{t.tenantId || t.id}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-extrabold uppercase">{t.status || 'Active'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.userCount || '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Users</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.expenseCount || '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Claims</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.totalSpend ? `₹${t.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Spend</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Distribution Matrix */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col h-[300px]">
          <div className="shrink-0 mb-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-indigo-400" />
              Role Distribution Matrix
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">User population by access level</p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Object.entries(roleCounts).map(([role, count], idx) => {
              const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              const roleColors = {
                SuperAdmin: { bar: 'bg-indigo-500', text: 'text-indigo-400', icon: '🛡️' },
                CompanyAdmin: { bar: 'bg-purple-500', text: 'text-purple-400', icon: '🏢' },
                Manager: { bar: 'bg-blue-500', text: 'text-blue-400', icon: '👔' },
                Employee: { bar: 'bg-emerald-500', text: 'text-emerald-400', icon: '👤' },
                'Finance Team': { bar: 'bg-amber-500', text: 'text-amber-400', icon: '💰' },
                Auditor: { bar: 'bg-rose-500', text: 'text-rose-400', icon: '🔍' }
              };
              const color = roleColors[role] || { bar: 'bg-slate-500', text: 'text-slate-400', icon: '•' };

              return (
                <div key={role} className="bg-slate-950/30 p-3 rounded-xl border border-white/[0.02]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span>{color.icon}</span> {role}
                    </span>
                    <span className={`font-mono font-bold ${color.text}`}>{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${color.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log Stream */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col h-[300px]">
          <div className="flex items-center justify-between shrink-0 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-indigo-400" />
                Live Activity Stream
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{auditLogs.length} total records</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {auditLogs.slice(0, 10).map(log => (
              <div key={log.id} className="flex gap-3 text-xs border-b border-slate-800/50 pb-3 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-400 truncate">{log.action}</span>
                  </div>
                  <p className="text-slate-400 leading-normal truncate" title={log.details}>{log.details}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-slate-500 font-medium">{log.user}</span>
                    <span className="text-[9px] text-slate-600">•</span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-center py-6 text-slate-500 text-xs">No activity logs recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Expense Claims Table ───────────────── */}
      {/* <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4.5 h-4.5 text-indigo-400" />
              Recent Expense Claims Pipeline
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">Latest claims from all tenant workspaces</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
            {expenses.length} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Claim Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {expenses.slice(0, 6).map((exp) => {
                const tenant = tenants.find(t => t.id === exp.tenantId);
                const statusStyles = {
                  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  Paid: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  'Under Review': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
                };

                return (
                  <tr key={exp.id} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{exp.employeeName}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5">{tenant?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium max-w-[200px] truncate" title={exp.title}>{exp.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-200">
                      ₹{exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{exp.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusStyles[exp.status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};
