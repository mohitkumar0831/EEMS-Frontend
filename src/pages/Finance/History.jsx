import React from 'react';
import { useAppState } from '../../context/StateContext';

export const FinanceHistory = () => {
  const { currentUser, expenses } = useAppState();

  const companyExpenses = expenses.filter(e => e.tenantId === currentUser?.tenantId);
  const paidHistory = companyExpenses.filter(e => e.status === 'Paid');

  if (!currentUser) return null;

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-slate-200">Reimbursement Payout Registry</h3>
      </div>
      {paidHistory.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm">No processed payments in the ledger.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Disbursement Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paidHistory.map(exp => (
                <tr key={exp.id} className="hover:bg-white/[0.01] transition-all text-slate-300">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{exp.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{exp.employeeName}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{exp.title}</td>
                  <td className="px-6 py-4 font-extrabold text-emerald-400">₹{exp.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-400">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      Paid
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
