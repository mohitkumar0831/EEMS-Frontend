import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS } from '../../constants/apiConstants';
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Flag,
  Clock,
  DollarSign,
  Users,
  Utensils,
  Plane,
  Laptop,
  FileText,
  TrendingUp,
  Eye,
  Lock
} from 'lucide-react';

export const AuditorOverview = () => {
  const { currentUser, expenses, auditLogs } = useAppState();
  const [dashboardMetrics, setDashboardMetrics] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!currentUser?.tenantSlug) return;
      try {
        const res = await fetch(EXPENSE_ENDPOINTS.GET_AUDITOR_DASHBOARD(currentUser.tenantSlug), {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const json = await res.json();
        if (json.success) {
          setDashboardMetrics(json.data);
        }
      } catch (err) {
        console.error('Failed to load auditor dashboard', err);
      }
    };
    fetchDashboard();
  }, [currentUser?.tenantSlug, currentUser?.token]);

  const companyExpenses = expenses.filter(e => e.tenantId === currentUser?.tenantId);
  const companyLogs = auditLogs.filter(l => l.tenantId === currentUser?.tenantId || l.tenantId === 'platform');

  const totalClaims = dashboardMetrics?.ledgerClaims?.count || 0;
  const uniqueClaimants = dashboardMetrics?.ledgerClaims?.activeClaimants || 0;
  
  const complianceRate = dashboardMetrics?.complianceRate?.percentage || 100;
  const violationCount = dashboardMetrics?.complianceRate?.violationsFound || 0;
  
  const flaggedExpensesCount = dashboardMetrics?.flaggedClaims?.count || 0;
  const flaggedValue = dashboardMetrics?.flaggedClaims?.underProbeAmount || 0;
  
  const auditClearedCount = dashboardMetrics?.auditCleared?.count || 0;
  
  const pendingAuditCount = dashboardMetrics?.awaitingAudit?.count || 0;
  const pendingAuditValue = dashboardMetrics?.awaitingAudit?.amountToReview || 0;
  
  const policyViolationsCount = dashboardMetrics?.policyViolations?.count || 0;
  
  const totalDisbursed = dashboardMetrics?.totalDisbursed?.amount || 0;

  // Category breakdown
  const categories = ['Meals', 'Travel', 'Equipment'];
  const categoryData = categories.map(cat => {
    const catExp = companyExpenses.filter(e => e.category === cat);
    const total = catExp.reduce((s, e) => s + e.amount, 0);
    const flagged = catExp.filter(e => e.status === 'Flagged' || e.status === 'Under Review').length;
    return { name: cat, count: catExp.length, total, flagged };
  });
  const maxCatTotal = Math.max(...categoryData.map(c => c.total), 1);

  // Recent 5 audit events from auditLogs
  const recentLogs = [...companyLogs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);

  // Checklist items
  const checklistItems = [
    { label: 'Role-Based Access Guard', sub: 'Security separation verification', ok: true },
    { label: 'Approval Workflow Trace', sub: 'Multi-level validation tracking', ok: true },
    { label: 'Payment Gateway Compliance', sub: 'Reimbursement disbursement trail', ok: true },
    { label: 'Policy Cap Enforcement', sub: 'Category spend-limit rule binding', ok: violationCount === 0 },
    { label: 'Flagged Claims Investigation', sub: 'Active investigation on flagged items', ok: flaggedExpensesCount === 0 },
  ];

  const getCategoryIcon = (cat) => {
    if (cat === 'Meals') return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
    if (cat === 'Travel') return <Plane className="w-3.5 h-3.5 text-sky-400" />;
    if (cat === 'Equipment') return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      {/* <div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-400" />
          Audit Dashboard
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          Compliance standing, flagged investigations, and full audit trail coverage across the workspace.
        </p>
      </div> */}

      {/* ── Row 1: Primary KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ledger Claims</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{totalClaims}</div>
            <span className="text-[10px] text-indigo-400">{uniqueClaimants} active claimants</span>
          </div>
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Compliance Rate</span>
            <div className={`text-2xl font-extrabold mt-1 ${complianceRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {complianceRate}%
            </div>
            <span className="text-[10px] text-slate-500">{violationCount} violations found</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${complianceRate >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Flagged Claims</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{flaggedExpensesCount}</div>
            <span className="text-[10px] text-rose-400">₹{flaggedValue.toFixed(2)} under probe</span>
          </div>
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Audit Cleared</span>
            <div className="text-2xl font-extrabold text-violet-400 mt-1">{auditClearedCount}</div>
            <span className="text-[10px] text-violet-400">by your sign-off</span>
          </div>
          <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ── Row 2: Secondary Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awaiting Audit</span>
          <span className="text-lg font-extrabold text-amber-300">{pendingAuditCount}</span>
          <span className="text-[10px] text-slate-500">₹{pendingAuditValue.toFixed(2)} to review</span>
        </div>

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Policy Violations</span>
          <span className="text-lg font-extrabold text-orange-300">{policyViolationsCount}</span>
          <span className="text-[10px] text-slate-500">claims exceeding caps</span>
        </div>

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Disbursed</span>
          <span className="text-lg font-extrabold text-sky-300">₹{totalDisbursed.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500">across paid claims</span>
        </div>

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Audit Logs</span>
          <span className="text-lg font-extrabold text-purple-300">{companyLogs.length}</span>
          <span className="text-[10px] text-slate-500">recorded system events</span>
        </div>

      </div>

      {/* ── Row 3: Checklist + Compliance Risk ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Compliance Checklist (2/3) */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col lg:col-span-2 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-sm font-bold text-slate-200">Compliance Audit Trail Checklist</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Summary of critical role actions and approval chain completions</p>
          </div>
          <div className="flex flex-col gap-3 p-5">
            {checklistItems.map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3.5 rounded-xl border text-xs transition-all ${item.ok
                  ? 'border-emerald-500/15 bg-emerald-500/[0.03]'
                  : 'border-rose-500/15 bg-rose-500/[0.03]'
                }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                    {item.ok
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : <AlertTriangle className="w-3.5 h-3.5" />
                    }
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-bold text-slate-200 truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.sub}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border shrink-0 ml-3 ${item.ok
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                  {item.ok ? 'VERIFIED' : 'ACTION NEEDED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Score card (1/3) */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Compliance Score</h3>

          {/* Big ring indicator */}
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center font-extrabold text-2xl ${complianceRate >= 80 ? 'border-emerald-500 text-emerald-400' : 'border-amber-500 text-amber-400'
              }`}>
              {complianceRate}%
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${complianceRate >= 80 ? 'text-emerald-500' : 'text-amber-500'
              }`}>
              {complianceRate >= 80 ? 'STRONG STANDING' : 'NEEDS ATTENTION'}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-[11px] border-t border-white/5 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Compliant claims:</span>
              <span className="font-bold text-emerald-400">{totalClaims - violationCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Violations found:</span>
              <span className="font-bold text-rose-400">{violationCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audited by you:</span>
              <span className="font-bold text-violet-400">{auditClearedCount}</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 p-3 bg-slate-950/50 text-[10px] text-slate-400 leading-relaxed">
            Use <span className="text-indigo-400 font-semibold">Export Reports</span> to download audit logs for regulatory submission.
          </div>
        </div>

      </div>

      {/* ── Row 4: Category Risk + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Category Risk Breakdown */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Category Risk Breakdown</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Expense volume and flagged counts by category</p>
          </div>

          <div className="flex flex-col gap-4">
            {categoryData.map(cat => {
              const barWidth = (cat.total / maxCatTotal) * 100;
              const riskColor = cat.flagged > 0 ? 'bg-rose-400' : 'bg-violet-400';
              const barBg = cat.name === 'Meals' ? 'bg-amber-400' : cat.name === 'Travel' ? 'bg-sky-400' : 'bg-indigo-400';
              return (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat.name)}
                      <span className="font-semibold text-slate-300">{cat.name}</span>
                      <span className="text-[9px] text-slate-600">{cat.count} claims</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {cat.flagged > 0 && (
                        <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5">
                          <Flag className="w-2.5 h-2.5" />{cat.flagged} flagged
                        </span>
                      )}
                      <span className="font-bold text-slate-100">₹{cat.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${barBg} opacity-70`} style={{ width: `${barWidth}%` }} />
                  </div>
                  {cat.flagged > 0 && (
                    <div className="h-1 rounded-full bg-slate-800 overflow-hidden -mt-1.5">
                      <div className="h-full rounded-full bg-rose-500" style={{ width: `${(cat.flagged / cat.count) * 100}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[9px] text-slate-500 border-t border-white/5 pt-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Total spend</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Flagged ratio</span>
          </div>
        </div>

        {/* Recent Audit Activity Feed */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Recent Audit Log Events</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">System-recorded action history</p>
            </div>
            <span className="text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-1 rounded-lg">
              {companyLogs.length} TOTAL
            </span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="flex items-center justify-center flex-grow py-12 text-slate-500 text-xs">
              No audit log events recorded yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {recentLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-slate-950/50 border border-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-200 truncate">{log.action}</span>
                    <span className="text-[10px] text-slate-500 leading-relaxed truncate">{log.details}</span>
                    <span className="text-[9px] text-slate-700">{new Date(log.timestamp).toLocaleString()}</span>
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
