import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Plus } from 'lucide-react';

export const TravelRequest = () => {
  const { submitTravel } = useAppState();
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [mileage, setMileage] = useState('');

  const handleFileTravel = (e) => {
    e.preventDefault();
    if (!destination.trim() || !purpose.trim() || !estimatedCost) return;

    submitTravel(destination, purpose, estimatedCost, mileage);

    setDestination('');
    setPurpose('');
    setEstimatedCost('');
    setMileage('');
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-2xl border border-white/5 bg-slate-900 p-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-slate-200">Submit Travel Authorization</h3>
        <p className="text-xs text-slate-400">Submit estimated flight, hotel, and mileage bounds for approvals.</p>
      </div>

      <form onSubmit={handleFileTravel} className="flex flex-col gap-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-400">Travel Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. San Francisco Office Headquarters"
            className="rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-400">Total Estimated Cost (₹)</label>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="e.g. 1200"
              className="rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-400">Route Mileage (mi)</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g. 250"
              className="rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-slate-400">Travel Purpose</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Details of client meeting, seminar scope, or company offsite..."
            className="h-24 resize-none rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-xs font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Submit Travel Authorization
        </button>
      </form>
    </div>
  );
};
