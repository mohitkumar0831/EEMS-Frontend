import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { BILLING_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import {
  CreditCard, TrendingUp, Calendar, Clock, Download, ChevronRight,
  CheckCircle2, AlertTriangle, Shield, Loader2, Users, Database,
  Receipt, ArrowUpRight, Zap, Crown
} from 'lucide-react';

export const Billing = () => {
  const { currentUser, showToast } = useAppState();
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userCount, setUserCount] = useState(0);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
  };

  const tenantId = currentUser?.tenantId;

  useEffect(() => {
    if (!tenantId) return;

    const fetchAll = async () => {
      try {
        const [subRes, plansRes, paymentsRes, invoicesRes] = await Promise.all([
          fetch(BILLING_ENDPOINTS.GET_SUBSCRIPTION(tenantId), { headers }),
          fetch(BILLING_ENDPOINTS.GET_PLANS, { headers }),
          fetch(BILLING_ENDPOINTS.GET_PAYMENT_HISTORY(tenantId), { headers }),
          fetch(BILLING_ENDPOINTS.GET_INVOICES(tenantId), { headers }),
        ]);

        const subData = await subRes.json();
        const plansData = await plansRes.json();
        const paymentsData = await paymentsRes.json();
        const invoicesData = await invoicesRes.json();

        if (subData.success) setSubscription(subData.data);
        if (plansData.success) setPlans(plansData.data);
        if (paymentsData.success) setPayments(paymentsData.data);
        if (invoicesData.success) setInvoices(invoicesData.data);

        // Fetch current user count for the tenant
        if (currentUser?.tenantSlug) {
          try {
            const usersRes = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
              headers: { 'Authorization': headers.Authorization },
            });
            const usersData = await usersRes.json();
            if (usersData.data) setUserCount(usersData.data.length);
          } catch (err) {
            console.error('Failed to fetch user count:', err);
          }
        }
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [tenantId, currentUser]);

  // ─── Razorpay Payment Handler ──────────────────
  const handlePayNow = async () => {
    if (!subscription) return;
    setPaymentLoading(true);

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch(BILLING_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subscriptionId: subscription._id,
          tenantId: subscription.tenantId,
          tenantSlug: subscription.tenantSlug,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        showToast(orderData.message || 'Failed to create payment order', 'error');
        setPaymentLoading(false);
        return;
      }

      const { orderId, amount, currency, razorpayKeyId, planName, billingCycle } = orderData.data;

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'EEMS Platform',
        description: `${planName} Plan - ${billingCycle} Subscription`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // 3. Verify payment
            const verifyRes = await fetch(BILLING_ENDPOINTS.VERIFY_PAYMENT, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: subscription._id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              showToast('Payment successful! Subscription activated.', 'success');
              setSubscription(verifyData.data.subscription);
              // Refresh payments & invoices
              const [pRes, iRes] = await Promise.all([
                fetch(BILLING_ENDPOINTS.GET_PAYMENT_HISTORY(tenantId), { headers }),
                fetch(BILLING_ENDPOINTS.GET_INVOICES(tenantId), { headers }),
              ]);
              const pData = await pRes.json();
              const iData = await iRes.json();
              if (pData.success) setPayments(pData.data);
              if (iData.success) setInvoices(iData.data);
            } else {
              showToast(verifyData.message || 'Payment verification failed', 'error');
            }
          } catch (err) {
            showToast('Payment verification error', 'error');
          }
          setPaymentLoading(false);
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
        prefill: {
          email: currentUser?.email,
          contact: currentUser?.phone,
        },
        theme: { color: '#6366f1' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      showToast('Failed to initiate payment', 'error');
      setPaymentLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const res = await fetch(BILLING_ENDPOINTS.DOWNLOAD_INVOICE(invoiceId), {
        headers: { 'Authorization': headers.Authorization },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast('Failed to download invoice', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Trial': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PastDue': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Expired': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Suspended': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-800 text-slate-400 border-white/5';
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        <span className="ml-2 text-slate-400 text-sm">Loading billing information...</span>
      </div>
    );
  }

  const needsPayment = subscription && ['Trial', 'PastDue', 'Expired'].includes(subscription.status);
  const currentPlan = plans.find(p => p._id === subscription?.planId?._id || p._id === subscription?.planId);

  return (
    <div className="flex flex-col gap-6">
      {/* Subscription Status Banner */}
      {subscription && (
        <div className={`rounded-2xl border p-6 relative overflow-hidden ${
          subscription.status === 'Active'
            ? 'bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-slate-900 border-emerald-500/10'
            : subscription.status === 'Trial'
            ? 'bg-gradient-to-r from-amber-600/10 via-amber-500/5 to-slate-900 border-amber-500/10'
            : 'bg-gradient-to-r from-rose-600/10 via-rose-500/5 to-slate-900 border-rose-500/10'
        }`}>
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100">{subscription.planName} Plan</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {subscription.status === 'Trial' && `Trial ends ${formatDate(subscription.trialEndDate)}`}
                {subscription.status === 'Active' && `Next billing: ${formatDate(subscription.nextBillingDate)}`}
                {subscription.status === 'PastDue' && `Grace period ends: ${formatDate(subscription.graceEndDate)}`}
                {subscription.status === 'Expired' && 'Your subscription has expired. Please pay to continue.'}
                {subscription.status === 'Suspended' && 'Workspace suspended. Contact support or pay to reactivate.'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Billing: {subscription.billingCycle}</span>
                <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> ₹{subscription.currentAmount}/{subscription.billingCycle === 'Monthly' ? 'mo' : subscription.billingCycle === 'Quarterly' ? 'qtr' : 'yr'}</span>
              </div>
            </div>
            {needsPayment && subscription.currentAmount > 0 && (
              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {paymentLoading ? 'Processing...' : `Pay ₹${(subscription.currentAmount * 1.18).toFixed(0)} Now`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-900 rounded-xl p-1 border border-white/5 w-fit">
        {['overview', 'payments', 'plans'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
              activeTab === tab ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'payments' ? 'Payment History' : 'Available Plans'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && subscription && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan Details */}
          <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-indigo-400" />
              Subscription Details
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Plan', value: subscription.planName, icon: Crown },
                { label: 'Status', value: subscription.status, icon: CheckCircle2 },
                { label: 'Billing Cycle', value: subscription.billingCycle, icon: Calendar },
                { label: 'Amount', value: `₹${subscription.currentAmount} + GST`, icon: CreditCard },
                { label: 'Start Date', value: formatDate(subscription.startDate), icon: Clock },
                { label: 'End Date', value: formatDate(subscription.endDate), icon: Clock },
                { label: 'Last Payment', value: formatDate(subscription.lastPaymentDate), icon: Receipt },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    {label}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{value || '-'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Limits & Usage */}
          {currentPlan && (
            <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Plan Limits
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> User Capacity</span>
                    <span className="text-slate-200 font-mono">{userCount} / {currentPlan.userLimit} accounts</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${userCount >= currentPlan.userLimit ? 'bg-rose-500' : userCount >= currentPlan.userLimit * 0.8 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min((userCount / currentPlan.userLimit) * 100, 100)}%` }} />
                  </div>
                  {userCount >= currentPlan.userLimit && (
                    <p className="text-[10px] text-rose-400 mt-1 font-semibold">User limit reached — upgrade plan to add more users</p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1"><Database className="w-3.5 h-3.5" /> Storage</span>
                    <span className="text-slate-200 font-mono">{currentPlan.storageGB} GB</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Included Features</h5>
                  <div className="space-y-1.5">
                    {(currentPlan.features || []).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {feature}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {currentPlan.supportLevel} support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h4 className="text-sm font-bold text-slate-200">Payment History & Invoices</h4>
          </div>
          {payments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No payments yet</p>
              <p className="text-xs text-slate-500 mt-1">Your payment history will appear here after your first payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {payments.map(p => (
                    <tr key={p._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="px-6 py-4 text-slate-300">{formatDate(p.paidAt || p.createdAt)}</td>
                      <td className="px-6 py-4 text-slate-200 font-medium">{p.description}</td>
                      <td className="px-6 py-4 text-slate-100 font-mono font-semibold">₹{p.totalAmount?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          p.status === 'Captured' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          p.status === 'Failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status === 'Captured' ? 'Paid' : p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.invoiceId && (
                          <button
                            onClick={() => handleDownloadInvoice(p.invoiceId._id || p.invoiceId)}
                            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map(plan => {
            const isCurrent = subscription?.planName === plan.name;
            return (
              <div key={plan._id} className={`bg-slate-900 border p-5 rounded-2xl flex flex-col gap-4 transition-all ${
                isCurrent ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-white/5 hover:border-white/10'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{plan.name}</span>
                    {isCurrent && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">CURRENT</span>}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-100 font-mono">
                    ₹{plan.priceMonthly}<span className="text-sm text-slate-500 font-normal">/mo</span>
                  </div>
                  {plan.description && <p className="text-xs text-slate-500 mt-1">{plan.description}</p>}
                </div>

                <div className="flex flex-col gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-500" /> {plan.userLimit} Users</div>
                  <div className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-500" /> {plan.storageGB} GB Storage</div>
                  <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-slate-500" /> {plan.supportLevel}</div>
                </div>

                {(plan.features || []).length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {!isCurrent && (
                  <button className="mt-auto w-full py-2.5 px-4 border border-indigo-500/30 text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-1">
                    {plan.priceMonthly > (subscription?.currentAmount || 0) ? 'Upgrade' : 'Downgrade'}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
