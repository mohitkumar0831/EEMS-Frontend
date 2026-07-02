import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { Activity, Server, Database, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export const SystemMonitoring = () => {
  const { showToast } = useAppState();
  const [services, setServices] = useState([
    { name: 'API Edge Gateway', status: 'Healthy', latency: '12ms', uptime: '99.99%', load: 14 },
    { name: 'Authorization Service', status: 'Healthy', latency: '4ms', uptime: '100.00%', load: 8 },
    { name: 'Multi-Tenant Database Router', status: 'Healthy', latency: '18ms', uptime: '99.98%', load: 22 },
    { name: 'Redis Cache Layer', status: 'Healthy', hitRate: '98.4%', uptime: '99.99%', load: 5 },
    { name: 'Asynchronous Document Workers', status: 'Healthy', queue: '0 pending', uptime: '99.97%', load: 11 }
  ]);

  const handleRefresh = () => {
    showToast('Re-polling system telemetry status...', 'info');
    setTimeout(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        latency: s.latency ? `${Math.floor(Math.random() * 10) + 5}ms` : undefined,
        load: Math.floor(Math.random() * 20) + 5
      })));
      showToast('All core services online & running within parameters.', 'success');
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Overview telemetry control header */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-400" />
            Infrastructure Status & Services Registry
          </h3>
          <p className="text-slate-400 text-xs mt-1">Telemetry overview of backing services, request processing queues, and API routes.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
        >
          <Cpu className="h-3.5 w-3.5" />
          Poll System Telemetry
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, idx) => (
          <div key={idx} className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{service.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">Uptime: {service.uptime}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {service.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-2 bg-slate-950/20 p-3 rounded-xl border border-white/[0.01]">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Metrics</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 font-mono">
                    {service.latency ? `Latency: ${service.latency}` : service.hitRate ? `Hit-Rate: ${service.hitRate}` : service.queue}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Load Overhead</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-200 font-mono">{service.load}%</span>
                    <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${service.load}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Latency Visualizer */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">API Gateway Throughput (Last 60 Minutes)</h4>
        <div className="h-32 flex items-end gap-2 border-b border-slate-800 pb-2 pt-6 px-4">
          {[20, 25, 30, 45, 40, 35, 55, 60, 50, 45, 65, 80, 75, 70, 85, 90, 80, 75, 65, 60].map((val, idx) => (
            <div key={idx} className="flex-grow flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
              <div 
                style={{ height: `${val}%` }}
                className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 border border-indigo-500/30 rounded-t transition-all duration-300 relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-950 border border-white/10 rounded text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono whitespace-nowrap">
                  {val * 10} req/s
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
