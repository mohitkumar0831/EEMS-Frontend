import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { ScrollText, Search, Filter, ShieldCheck, Mail } from 'lucide-react';
import { AUDIT_ENDPOINTS, TENANT_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';

const DUMMY_AUDIT_LOGS = [
  { id: 'log-001', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), action: 'tenant.registered', user: 'Mohit Kumar', tenantId: 'platform', details: 'New tenant registered: ACME Solutions (acme-solutions)' },
  { id: 'log-002', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), action: 'expense.created', user: 'Ravi Sharma', tenantId: '6a490345d1a45e7ae3a290db', details: 'Expense submitted for ₹4,500 in category Travel' },
  { id: 'log-003', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), action: 'billing.payment_success', user: 'System', tenantId: '6a490345d1a45e7ae3a290db', details: 'Payment successful for order ORD-8392, plan: Enterprise Tier' },
  { id: 'log-004', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), action: 'expense.status_updated', user: 'Ankit Gupta', tenantId: '6a4cc44563a7c033374eebd9', details: 'Expense EXP-4928 status changed to Approved' },
  { id: 'log-005', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), action: 'employee.registered', user: 'CompanyAdmin', tenantId: '6a50d7b4eaed26bf0130457d', details: 'New employee registered: alex.wong@maatrubhumi.com' },
  { id: 'log-006', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), action: 'tenant.status_updated', user: 'SuperAdmin', tenantId: '6a50d7b4eaed26bf0130457d', details: 'Tenant aditya-solutions status updated to Suspended' },
  { id: 'log-007', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), action: 'expense.created', user: 'Ravi Sharma', tenantId: '6a50d7b4eaed26bf0130457d', details: 'Expense submitted for ₹12,000 in category Hardware' }
];

export const AuditLogs = () => {
  const { currentUser } = useAppState();
  const [auditLogs, setAuditLogs] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (currentUser?.token) headers['Authorization'] = `Bearer ${currentUser.token}`;

        const [logsRes, tenantsRes] = await Promise.all([
          fetch(AUDIT_ENDPOINTS.GET_ALL, { headers }),
          fetch(TENANT_ENDPOINTS.GET_ALL, { headers })
        ]);

        const logsData = await logsRes.json();
        const tenantsData = await tenantsRes.json();

        let finalLogs = [...DUMMY_AUDIT_LOGS]; // Fallback static data

        if (logsData.success && logsData.data && logsData.data.length > 0) {
          finalLogs = [...logsData.data, ...finalLogs]; // Show real logs first, then dummy logs
        }
        setAuditLogs(finalLogs);

        if (tenantsData.success && tenantsData.data) {
          setTenants(tenantsData.data);
        }
      } catch (err) {
        console.error('Failed to fetch audit data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTenant =
      selectedTenant === 'all' ||
      log.tenantId === selectedTenant;

    return matchesSearch && matchesTenant;
  });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters row */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <ScrollText className="w-4.5 h-4.5 text-indigo-400" />
            Security & Audit Trail Log
          </h3>
          <p className="text-slate-400 text-xs mt-1">Review full transactional audit trails and operator authorization records.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search actions, details..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Tenant Selector */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="pl-9 pr-8 py-2 bg-slate-950/40 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer appearance-none"
            >
              <option value="all">All Workspaces</option>
              <option value="platform">Platform Owner</option>
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Operator</th>
                <th className="px-6 py-4">Workspace Scope</th>
                <th className="px-6 py-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredLogs.map((log) => {
                const tenantName = log.tenantId === 'platform' ? 'Platform' : (tenants.find(t => t.id === log.tenantId)?.name || 'Unknown');
                return (
                  <tr key={log.id} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase text-[9px] tracking-wide">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{log.user}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="font-semibold text-slate-400">{tenantName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500 text-xs">No matching audit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
