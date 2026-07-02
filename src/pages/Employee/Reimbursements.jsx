import React from 'react';
import { useAppState } from '../../context/StateContext';

export const Reimbursements = () => {
  const { currentUser, expenses } = useAppState();
  const myExpenses = expenses.filter((e) => e.employeeId === currentUser?.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
      <div className="border-b border-white/5 px-6 py-4">
        <h3 className="text-base font-bold text-slate-200">My Claim Status Summary</h3>
      </div>
      {myExpenses.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-slate-500">You have not filed any reimbursement claims yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Approver Comments</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {myExpenses.map((exp) => (
                <tr key={exp.id} className="text-slate-300 transition-all hover:bg-white/[0.01]">
                  <td className="px-6 py-4 font-semibold text-slate-200">{exp.title}</td>
                  <td className="px-6 py-4">{exp.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-200">₹{exp.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-400">{exp.date}</td>
                  <td className="max-w-[200px] truncate px-6 py-4 text-slate-400">
                    {exp.comments.length > 0 ? (
                      <span className="italic">"{exp.comments[exp.comments.length - 1].text}"</span>
                    ) : (
                      <span className="text-slate-600">No review comments yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      exp.status === 'Paid'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : exp.status === 'Approved'
                          ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                          : exp.status === 'Rejected'
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
