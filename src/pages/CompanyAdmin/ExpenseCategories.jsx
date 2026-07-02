import React from 'react';
import { useAppState } from '../../context/StateContext';

export const ExpenseCategories = () => {
  const { currentUser, expenses } = useAppState();
  const tenantExpenses = expenses.filter(exp => exp.tenantId === currentUser?.tenantId);
  const categories = tenantExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Expense Categories</h1>
      <p className="mt-2 text-sm text-slate-400">Review spend by category for your company.</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-slate-200">Category Spend</div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-[11px] tracking-[0.2em]">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(categories).length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-6 text-center text-slate-500">No expense categories available.</td>
                </tr>
              ) : (
                Object.entries(categories).sort(([, a], [, b]) => b - a).map(([category, amount]) => (
                  <tr key={category} className="hover:bg-white/5 transition-all">
                    <td className="px-4 py-4 text-slate-100">{category || 'Uncategorized'}</td>
                    <td className="px-4 py-4 text-slate-300">₹{amount.toFixed(2)}</td>
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
