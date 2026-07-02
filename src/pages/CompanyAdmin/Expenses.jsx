import React from 'react';
import { useAppState } from '../../context/StateContext';

export const Expenses = () => {
  const { currentUser, expenses } = useAppState();
  const tenantExpenses = expenses.filter(exp => exp.tenantId === currentUser?.tenantId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Expenses</h1>
      <p className="mt-2 text-sm text-slate-400">Browse all expense requests and status updates.</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-slate-200">Expense Ledger</div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-[11px] tracking-[0.2em]">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenantExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">No expenses have been submitted yet.</td>
                </tr>
              ) : (
                tenantExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-all">
                    <td className="px-4 py-4 text-slate-100">{exp.employeeName}</td>
                    <td className="px-4 py-4">{exp.category}</td>
                    <td className="px-4 py-4 text-slate-300">₹{exp.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 text-slate-300">{exp.status}</td>
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
