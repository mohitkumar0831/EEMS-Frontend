import React from 'react';

export const GlobalUsersTab = ({ users, tenants }) => {
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-slate-200">Platform Global User Index</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Company Space</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Role Designation</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-800/40">
            {users.map(u => {
              const companyName = u.tenantId === 'platform' ? 'Platform Admin' : (tenants.find(t => t.id === u.tenantId)?.name || 'Unknown');
              return (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-all">
                  <td className="px-6 py-4 font-semibold text-slate-200">{u.name}</td>
                  <td className="px-6 py-4 text-slate-400">{u.email}</td>
                  <td className="px-6 py-4 text-slate-400">{companyName}</td>
                  <td className="px-6 py-4 text-slate-400">{u.department || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {u.role}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
