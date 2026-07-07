import React from 'react';
import { ScrollText, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuditLogs = () => {
  // Simple static array of mock audit logs
  const logs = [
    { id: 1, action: 'Tenant Deleted', actor: 'SuperAdmin John', target: 'Acme Corp', date: '2026-07-07 14:30', status: 'critical' },
    { id: 2, action: 'Subscription Upgraded', actor: 'Platform System', target: 'TechFlow Inc', date: '2026-07-06 09:15', status: 'success' },
    { id: 3, action: 'Company Admin Created', actor: 'SuperAdmin Jane', target: 'jane@techflow.com', date: '2026-07-06 09:12', status: 'info' },
    { id: 4, action: 'Tenant Suspended', actor: 'SuperAdmin John', target: 'Inacitve Corp', date: '2026-07-05 11:20', status: 'warning' },
    { id: 5, action: 'Platform Settings Updated', actor: 'SuperAdmin John', target: 'Global Config', date: '2026-07-01 10:00', status: 'info' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <ScrollText className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <ScrollText className="w-4.5 h-4.5 text-indigo-400" />
          Global Audit & Security Logs
        </h3>
        <p className="text-slate-400 text-xs mt-1">Chronological record of critical platform events and administrative actions.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Target / Record</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="transition-all hover:bg-white/[0.01]">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                      {getStatusIcon(log.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{log.action}</td>
                  <td className="px-6 py-4 text-slate-400">{log.actor}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono">{log.target}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
