import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { API_BASE_URL } from '../../constants/apiConstants';
import {
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Users,
  IndianRupee,
  Shield,
  Settings,
  Info,
  Plane,
  CreditCard,
  Filter,
  Check,
  X
} from 'lucide-react';

const getTypeConfig = (type) => {
  switch (type) {
    case 'expense_created':
      return {
        category: 'Expense',
        title: 'New Expense Submitted',
        icon: FileText,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        dot: 'bg-indigo-400',
        alertType: 'info'
      };
    case 'expense_requires_processing':
      return {
        category: 'Expense',
        title: 'Expense Ready for Processing',
        icon: IndianRupee,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20',
        dot: 'bg-sky-400',
        alertType: 'info'
      };
    case 'expense_status_updated':
    case 'expense_completed':
      return {
        category: 'Reimbursement',
        title: 'Expense Status Updated',
        icon: CheckCircle2,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-400',
        alertType: 'success'
      };
    default:
      return {
        category: 'Policy',
        title: 'System Alert',
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: 'bg-amber-400',
        alertType: 'alert'
      };
  }
};

const CATEGORIES = ['All', 'Policy', 'Expense', 'Travel', 'Reimbursement', 'Compliance', 'Team'];

export const Notifications = () => {
  const { currentUser } = useAppState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');    // 'All' | 'Unread' | category
  const [catFilter, setCatFilter] = useState('All');

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const formatted = data.data.map(n => {
          const config = getTypeConfig(n.type);
          return {
            id: n.id,
            type: config.alertType,
            category: config.category,
            title: config.title,
            desc: n.text,
            time: n.time,
            read: n.read,
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            border: config.border,
            dot: config.dot
          };
        });
        setItems(formatted);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const unreadCount = items.filter(n => !n.read).length;

  const markAllRead = async () => {
    if (!currentUser || !currentUser.token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      setItems(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const markRead = async (id) => {
    if (!currentUser || !currentUser.token) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  const dismiss = async (id) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  const filtered = items.filter(n => {
    const passesRead = filter === 'Unread' ? !n.read : true;
    const passesCat = catFilter === 'All' ? true : n.category === catFilter;
    return passesRead && passesCat;
  });

  // Stats
  const alertCount = items.filter(n => n.type === 'alert').length;
  const successCount = items.filter(n => n.type === 'success').length;
  const infoCount = items.filter(n => n.type === 'info').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }
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
