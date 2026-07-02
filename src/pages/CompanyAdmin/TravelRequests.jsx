import React from 'react';
import { useAppState } from '../../context/StateContext';

export const TravelRequests = () => {
  const { currentUser, travelRequests } = useAppState();
  const tenantTravel = travelRequests.filter(tr => tr.tenantId === currentUser?.tenantId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100">Travel Requests</h1>
      <p className="mt-2 text-sm text-slate-400">Review travel request details for your company.</p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 text-sm font-semibold text-slate-200">Travel Requests</div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-[11px] tracking-[0.2em]">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenantTravel.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">No travel requests found.</td>
                </tr>
              ) : (
                tenantTravel.map(tr => (
                  <tr key={tr.id} className="hover:bg-white/5 transition-all">
                    <td className="px-4 py-4 text-slate-100">{tr.employeeName}</td>
                    <td className="px-4 py-4">{tr.destination || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-300">₹{tr.estimatedCost?.toFixed(2) ?? '0.00'}</td>
                    <td className="px-4 py-4 text-slate-300">{tr.status}</td>
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
