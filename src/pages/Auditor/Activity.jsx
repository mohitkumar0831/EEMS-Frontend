import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Search } from 'lucide-react';

export const AuditorActivity = () => {
  const { currentUser, auditLogs } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const companyLogs = auditLogs.filter(log => log.tenantId === currentUser?.tenantId || log.tenantId === 'platform');
  const filteredLogs = companyLogs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activity logs (e.g. login, approved, Alice)..."
          className="bg-transparent text-xs w-full text-slate-200 placeholder-slate-600 focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-slate-200">System Logs Registry</h3>
        </div>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">No activity records match your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-all text-slate-300">
                    <td className="px-6 py-4 font-bold text-indigo-400">{log.action}</td>
                    <td className="px-6 py-4 max-w-sm truncate" title={log.details}>{log.details}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{log.user}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
