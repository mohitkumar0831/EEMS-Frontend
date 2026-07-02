import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import {
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Shield,
  Settings,
  Info,
  Plane,
  CreditCard,
  Filter,
  Check,
  X
} from 'lucide-react';

const notificationData = [
  {
    id: 1,
    type: 'alert',
    category: 'Policy',
    title: 'Policy Cap Exceeded — Meals',
    desc: 'Employee meal expenses have exceeded the ₹150 monthly cap for 3 employees in the Engineering department. Manual review required.',
    time: '5m ago',
    ts: Date.now() - 5 * 60 * 1000,
    read: false,
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400'
  },
  {
    id: 2,
    type: 'approval',
    category: 'Expense',
    title: 'New Expense Claims — Awaiting Manager',
    desc: '4 new expense claims have been submitted by employees and are currently pending manager sign-off. Oldest claim is 2 days old.',
    time: '22m ago',
    ts: Date.now() - 22 * 60 * 1000,
    read: false,
    icon: FileText,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-400'
  },
  {
    id: 3,
    type: 'info',
    category: 'Travel',
    title: 'Travel Request Pending Finance Approval',
    desc: 'A business trip request for the Chicago Sales Conference (est. ₹1,200) has been approved by the manager and is awaiting finance disbursement.',
    time: '1h ago',
    ts: Date.now() - 60 * 60 * 1000,
    read: false,
    icon: Plane,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400'
  },
  {
    id: 4,
    type: 'success',
    category: 'Reimbursement',
    title: 'Reimbursements Processed — 6 Employees',
    desc: 'Finance team has successfully processed ₹2,340.50 in reimbursements for 6 employees via ACH Direct Deposit. Settlement complete.',
    time: '3h ago',
    ts: Date.now() - 3 * 60 * 60 * 1000,
    read: true,
    icon: CreditCard,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400'
  },
  {
    id: 5,
    type: 'alert',
    category: 'Compliance',
    title: 'Audit Flag — Equipment Purchase',
    desc: 'A ₹3,800 equipment purchase claim by John Smith has been flagged by the auditor for missing vendor invoice. Requires follow-up.',
    time: '5h ago',
    ts: Date.now() - 5 * 60 * 60 * 1000,
    read: true,
    icon: Shield,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    dot: 'bg-rose-400'
  },
  {
    id: 6,
    type: 'info',
    category: 'Team',
    title: 'New Employee Registered',
    desc: 'A new employee, Priya Mehta, has been registered under the Marketing department and is now active in the system.',
    time: '8h ago',
    ts: Date.now() - 8 * 60 * 60 * 1000,
    read: true,
    icon: Users,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    dot: 'bg-violet-400'
  },
  {
    id: 7,
    type: 'info',
    category: 'Policy',
    title: 'Company Policy Updated',
    desc: 'The travel expense policy has been updated. New per-diem rate is ₹85/day. All employees have been notified automatically.',
    time: 'Yesterday',
    ts: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    icon: Settings,
    color: 'text-slate-400',
    bg: 'bg-slate-700/30',
    border: 'border-slate-700/50',
    dot: 'bg-slate-500'
  },
  {
    id: 8,
    type: 'success',
    category: 'Expense',
    title: 'Monthly Budget Utilisation Report Ready',
    desc: 'June 2026 budget utilisation report is ready for download. Total company spend: ₹18,420 out of ₹25,000 budget (73.7%).',
    time: '2 days ago',
    ts: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
    icon: TrendingUp,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    dot: 'bg-teal-400'
  },
  {
    id: 9,
    type: 'alert',
    category: 'Compliance',
    title: 'Overdue Expense Submission Warning',
    desc: 'Two employees have expense receipts from 25+ days ago that have not been submitted. Policy requires submission within 30 days.',
    time: '2 days ago',
    ts: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
    icon: Clock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    dot: 'bg-orange-400'
  },
  {
    id: 10,
    type: 'info',
    category: 'Reimbursement',
    title: 'Finance Settlement Slip Generated',
    desc: 'Payout slip TXN-20260629-0042 has been generated for ₹540.00 reimbursement to Alice Martin. Reference retained in audit trail.',
    time: '3 days ago',
    ts: Date.now() - 3 * 24 * 60 * 60 * 1000,
    read: true,
    icon: DollarSign,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400'
  }
];

const CATEGORIES = ['All', 'Policy', 'Expense', 'Travel', 'Reimbursement', 'Compliance', 'Team'];

export const Notifications = () => {
  const [items, setItems] = useState(notificationData);
  const [filter, setFilter] = useState('All');    // 'All' | 'Unread' | category
  const [catFilter, setCatFilter] = useState('All');

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id) => setItems(prev => prev.filter(n => n.id !== id));

  const filtered = items.filter(n => {
    const passesRead = filter === 'Unread' ? !n.read : true;
    const passesCat = catFilter === 'All' ? true : n.category === catFilter;
    return passesRead && passesCat;
  });

  // Stats
  const alertCount = items.filter(n => n.type === 'alert').length;
  const successCount = items.filter(n => n.type === 'success').length;
  const infoCount = items.filter(n => n.type === 'info').length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            Notifications Center
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            System alerts, approval updates, and compliance events for your company workspace.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-white/10 hover:border-indigo-500/30 rounded-xl text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Unread</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-0.5 block">{unreadCount}</span>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><Bell className="w-5 h-5" /></div>
        </div>
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Alerts</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-0.5 block">{alertCount}</span>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
        </div>
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Resolved</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-0.5 block">{successCount}</span>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Info</span>
            <span className="text-2xl font-extrabold text-sky-400 mt-0.5 block">{infoCount}</span>
          </div>
          <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400"><Info className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Read filter */}
        <div className="flex bg-slate-900/60 border border-white/5 p-1 rounded-xl gap-1">
          {['All', 'Unread'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === f
                  ? 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {f}
              {f === 'Unread' && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-bold bg-rose-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${catFilter === cat
                  ? 'bg-slate-700 border-slate-600 text-slate-100'
                  : 'bg-transparent border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-slate-800 rounded-3xl">
          <BellOff className="w-10 h-10 text-slate-700" />
          <p className="text-slate-500 text-sm font-medium">No notifications found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`group relative bg-slate-900/60 border ${n.read ? 'border-white/5' : 'border-white/10'} rounded-2xl p-5 shadow-xl transition-all hover:border-white/15 flex gap-4`}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${n.dot} shadow-sm`} />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-2xl ${n.bg} border ${n.border} flex items-center justify-center shrink-0 mt-0.5 ${n.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-1 flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-bold ${n.read ? 'text-slate-300' : 'text-slate-100'}`}>
                        {n.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${n.bg} ${n.color} ${n.border}`}>
                        {n.category}
                      </span>
                      {!n.read && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 shrink-0 mt-0.5">{n.time}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
