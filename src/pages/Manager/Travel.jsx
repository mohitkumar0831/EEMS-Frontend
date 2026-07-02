import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Check, X } from 'lucide-react';

export const Travel = () => {
  const { currentUser, travelRequests, reviewTravelRequest } = useAppState();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');

  const companyTravel = travelRequests.filter(t => t.tenantId === currentUser?.tenantId);
  const pendingRequests = companyTravel.filter(t => t.status === 'Pending');

  const handleApprove = (id) => {
    reviewTravelRequest(id, 'Approved', 'Approved by manager');
    setSelectedRequest(null);
    setComment('');
  };

  const handleReject = (id) => {
    if (!comment.trim()) return;
    reviewTravelRequest(id, 'Rejected', comment);
    setSelectedRequest(null);
    setComment('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden lg:col-span-2">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-base font-bold text-slate-200">Pending Travel Approvals</h3>
        </div>
        {pendingRequests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">No pending travel authorization requests from your team.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Est. Cost</th>
                  <th className="px-6 py-4">Mileage (mi)</th>
                  <th className="px-6 py-4">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {pendingRequests.map(tr => (
                  <tr
                    key={tr.id}
                    className="hover:bg-white/[0.01] transition-all text-slate-300 cursor-pointer"
                    onClick={() => setSelectedRequest(tr)}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-200">{tr.employeeName}</td>
                    <td className="px-6 py-4">{tr.destination}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{tr.purpose}</td>
                    <td className="px-6 py-4 font-bold text-slate-200">₹{tr.estimatedCost?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-400">{tr.mileage}</td>
                    <td className="px-6 py-4 text-indigo-300">Review</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-200">Request Details</h3>
        {selectedRequest ? (
          <div className="flex flex-col gap-4 text-xs">
            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="font-bold text-slate-200 text-sm truncate max-w-[150px]">{selectedRequest.purpose}</span>
                <span className="text-indigo-400 font-extrabold text-sm">₹{selectedRequest.estimatedCost?.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex justify-between"><span className="text-slate-500">Employee:</span><span className="text-slate-300 font-semibold">{selectedRequest.employeeName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Destination:</span><span className="text-slate-300 font-semibold">{selectedRequest.destination}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Mileage:</span><span className="text-slate-400">{selectedRequest.mileage}</span></div>
              </div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter optional comment or rejection reason..."
              className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-32 resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleReject(selectedRequest.id)}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl py-2 px-4 font-semibold text-xs transition-all cursor-pointer"
              >
                <X className="w-4 h-4 inline" /> Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2 px-4 font-semibold text-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 inline" /> Approve
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 text-xs">Select a pending travel request to approve or reject it.</p>
          </div>
        )}
      </div>
    </div>
  );
};
