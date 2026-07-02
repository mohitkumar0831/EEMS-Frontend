import React from 'react';
import { useAppState } from '../../context/StateContext';

export const Team = () => {
  const { currentUser, users } = useAppState();
  const companyUsers = users.filter(u => u.tenantId === currentUser?.tenantId);
  const teamMembers = companyUsers.filter(u => u.department === currentUser?.department && u.role === 'Employee');

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-slate-200">Department Team Members Directory</h3>
        <span className="text-[10px] text-indigo-400 font-bold uppercase mt-1 block">Department: {currentUser?.department}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Department Space</th>
              <th className="px-6 py-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {teamMembers.map(member => (
              <tr key={member.id} className="hover:bg-white/[0.01] transition-all text-slate-300">
                <td className="px-6 py-4 font-semibold text-slate-200">{member.name}</td>
                <td className="px-6 py-4 text-slate-400">{member.email}</td>
                <td className="px-6 py-4 text-slate-400">{member.department}</td>
                <td className="px-6 py-4 text-slate-400">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
