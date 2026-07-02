import React from 'react';
import { useAppState } from '../../context/StateContext';
import {
  Wallet,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  BarChart2,
  Clock,
  TrendingUp,
  TrendingDown,
  Utensils,
  Plane,
  Laptop,
  FileText,
  AlertCircle,
  ArrowRight,
  Users,
  CreditCard
} from 'lucide-react';

export const FinanceOverview = () => {
  const { currentUser, expenses, users } = useAppState();

  const companyExpenses = expenses.filter(e => e.tenantId === currentUser?.tenantId);
  const approvedQueue  = companyExpenses.filter(e => e.status === 'Approved');
  const violationsQueue = companyExpenses.filter(e => e.status === 'Under Review');
  const paidHistory    = companyExpenses.filter(e => e.status === 'Paid');
  const pendingQueue   = companyExpenses.filter(e => e.status === 'Pending');
  const rejectedQueue  = companyExpenses.filter(e => e.status === 'Rejected');

  const totalReimbursed   = paidHistory.reduce((sum, e) => sum + e.amount, 0);
  const pendingPaymentSum = approvedQueue.reduce((sum, e) => sum + e.amount, 0);
  const violationSum      = violationsQueue.reduce((sum, e) => sum + e.amount, 0);
  const totalSubmitted    = companyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown across ALL expenses
  const categories = ['Meals', 'Travel', 'Equipment'];
  const categoryData = categories.map(cat => {
    const catExpenses = companyExpenses.filter(e => e.category === cat);
    const total = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const paid  = catExpenses.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, total, paid, count: catExpenses.length };
  });
  const maxCategoryTotal = Math.max(...categoryData.map(c => c.total), 1);

  // Claimants: unique employees who submitted claims
  const uniqueClaimants = [...new Set(companyExpenses.map(e => e.employeeId))].length;

  // Average claim size
  const avgClaimSize = companyExpenses.length > 0
    ? companyExpenses.reduce((s, e) => s + e.amount, 0) / companyExpenses.length
    : 0;

  // Recent activity (last 5 expenses by date, any status)
  const recentActivity = [...companyExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const statusBadge = (status) => {
    const map = {
      Approved:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      Paid:         'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      Pending:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Under Review': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      Rejected:     'bg-slate-700/50 text-slate-400 border-slate-700',
    };
    return map[status] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  const getCategoryIcon = (cat) => {
    if (cat === 'Meals')     return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
    if (cat === 'Travel')    return <Plane    className="w-3.5 h-3.5 text-sky-400" />;
    if (cat === 'Equipment') return <Laptop   className="w-3.5 h-3.5 text-indigo-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">

      {/* Page Title */}
      <div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Finance Dashboard
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          Real-time view of expense disbursements, compliance, and payment activity.
        </p>
      </div>

      {/* ── Row 1: 4 Primary KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Disbursed */}
        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Disbursed</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">₹{totalReimbursed.toFixed(2)}</div>
            <span className="text-[10px] text-emerald-400">{paidHistory.length} claims paid</span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awaiting Payout</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">₹{pendingPaymentSum.toFixed(2)}</div>
            <span className="text-[10px] text-indigo-400">{approvedQueue.length} approved claims</span>
          </div>
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Policy Violations */}
        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Policy Violations</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{violationsQueue.length}</div>
            <span className="text-[10px] text-rose-400">₹{violationSum.toFixed(2)} flagged</span>
          </div>
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Reimbursement Volume */}
        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Claims</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{companyExpenses.length}</div>
            <span className="text-[10px] text-purple-400">₹{totalSubmitted.toFixed(2)} submitted</span>
          </div>
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ── Row 2: Secondary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Avg Claim Size */}
        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. Claim Size</span>
          <span className="text-lg font-extrabold text-sky-300">₹{avgClaimSize.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500">per expense filing</span>
        </div>

        {/* Pending Manager Review */}
        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Approval</span>
          <span className="text-lg font-extrabold text-amber-300">{pendingQueue.length}</span>
          <span className="text-[10px] text-slate-500">awaiting manager sign-off</span>
        </div>

        {/* Rejected Claims */}
        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rejected Claims</span>
          <span className="text-lg font-extrabold text-rose-300">{rejectedQueue.length}</span>
          <span className="text-[10px] text-slate-500">declined by manager</span>
        </div>

        {/* Unique Claimants */}
        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Claimants</span>
          <span className="text-lg font-extrabold text-violet-300">{uniqueClaimants}</span>
          <span className="text-[10px] text-slate-500">employees with submissions</span>
        </div>

      </div>

      {/* ── Row 3: Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pending Reimbursements Queue (2/3) */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col lg:col-span-2 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Pending Reimbursements Queue</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Manager-approved claims awaiting Finance disbursement</p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg">
              {approvedQueue.length} PENDING
            </span>
          </div>

          {approvedQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center p-4">
              <CheckCircle2 className="w-9 h-9 text-slate-700" />
              <p className="text-slate-500 text-xs">No approved expenses waiting for disbursement.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {approvedQueue.map(exp => (
                <div key={exp.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center shrink-0">
                      {getCategoryIcon(exp.category)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate">{exp.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {exp.employeeName} · {exp.category} · {exp.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-extrabold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase tracking-wider">
                      Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Policy Violations (1/3) */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-sm font-bold text-slate-200">Policy Compliance</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Claims flagged for audit review</p>
          </div>

          {violationsQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center p-4 flex-grow">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              <p className="text-emerald-500 text-xs font-semibold">100% Compliant</p>
              <p className="text-slate-500 text-[10px]">No policy violations flagged.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {violationsQueue.map(v => (
                <div key={v.id} className="flex flex-col gap-1.5 p-3.5 border border-rose-500/20 bg-rose-500/5 rounded-xl">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-rose-400 text-[11px] leading-tight truncate">{v.title}</span>
                    <span className="font-extrabold text-slate-100 text-[11px] shrink-0">₹{v.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500">
                    <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>Exceeds policy · Filed by {v.employeeName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Row 4: Category Breakdown + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Category Spend Breakdown */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Category Spend Breakdown</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Total filed expenses grouped by category</p>
          </div>

          <div className="flex flex-col gap-4">
            {categoryData.map(cat => {
              const barWidth = maxCategoryTotal > 0 ? (cat.total / maxCategoryTotal) * 100 : 0;
              const paidPct  = cat.total > 0 ? (cat.paid / cat.total) * 100 : 0;
              const barColor = cat.name === 'Meals' ? 'bg-amber-400' : cat.name === 'Travel' ? 'bg-sky-400' : 'bg-indigo-400';
              return (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat.name)}
                      <span className="font-semibold text-slate-300">{cat.name}</span>
                      <span className="text-[9px] text-slate-600">{cat.count} claims</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-slate-100">₹{cat.total.toFixed(2)}</span>
                      <span className="text-[9px] text-emerald-500">₹{cat.paid.toFixed(2)} paid</span>
                    </div>
                  </div>
                  {/* Total bar */}
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} opacity-30`} style={{ width: `${barWidth}%` }} />
                  </div>
                  {/* Paid sub-bar */}
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden -mt-2">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${paidPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[9px] text-slate-500 pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
              Total Filed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Paid Out
            </span>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-sm font-bold text-slate-200">Recent Expense Activity</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Latest submissions across all employees</p>
          </div>

          {recentActivity.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              No recent expense activity.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentActivity.map(exp => (
                <div key={exp.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center shrink-0">
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-200 truncate">{exp.title}</span>
                    <span className="text-[9px] text-slate-500">{exp.employeeName} · {exp.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] font-bold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${statusBadge(exp.status)}`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
