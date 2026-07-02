import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { ShieldAlert } from 'lucide-react';

export const FinanceViolations = () => {
  const { currentUser, expenses, approveExpense, rejectExpense } = useAppState();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [financeComment, setFinanceComment] = useState('');

  const companyExpenses = expenses.filter(e => e.tenantId === currentUser?.tenantId);
  const violationsQueue = companyExpenses.filter(e => e.status === 'Under Review');

  const handleOverrideApprove = (id) => {
    approveExpense(id, financeComment || 'Overridden and Approved by Finance Team');
    setFinanceComment('');
    setSelectedExpense(null);
  };

  const handleOverrideReject = (id) => {
    if (!financeComment.trim()) {
      alert('Please provide a reason for rejecting the flagged claim.');
      return;
    }
    rejectExpense(id, financeComment);
    setFinanceComment('');
    setSelectedExpense(null);
  };

  if (!currentUser) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden lg:col-span-2 flex flex-col">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-slate-200">Flagged Exceptions Review</h3>
        </div>
        {violationsQueue.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">No active policy exceptions found in the workspace.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {violationsQueue.map(exp => (
              <button
                key={exp.id}
                onClick={() => setSelectedExpense(exp)}
                className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.01] transition-all border-l-2 cursor-pointer ${
                  selectedExpense?.id === exp.id ? 'border-l-indigo-500 bg-indigo-500/[0.02]' : 'border-l-transparent'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200">{exp.title}</span>
                  <span className="text-[10px] text-slate-500">{exp.employeeName} • {exp.category} • {exp.date}</span>
                </div>
                <span className="text-xs font-extrabold text-rose-400">₹{exp.amount.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-200">Compliance Override Control</h3>
        {selectedExpense ? (
          <div className="flex flex-col gap-4 text-xs">
            <div className="bg-rose-950/40 border border-rose-500/25 p-3 rounded-lg text-rose-400 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Hard Policy Check Triggered</span>
                Expense amount exceeds the category limit guardrail defined by tenant policies.
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col gap-1.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200">{selectedExpense.title}</span>
                <span className="text-rose-400 font-extrabold">₹{selectedExpense.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1"><span className="text-slate-500">Employee:</span><span className="text-slate-300 font-semibold">{selectedExpense.employeeName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="text-slate-300 font-semibold">{selectedExpense.category}</span></div>
              <p className="text-[10px] text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 mt-2">{selectedExpense.description}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-4">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Compliance Override Comment</label>
              <textarea
                value={financeComment}
                onChange={(e) => setFinanceComment(e.target.value)}
                placeholder="Provide justification notes for overriding or rejecting policy exception..."
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-16 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOverrideReject(selectedExpense.id)}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl py-2 px-4 font-semibold text-xs transition-all cursor-pointer"
              >
                Reject Flag
              </button>
              <button
                onClick={() => handleOverrideApprove(selectedExpense.id)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2 px-4 font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Override & Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 text-xs">Select a flagged violation to perform override action.</p>
          </div>
        )}
      </div>
    </div>
  );
};
