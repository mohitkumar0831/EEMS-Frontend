import React from 'react';
import { useAppState } from '../../context/StateContext';

export const Departments = () => {
  const { currentUser, users } = useAppState();
  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);
  const departments = Array.from(new Set(tenantUsers.map(u => u.department || 'General'))).sort();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Departments</h1>
      <p className="mt-2 text-sm text-slate-400">Manage departments and view headcount by team.</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-slate-200">Department List</div>
        <div className="p-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white/5 p-6 text-slate-500">No departments defined.</div>
          ) : (
            departments.map((dept) => {
              const count = tenantUsers.filter(u => (u.department || 'General') === dept).length;
              return (
                <div key={dept} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                  <div className="text-sm text-slate-400">Department</div>
                  <div className="mt-3 text-lg font-semibold text-slate-100">{dept}</div>
                  <div className="mt-2 text-xs text-slate-500">{count} member{count === 1 ? '' : 's'}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
