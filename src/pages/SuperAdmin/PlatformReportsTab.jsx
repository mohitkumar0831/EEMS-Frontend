import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { BILLING_ENDPOINTS, DASHBOARD_ENDPOINTS } from '../../constants/apiConstants';
import {
  Building2,
  Users,
  ShieldCheck,
  Activity,
  AlertCircle,
  Database
} from 'lucide-react';
import { PageSkeleton } from '../../components/PageSkeleton';

export const PlatformReportsTab = () => {
  const { currentUser } = useAppState();
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsStats = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

        // Fetch plans
        const plansRes = await fetch(BILLING_ENDPOINTS.GET_PLANS, { headers });
        const plansData = await plansRes.json();
        if (plansData.success && plansData.data) {
          setPlans(plansData.data);
        }

        // Fetch dashboard stats
        const statsRes = await fetch(DASHBOARD_ENDPOINTS.SUPER_ADMIN, { headers });
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }

        // Fetch all platform payments
        const paymentsRes = await fetch(BILLING_ENDPOINTS.GET_ALL_PAYMENTS, { headers });
        const paymentsData = await paymentsRes.json();
        if (paymentsData.success && paymentsData.data) {
          setPayments(paymentsData.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsStats();
  }, [currentUser]);

  if (loading) {
    return <PageSkeleton />;
  }

  const tenantsList = stats?.tenants || [];
  const totalCompanies = tenantsList.length;
  const activeSubscriptions = tenantsList.filter(t => t.subscriptionStatus === 'Active').length;
  const suspendedCompanies = tenantsList.filter(t => t.status === 'Suspended').length;
  const totalUsers = Object.values(stats?.usersPerTenantMap || {}).reduce((acc, count) => acc + count, 0);

  const getTenantPlan = (tenant) => {
    return tenant.subscriptionPlan || 'Free';
  };

  const getTenantBillingRate = (planName) => {
    const plan = plans.find(p => p.name === planName);
    return plan ? plan.priceMonthly : 0;
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const res = await fetch(BILLING_ENDPOINTS.DOWNLOAD_INVOICE(invoiceId), {
        headers: { 'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice', error);
    }
  };

  // Group payments by company slug/ID
  const groupedPayments = tenantsList.map(t => {
    const companyPayments = payments.filter(p => p.tenantId === t._id || p.tenantSlug === t.slug);
    const totalPaid = companyPayments
      .filter(p => p.status === 'Captured')
      .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

    return {
      tenant: t,
      payments: companyPayments,
      totalPaid
    };
  });

  const toggleCompany = (companyId) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
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
        {/* KPI 1: Total Companies */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Companies</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{totalCompanies}</span>
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
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{activeSubscriptions}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              {(activeSubscriptions / (totalCompanies || 1) * 100).toFixed(1)}% of total platform
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10">
            <Activity className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 3: Suspended Companies */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended Companies</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{suspendedCompanies}</span>
            <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
              <AlertCircle className={`w-3.5 h-3.5 ${suspendedCompanies > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              Requires intervention
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 z-10">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* KPI 4: Total Platform Users */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform User Volume</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1">{totalUsers}</span>
            <span className="text-[10px] text-slate-500 mt-1">
              Avg {(totalUsers / (totalCompanies || 1)).toFixed(1)} per tenant
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
                <th className="px-6 py-3.5">Company Workspace</th>
                <th className="px-6 py-3.5">Plan tier</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">User capacity</th>
                <th className="px-6 py-3.5">Monthly price</th>
                <th className="px-6 py-3.5">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {tenantsList.map((t) => {
                const plan = getTenantPlan(t);
                const status = t.status || 'Active'; // Company status
                const subStatus = t.subscriptionStatus || 'Trial'; // Subscription status
                const rate = getTenantBillingRate(plan);
                const tenantUsers = stats?.usersPerTenantMap?.[t._id] || 0;
                const capacity = t.employeeCapacity || 0;

                return (
                  <tr key={t._id} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{t.companyName || t.name}</span>
                        <span className="font-mono text-[9px] text-slate-500 mt-0.5">{t._id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${plan === 'Enterprise'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : plan === 'Standard'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : plan === 'Basic'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                        {plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${subStatus === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : subStatus === 'Trial'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {subStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      <span className="font-bold">{tenantUsers}</span> <span className="text-slate-500">/ {capacity} Max</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200 font-mono">
                      ₹{rate.toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {t.planExpiryDate ? new Date(t.planExpiryDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                );
              })}
              {tenantsList.length === 0 && (
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

      {/* Platform Subscription Billing Receipts */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-indigo-400" />
              Platform Billing Receipts & Invoices
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Unified ledger of all multi-tenant payment transactions and receipts.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-3.5">Company Workspace</th>
                <th className="px-6 py-3.5">Total Paid</th>
                <th className="px-6 py-3.5 text-right">Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {groupedPayments.map(({ tenant, payments: tenantPayments, totalPaid }) => {
                const isExpanded = !!expandedCompanies[tenant._id];
                return (
                  <React.Fragment key={tenant._id}>
                    <tr className="transition-all hover:bg-white/[0.01]">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{tenant.companyName || tenant.name}</span>
                          <span className="font-mono text-[9px] text-slate-500 mt-0.5">{tenant.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-200 font-mono">
                        ₹{totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleCompany(tenant._id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold hover:bg-indigo-500/20 transition-all inline-flex items-center gap-2"
                        >
                          <span>{isExpanded ? 'Hide' : `View (${tenantPayments.length})`}</span>
                          <svg
                            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible detail slider */}
                    {isExpanded && (
                      <tr className="bg-slate-950/20">
                        <td colSpan="3" className="px-6 py-4 border-t border-b border-slate-800/60">
                          <div className="flex flex-col gap-3">
                            <h4 className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                              Payment Records: {tenant.companyName || tenant.name}
                            </h4>
                            {tenantPayments.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2">
                                {tenantPayments.map((p) => {
                                  const date = p.paidAt || p.createdAt;
                                  return (
                                    <div
                                      key={p._id}
                                      className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-all"
                                    >
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] uppercase font-bold text-slate-500">Transaction ID</span>
                                        <span className="font-mono text-[10px] text-slate-300 font-semibold">{p.razorpayOrderId}</span>
                                        {p.razorpayPaymentId && (
                                          <span className="font-mono text-[9px] text-slate-500">Pay ID: {p.razorpayPaymentId}</span>
                                        )}
                                      </div>

                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] uppercase font-bold text-slate-500">Date</span>
                                        <span className="font-mono text-slate-300 text-[10px]">
                                          {date ? new Date(date).toLocaleString() : '-'}
                                        </span>
                                      </div>

                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] uppercase font-bold text-slate-500">Amount</span>
                                        <span className="font-mono text-slate-100 font-bold text-[10px]">
                                          ₹{p.totalAmount?.toLocaleString()}
                                        </span>
                                      </div>

                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] uppercase font-bold text-slate-500">Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border w-max ${p.status === 'Captured'
                                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                          : p.status === 'Failed'
                                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                          }`}>
                                          {p.status}
                                        </span>
                                      </div>

                                      <div>
                                        {p.invoiceId ? (
                                          <button
                                            onClick={() => handleDownloadInvoice(p.invoiceId._id || p.invoiceId)}
                                            className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold hover:bg-indigo-500/20 transition-all"
                                          >
                                            PDF Receipt
                                          </button>
                                        ) : (
                                          <span className="text-slate-500 text-[10px] italic">No receipt</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">No transactions recorded</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {groupedPayments.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    No workspaces found.
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
