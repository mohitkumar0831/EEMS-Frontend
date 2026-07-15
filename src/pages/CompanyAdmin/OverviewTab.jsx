import React from 'react';
import { Users, Award, ShieldAlert, DollarSign, Clock, Plus } from 'lucide-react';
import { useAppState } from '../../context/StateContext';

const colorPalette = ['#6366f1', '#10b981', '#f59e0b', '#38bdf8', '#fb7185', '#f97316', '#a855f7'];

const getDistribution = (data, maxItems = 5) => {
  return Object.entries(data)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxItems)
    .map(([name, value], index) => ({ name, value, color: colorPalette[index % colorPalette.length] }));
};

const buildGradient = (segments) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (!total) return 'rgba(148,163,184,0.15) 0% 100%';
  let start = 0;
  return segments
    .map((segment) => {
      const width = (segment.value / total) * 100;
      const end = start + width;
      const stop = `${segment.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      start = end;
      return stop;
    })
    .join(', ');
};

const DonutChart = ({ segments, label, isCurrency }) => {
  const gradient = buildGradient(segments);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const displayValue = isCurrency
    ? `₹${Math.round(total).toLocaleString()}`
    : total.toLocaleString();

  return (
    <div className="flex items-center justify-center shrink-0">
      <div
        className="relative h-28 w-28 rounded-full border border-white/10 transition-transform duration-300 hover:scale-105"
        style={{
          backgroundImage: `conic-gradient(${gradient})`,
          backgroundColor: 'rgba(148,163,184,0.12)'
        }}
      >
        <div className="absolute inset-6 rounded-full bg-slate-900" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-slate-100">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{label}</span>
          <span className="text-xs font-bold mt-0.5">{displayValue}</span>
        </div>
      </div>
    </div>
  );
};

export const OverviewTab = ({ dashboardMetrics, departmentData, totalEmployees, totalManagers, tenantUsers }) => {
  const { currentUser, travelRequests, auditLogs } = useAppState();

  const tenantTravel = travelRequests.filter(t => t.tenantId === currentUser?.tenantId);

  const activeEmployees = totalEmployees; // no active flag in seed data
  const pendingClaims = dashboardMetrics.pendingClaims || 0;
  const pendingTravel = tenantTravel.filter(t => t.status === 'Pending').length;
  const totalSpend = dashboardMetrics.totalSpend || 0;
  const reimbursementsPending = dashboardMetrics.reimbursementsPending || 0;
  const policyViolations = dashboardMetrics.policyViolations || 0;

  const topExpenses = (dashboardMetrics.topExpenses || []).map(exp => {
    const user = tenantUsers.find(u => u.id === exp.employeeId || u._id === exp.employeeId) || {};
    return {
      ...exp,
      employeeName: exp.employeeName || user.name || (user.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown'),
      department: user.department,
      role: exp.employeeRole || user.role
    };
  });

  const recentActivities = auditLogs.filter(l => l.tenantId === currentUser?.tenantId).slice(0, 6);

  const pendingApprovals = [
    ...(dashboardMetrics.pendingApprovals || []).map(p => {
      const user = tenantUsers.find(u => u.id === p.employeeId || u._id === p.employeeId) || {};
      return {
        ...p,
        employee: p.employeeName || user.name || (user.firstName ? `${user.firstName} ${user.lastName}` : 'Unknown'),
        submittedOn: new Date(p.submittedOn).toLocaleDateString()
      };
    }),
    ...tenantTravel.filter(t => t.status === 'Pending').map(t => ({ type: 'Travel Request', id: t.id, employee: t.employeeName, submittedOn: new Date(t.createdAt).toLocaleDateString(), amount: t.estimatedCost }))
  ].slice(0, 5);

  const categoryData = dashboardMetrics.categoryData || {};
  const monthlyData = dashboardMetrics.monthlyData || {};
  const statusData = dashboardMetrics.statusData || {};

  const departmentSegments = getDistribution(departmentData);
  const categorySegments = getDistribution(categoryData);
  const monthlySegments = getDistribution(monthlyData);
  const statusSegments = getDistribution(statusData);

  return (
    <div className="flex flex-col gap-8">
      {/* Top KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 xl:gap-6">
        {/* Total Employees */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate" title="Total Employees">
              Total Employees
            </div>
            <div className="mt-1.5 text-2xl font-bold text-slate-100 truncate">{totalEmployees}</div>
          </div>
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-300 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate" title="Active Employees">
              Active Employees
            </div>
            <div className="mt-1.5 text-2xl font-bold text-slate-100 truncate">{activeEmployees}</div>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300 shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Expense Claims */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate" title="Pending Expense Claims">
              Pending Claims
            </div>
            <div className="mt-1.5 text-2xl font-bold text-slate-100 truncate">{pendingClaims}</div>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-300 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Total Company Expenses */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate" title="Total Company Expenses">
              Total Spend
            </div>
            <div className="mt-1.5 text-2xl font-bold text-slate-100 truncate">₹{totalSpend.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-200">Department Wise Expenses</h4>
              <p className="text-xs text-slate-500 mt-1">Top departments by spend</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:flex-col xl:flex-row xl:items-center">
              <DonutChart segments={departmentSegments} label="Dept" isCurrency={true} />
              <div className="space-y-2 text-xs text-slate-300 flex-1 w-full">
                {departmentSegments.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">No department expense data</div>
                ) : (
                  departmentSegments.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-slate-200">{segment.name}</span>
                      </div>
                      <span className="text-slate-400 font-medium">₹{segment.value.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-200">Monthly Expense Trend</h4>
              <p className="text-xs text-slate-500 mt-1">Last 6 months</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:flex-col xl:flex-row xl:items-center">
              <DonutChart segments={monthlySegments} label="Month" isCurrency={true} />
              <div className="space-y-2 text-xs text-slate-300 flex-1 w-full">
                {monthlySegments.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">No monthly expense data</div>
                ) : (
                  monthlySegments.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-slate-200">{segment.name}</span>
                      </div>
                      <span className="text-slate-400 font-medium">₹{segment.value.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-200">Category Wise Expenses</h4>
              <p className="text-xs text-slate-500 mt-1">Spend by category</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:flex-col xl:flex-row xl:items-center">
              <DonutChart segments={categorySegments} label="Cat" isCurrency={true} />
              <div className="space-y-2 text-xs text-slate-300 flex-1 w-full">
                {categorySegments.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">No category expense data</div>
                ) : (
                  categorySegments.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-slate-200">{segment.name}</span>
                      </div>
                      <span className="text-slate-400 font-medium">₹{segment.value.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between">
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-200">Approval Status Distribution</h4>
              <p className="text-xs text-slate-500 mt-1">Current approval breakdown</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:flex-col xl:flex-row xl:items-center">
              <DonutChart segments={statusSegments} label="Status" isCurrency={false} />
              <div className="space-y-2 text-xs text-slate-300 flex-1 w-full">
                {statusSegments.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">No approval status data</div>
                ) : (
                  statusSegments.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-slate-200">{segment.name}</span>
                      </div>
                      <span className="text-slate-400 font-medium">{segment.value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col gap-4 h-full flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Recent Activities</h4>
                <p className="text-xs text-slate-500 mt-1">Latest tenant activity audit logs</p>
              </div>
              {/* <button className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/15">View All</button> */}
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 max-h-[380px] lg:max-h-[420px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {recentActivities.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">No recent activities</div>
              ) : (
                recentActivities.map(act => (
                  <div key={act.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-200 hover:border-white/10 transition-colors">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{new Date(act.timestamp).toLocaleString()}</div>
                    <div className="text-slate-100 font-medium">{act.action}</div>
                    <div className="text-slate-400 mt-1">{act.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Top Expenses This Month</h4>
            <p className="text-xs text-slate-500 mt-1">Highest value claims approved</p>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-white/5">
                  <th className="px-4 py-3">Sr.no</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {topExpenses.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">No expenses recorded</td></tr>
                ) : (
                  topExpenses.map((exp, idx) => (
                    <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-200">{exp.employeeName}</td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{exp.role || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-white/5">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-100">₹{exp.amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200">Pending Approvals</h4>
            <p className="text-xs text-slate-500 mt-1">Claims and travel requests requiring review</p>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-white/5">
                  <th className="px-4 py-3">Sr.no</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Submitted On</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {pendingApprovals.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-slate-500">No pending approvals</td></tr>
                ) : (
                  pendingApprovals.map((p, i) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${p.type === 'Expense Claim'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                          }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">{p.employee}</td>
                      <td className="px-4 py-3 text-slate-400">{p.submittedOn}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-100">₹{(p.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
