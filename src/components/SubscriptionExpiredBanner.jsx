import React from 'react';
import { AlertTriangle, CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';

/**
 * Full-screen overlay banner shown to tenant users when their subscription
 * is expired or suspended. Only Company Admin sees the "Pay Now" action.
 */
export const SubscriptionExpiredBanner = ({ status, tenantSlug }) => {
  const { currentUser } = useAppState();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'CompanyAdmin';

  if (!status || !['Expired', 'Suspended', 'PastDue'].includes(status)) {
    return null;
  }

  const messages = {
    PastDue: {
      title: 'Subscription Payment Overdue',
      desc: 'Your workspace subscription is past due. Please make payment to avoid service interruption.',
      color: 'from-amber-600/20 via-amber-500/10 to-slate-950',
      borderColor: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
    Expired: {
      title: 'Subscription Expired',
      desc: 'Your workspace subscription has expired. Features are restricted until payment is made.',
      color: 'from-rose-600/20 via-rose-500/10 to-slate-950',
      borderColor: 'border-rose-500/20',
      iconColor: 'text-rose-400',
    },
    Suspended: {
      title: 'Workspace Suspended',
      desc: 'Your workspace has been suspended due to non-payment. All features are locked.',
      color: 'from-rose-700/20 via-rose-600/10 to-slate-950',
      borderColor: 'border-rose-600/20',
      iconColor: 'text-rose-500',
    },
  };

  const msg = messages[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className={`max-w-md w-full mx-4 bg-gradient-to-br ${msg.color} border ${msg.borderColor} rounded-2xl p-8 text-center shadow-2xl`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center ${msg.iconColor}`}>
          {status === 'Suspended' ? <Lock className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">{msg.title}</h2>
        <p className="text-sm text-slate-400 mb-6">{msg.desc}</p>

        {isAdmin ? (
          <button
            onClick={() => navigate(`/${tenantSlug}/dashboard/company-admin/billing`)}
            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Go to Billing & Pay Now
          </button>
        ) : (
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400">
              Please contact your <span className="text-slate-200 font-semibold">Company Administrator</span> to renew the subscription and restore access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
