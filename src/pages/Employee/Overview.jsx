import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Plane,
  Laptop,
  Utensils,
  FileText,
  Clock,
  Compass
} from 'lucide-react';

export const Overview = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppState();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!currentUser) return;
        const tenantSlug = currentUser.tenantSlug || 'platform'; // Use tenantSlug instead of tenantId
        const res = await axios.get(EXPENSE_ENDPOINTS.GET_EMPLOYEE_DASHBOARD(tenantSlug, currentUser.id));
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [currentUser]);

  if (loading || !dashboardData) {
    return <PageSkeleton />;
  }

  const {
    totalClaims = 0,
    pendingClaimsCount = 0,
    approvedClaimsCount = 0,
    totalReimbursed = 0,
    flaggedClaimsCount = 0,
    personalCategorySpend = {},
    recentClaims = [],
    recentTravel = [],
    policies = []
  } = dashboardData;

  const totalMySpent = Object.values(personalCategorySpend).reduce((sum, val) => sum + val, 0) || 1;

  const categoryDetails = Object.entries(personalCategorySpend).map(([cat, amount]) => {
    let colorClass = 'bg-indigo-500';
    let icon = <FileText className="w-4 h-4 text-slate-450" />;

    if (cat === 'Meals') {
      colorClass = 'bg-amber-500';
      icon = <Utensils className="w-4 h-4 text-amber-450" />;
    } else if (cat === 'Travel') {
      colorClass = 'bg-sky-500';
      icon = <Plane className="w-4 h-4 text-sky-450" />;
    } else if (cat === 'Equipment') {
      colorClass = 'bg-purple-500';
      icon = <Laptop className="w-4 h-4 text-purple-450" />;
    }

    return {
      category: cat,
      amount,
      percentage: (amount / totalMySpent) * 100,
      colorClass,
      icon
    };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      {/* <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Employee Overview</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Monitor your submitted reimbursement claims, active travel requests, and corporate policy compliance standing.
        </p>
      </div> */}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Submitted Claims */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Submitted Claims</span>
            <span className="text-3xl font-extrabold text-slate-100">{totalClaims}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        {/* Claims Pending Review */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Pending Review</span>
            <span className="text-3xl font-extrabold text-slate-100">{pendingClaimsCount}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* Approved (Unpaid) */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Approved (Unpaid)</span>
            <span className="text-3xl font-extrabold text-slate-100">{approvedClaimsCount}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Total Reimbursed */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Total Reimbursed</span>
            <span className="text-3xl font-extrabold text-slate-100">₹{totalReimbursed.toFixed(2)}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Left Columns (2/3 width): Lists of expenses & travel requests */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Recent Claims list card */}
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Recent Claims Activity</h3>
                <p className="text-xs text-slate-500 mt-1">Audit status tracking on your latest expense claim submissions.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/employee/reimbursements')}
                className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentClaims.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
                <p className="text-xs text-slate-500">No expense claims filed yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentClaims.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/20 p-3.5 hover:border-slate-800 transition-colors">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-xs font-bold text-slate-200">{exp.title}</span>
                      <span className="text-[10px] text-slate-550">{exp.category} • {exp.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-200">₹{exp.amount.toFixed(2)}</span>
                      <span className={`rounded-lg border px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase ${exp.status === 'Paid'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : exp.status === 'Approved'
                            ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                            : exp.status === 'Rejected'
                              ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}>
                        {exp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Travel Request Card */}
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200">Recent Travel Plans</h3>
                <p className="text-xs text-slate-500 mt-1">Status of travel requests submitted for authorization.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/employee/reimbursements')}
                className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Requests <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentTravel.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
                <p className="text-xs text-slate-500">No travel authorization plans submitted.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentTravel.slice(0, 4).map((tr) => (
                  <div key={tr.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/20 p-3.5 hover:border-slate-800 transition-colors">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-xs font-bold text-slate-200">{tr.destination}</span>
                      <span className="text-[10px] text-slate-550">{tr.purpose}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-200">₹{tr.estimatedCost.toFixed(2)}</span>
                      <span className={`rounded-lg border px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase ${tr.status === 'Approved'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : tr.status === 'Rejected'
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        }`}>
                        {tr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width): Spend breakdwon & Roster of Policies */}
        <div className="flex flex-col gap-6">

          {/* Card 1: Compliance Standing Alert */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-sm font-bold text-slate-200">Compliance Standing</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Current policy review standing for your claims.</p>
            </div>

            {flaggedClaimsCount > 0 ? (
              <div className="p-4 bg-rose-500/5 border border-rose-500/25 text-rose-400 rounded-2xl flex flex-col gap-2.5 text-xs leading-normal">
                <div className="flex items-center gap-2 font-bold text-[11px]">
                  <ShieldAlert className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                  <span>Flagged Claim Notice</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  You have <b>{flaggedClaimsCount}</b> claim(s) flagged as <i>Under Review</i> for exceeding policy limits. Make sure itemized invoices are attached for compliance auditors.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 rounded-2xl flex flex-col gap-2.5 text-xs leading-normal">
                <div className="flex items-center gap-2 font-bold text-[11px]">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-450 shrink-0" />
                  <span>Excellent Standing</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  All your current submissions comply with corporate policies. No compliance warnings are pending.
                </p>
              </div>
            )}
          </div>

          {/* Card 2: Personal Spend breakdown */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-sm font-bold text-slate-200">My Reimbursed Spend</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Approved and paid spend distributions.</p>
            </div>

            {categoryDetails.length === 0 ? (
              <p className="text-xs text-slate-550 text-center py-6">No approved spend summaries recorded.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {categoryDetails.map(item => (
                  <div key={item.category} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-slate-200">{item.category}</span>
                      </div>
                      <span className="text-slate-450 font-bold">₹{item.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950/60 border border-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Active Policies Roster */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-sm font-bold text-slate-200">Policy Spending Caps</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Corporate allowance caps for category claims.</p>
            </div>

            {policies.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No policy guidelines configured.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {policies.map(policy => (
                  <div key={policy.id} className="flex items-center justify-between p-3 bg-slate-950/20 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center font-bold text-xs shrink-0 text-slate-400">
                        {policy.category.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0 text-[10px]">
                        <span className="font-bold text-slate-300 truncate">{policy.category}</span>
                        <span className="text-slate-550 truncate mt-0.5">{policy.rule || 'Compliance Cap'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-200 shrink-0">
                      ₹{policy.limit.toFixed(0)} max
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
