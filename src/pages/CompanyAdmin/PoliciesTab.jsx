import React from 'react';
import { Plus } from 'lucide-react';

export const PoliciesTab = ({
  tenantPolicies,
  newCategory, setNewCategory,
  newLimit, setNewLimit,
  newRule, setNewRule,
  handleAddPolicy,
  updateCompanyPolicy
}) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Add Policy Form */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-200">Define Spending Policy limit</h3>
        <form onSubmit={handleAddPolicy} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Meals">Meals / Food</option>
              <option value="Travel">Travel / Flight / Hotel</option>
              <option value="Equipment">IT Equipment / Supplies</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Maximum Limit (₹)</label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="e.g. 150"
              className="bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">Policy Description</label>
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="e.g. Daily client lunch allowance"
              className="bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2.5 px-4 font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
          >
            <Plus className="w-4 h-4" />
            Add Policy Guardrail
          </button>
        </form>
      </div>

      {/* Current Policies */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-slate-200">Active Spending Policy Registers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Expense Category</th>
                <th className="px-6 py-4">Policy Description</th>
                <th className="px-6 py-4">Maximum Amount</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/40">
              {tenantPolicies.map(pol => (
                <tr key={pol.id} className="hover:bg-white/[0.01] transition-all">
                  <td className="px-6 py-4 font-semibold text-slate-200">{pol.category}</td>
                  <td className="px-6 py-4 text-slate-400">{pol.rule}</td>
                  <td className="px-6 py-4 text-slate-100 font-bold">₹{pol.limit.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        const newCap = prompt("Enter new maximum limit:", pol.limit);
                        if (newCap && !isNaN(newCap)) {
                          updateCompanyPolicy(pol.id, newCap, pol.rule);
                        }
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer"
                    >
                      Modify Limit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
