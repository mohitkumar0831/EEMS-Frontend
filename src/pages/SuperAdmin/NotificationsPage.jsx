import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Bell, Megaphone, Trash2, Send, ShieldAlert, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const { tenants, showToast } = useAppState();
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, title: 'Scheduled Database Optimization', message: 'EEMS will undergo scheduled database index optimizations on Sunday, July 5th between 02:00 and 04:00 UTC. Minor query delays may occur.', level: 'Info', target: 'All Workspaces', time: '2026-07-01T10:00:00Z' },
    { id: 2, title: 'OAuth Provider Sync Interruption', message: 'We detected a transient sync latency on Microsoft Azure AD SSO logins. Resolution successfully applied.', level: 'Warning', target: 'Acme Corp', time: '2026-06-30T14:30:00Z' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    level: 'Info',
    target: 'all'
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('Title and message cannot be empty.', 'error');
      return;
    }

    const targetName = formData.target === 'all' ? 'All Workspaces' : (tenants.find(t => t.id === formData.target)?.name || 'Specific');
    const newBroadcast = {
      id: Date.now(),
      title: formData.title,
      message: formData.message,
      level: formData.level,
      target: targetName,
      time: new Date().toISOString()
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);
    showToast(`Notice "${formData.title}" broadcasted successfully!`, 'success');
    setFormData({ title: '', message: '', level: 'Info', target: 'all' });
  };

  const handleDelete = (id) => {
    setBroadcasts(prev => prev.filter(b => b.id !== id));
    showToast('Broadcast alert removed from logs.', 'info');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Broadcast Form */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Megaphone className="w-4.5 h-4.5 text-indigo-400" />
            Broadcast System Alerts
          </h3>
          <p className="text-slate-400 text-xs mt-1">Publish global announcements or warning banners directly to active tenant workspaces.</p>
        </div>

        <form onSubmit={handleSend} className="flex flex-col gap-4 mt-2">
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            <span className="font-medium text-slate-200">Alert Title</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="EEMS Platform Maintenance Notice"
              className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-400">
            <span className="font-medium text-slate-200">Notification Message</span>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Provide clear details regarding scope, impact, or requirements..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500 min-h-24 resize-none"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-medium text-slate-200">Severity Tier</span>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Info">Info (Blue)</option>
                <option value="Warning">Warning (Amber)</option>
                <option value="Critical">Critical (Rose)</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-medium text-slate-200">Destination Workspace</span>
              <select
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Workspaces</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Send className="w-4 h-4" />
            Dispatch Broadcast Alert
          </button>
        </form>
      </div>

      {/* Broadcast History logs */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl lg:col-span-2 flex flex-col gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Megaphone className="w-4.5 h-4.5 text-indigo-400" />
            Notice Broadcast Register
          </h3>
          <p className="text-slate-400 text-xs mt-1">Audit log of active and historical tenant alerts published on this platform.</p>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[390px] pr-1">
          {broadcasts.map(b => (
            <div key={b.id} className="p-4 bg-slate-950/30 border border-white/5 hover:border-white/10 rounded-xl flex items-start justify-between gap-4 transition-all">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                    b.level === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    b.level === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {b.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(b.time).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 px-1.5 py-0.5 bg-slate-800 rounded">
                    To: {b.target}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
                <p className="text-slate-400 text-[11px] leading-normal">{b.message}</p>
              </div>

              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                title="Remove Broadcast Log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {broadcasts.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">No active notices broadcasted on this cluster.</div>
          )}
        </div>
      </div>
    </div>
  );
};
