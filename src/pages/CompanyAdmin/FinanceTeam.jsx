import React from 'react';
import { useAppState } from '../../context/StateContext';

export const FinanceTeam = () => {
  const { currentUser, users } = useAppState();
  const financeTeam = users.filter(u => u.tenantId === currentUser?.tenantId && u.role === 'Finance Team');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Finance Team</h1>
      <p className="mt-2 text-sm text-slate-400">Review your finance team members and access controls.</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-slate-200">Finance Team Members</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-[11px] tracking-[0.2em]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {financeTeam.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-500">No finance team members found.</td>
                </tr>
              ) : (
                financeTeam.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-all">
                    <td className="px-4 py-4 text-slate-100">{member.name}</td>
                    <td className="px-4 py-4">{member.email}</td>
                    <td className="px-4 py-4">{member.department || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
