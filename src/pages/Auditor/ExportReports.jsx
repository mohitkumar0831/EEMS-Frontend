import React from 'react';
import { useAppState } from '../../context/StateContext';
import { ArrowDownToLine } from 'lucide-react';

export const AuditorExportReports = () => {
  const { currentUser, auditLogs } = useAppState();

  const companyLogs = auditLogs.filter(log => log.tenantId === currentUser?.tenantId || log.tenantId === 'platform');

  const handleExport = () => {
    const headers = 'Log ID,User,Action,Details,Timestamp\n';
    const rows = companyLogs.map(l => `"${l.id}","${l.user}","${l.action}","${l.details}","${l.timestamp}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${currentUser.tenantId}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200">Export Reports</h3>
          <p className="text-slate-400 text-xs mt-1">Download audit log exports for compliance reviews or archival reporting.</p>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 text-slate-300 text-sm space-y-3">
          <p className="font-semibold text-slate-100">Export details</p>
          <p>Total audit records available: <span className="font-semibold text-slate-100">{companyLogs.length}</span></p>
          <p className="text-slate-400">The export includes only logs tied to your tenant or platform-wide entries.</p>
        </div>

        <button
          onClick={handleExport}
          className="max-w-max bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-3 px-5 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Download Audit CSV
        </button>
      </div>
    </div>
  );
};
