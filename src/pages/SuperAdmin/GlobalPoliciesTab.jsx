import React from 'react';

export const GlobalPoliciesTab = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-200">Global Spending Guardrails</h3>
        <p className="text-slate-400 text-xs">
          These base limits act as the platform-level fallback default compliance thresholds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="border border-slate-800 p-5 rounded-xl bg-slate-950/20 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Base Meals Limit</span>
            <span className="text-2xl font-bold text-indigo-400">₹80.00 <span className="text-xs text-slate-500">/ meal</span></span>
            <span className="text-[10px] text-slate-500 leading-normal">Applies company-wide as primary threshold limit.</span>
          </div>
          <div className="border border-slate-800 p-5 rounded-xl bg-slate-950/20 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Base Travel Limit</span>
            <span className="text-2xl font-bold text-indigo-400">₹1,200.00 <span className="text-xs text-slate-500">/ trip</span></span>
            <span className="text-[10px] text-slate-500 leading-normal">Applies to standard flight & hotel requests.</span>
          </div>
          <div className="border border-slate-800 p-5 rounded-xl bg-slate-950/20 flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Base Equipment Limit</span>
            <span className="text-2xl font-bold text-indigo-400">₹500.00 <span className="text-xs text-slate-500">/ claim</span></span>
            <span className="text-[10px] text-slate-500 leading-normal">Office and tech accessory spending cap.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
