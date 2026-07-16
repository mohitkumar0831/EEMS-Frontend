import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';
import {
  Search,
  Utensils,
  Plane,
  Laptop,
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  History,
  Paperclip,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  User,
  Check,
  X,
  Flag,
  Eye
} from 'lucide-react';

// Lifecycle step component
const LifecycleStep = ({ icon: Icon, label, sublabel, done, active, flagged }) => {
  const dotColor = flagged
    ? 'bg-rose-500 border-rose-500'
    : done
      ? 'bg-emerald-500 border-emerald-500'
      : active
        ? 'bg-indigo-500 border-indigo-500 animate-pulse'
        : 'bg-slate-800 border-slate-700';
  const textColor = flagged
    ? 'text-rose-400'
    : done
      ? 'text-emerald-400'
      : active
        ? 'text-indigo-300'
        : 'text-slate-600';

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${dotColor}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`text-[11px] font-bold ${textColor}`}>{label}</span>
        <span className="text-[9px] text-slate-600 leading-tight">{sublabel}</span>
      </div>
    </div>
  );
};

export const AuditorExpenses = () => {
  const { currentUser, showToast, policies } = useAppState();
  const [companyExpenses, setCompanyExpenses] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [auditRemark, setAuditRemark] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'cleared' | 'flagged'

  const fetchData = async () => {
    if (!currentUser?.tenantSlug) return;
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${currentUser.token}` };
      const [expRes, empRes] = await Promise.all([
        fetch(EXPENSE_ENDPOINTS.GET_ALL_EXPENSES(currentUser.tenantSlug), { headers }),
        fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), { headers })
      ]);

      if (!expRes.ok || !empRes.ok) throw new Error('Failed to fetch data');

      const expData = await expRes.json();
      const empData = await empRes.json();

      const empMap = {};
      if (empData.success) {
        empData.data.forEach(e => {
          empMap[e._id] = e;
        });
      }
      setEmployees(empMap);

      if (expData.success) {
        const mapped = expData.data.map(exp => {
          const emp = empMap[exp.employeeId] || {};
          return {
            ...exp,
            id: exp._id,
            date: new Date(exp.createdAt).toLocaleDateString(),
            employeeName: emp.firstName ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee',
            employeeEmail: emp.email || 'N/A',
            employeeDesignation: emp.designation || 'N/A',
            employeeDepartment: emp.department || 'N/A',
            employeeBank: emp.bankAccountNumber || 'N/A',
            employeeIfsc: emp.ifscCode || 'N/A',
            employeePan: emp.panNumber || 'N/A',
            receiptUrl: exp.receiptId?.filePath || null
          };
        });
        setCompanyExpenses(mapped);
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to load auditor data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.tenantSlug, currentUser?.token]);

  // Buckets for tabs
  const auditPending = companyExpenses.filter(e => e.status === 'Paid');
  const auditCleared = companyExpenses.filter(e => e.status === 'Audited');
  const auditFlagged = companyExpenses.filter(e => e.status === 'Audit Failed' || e.status === 'Flagged');

  const statusCounts = {
    all: companyExpenses.length,
    pending: auditPending.length,
    cleared: auditCleared.length,
    flagged: auditFlagged.length
  };

  const getActiveList = () => {
    let base;
    if (activeTab === 'pending') base = auditPending;
    else if (activeTab === 'cleared') base = auditCleared;
    else base = auditFlagged;

    return base.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const updateStatus = async (expenseId, status, remark) => {
    try {
      const res = await fetch(EXPENSE_ENDPOINTS.UPDATE_EXPENSE_STATUS(currentUser.tenantSlug, expenseId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          status: status,
          actionBy: currentUser.id,
          remarks: remark
        })
      });

      if (!res.ok) throw new Error('Failed to update status');
      showToast('Status updated successfully', 'success');
      fetchData(); // refresh list
    } catch (err) {
      console.error(err);
      showToast('Error updating status', 'error');
    }
  };

  const handleAudit = () => {
    if (!selectedExpense) return;
    updateStatus(selectedExpense.id, 'Audited', auditRemark);
    setSelectedExpense(null);
    setAuditRemark('');
  };

  const handleFlag = () => {
    if (!selectedExpense) return;
    updateStatus(selectedExpense.id, 'Audit Failed', auditRemark);
    setSelectedExpense(null);
    setAuditRemark('');
  };

  const getCategoryIcon = (cat) => {
    if (cat === 'Meals') return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
    if (cat === 'Travel') return <Plane className="w-3.5 h-3.5 text-sky-400" />;
    if (cat === 'Equipment') return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  const statusBadge = (status) => {
    const map = {
      Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      Audited: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
      Flagged: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      Approved: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Under Review': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      Rejected: 'bg-slate-700/50 text-slate-400 border-slate-700',
    };
    return map[status] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  // Derive approval lifecycle stages from expense state
  const getLifecycle = (exp) => {
    const statuses = ['Pending', 'Approved', 'Paid', 'Audited', 'Flagged', 'Rejected', 'Under Review'];
    const idx = statuses.indexOf(exp.status);
    const isDone = (threshold) => ['Paid', 'Audited', 'Flagged'].includes(exp.status) || exp.status === threshold;
    return {
      submitted: true,
      managerApproved: ['Approved', 'Paid', 'Audited', 'Flagged'].includes(exp.status),
      financePaid: ['Paid', 'Audited', 'Flagged'].includes(exp.status),
      audited: exp.status === 'Audited',
      flagged: exp.status === 'Flagged',
    };
  };

  // Stats
  const totalPaidValue = auditPending.reduce((s, e) => s + e.amount, 0);
  const totalAuditedValue = auditCleared.reduce((s, e) => s + e.amount, 0);
  const totalFlaggedValue = auditFlagged.reduce((s, e) => s + e.amount, 0);

  const filteredList = getActiveList();

  if (!currentUser) return null;

  if (loading) return <PageSkeleton />;

  return (
    <div className="flex flex-col gap-6">

      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-400" />
          Audit & Compliance Review
        </h3>
        <p className="text-slate-400 text-xs">
          Audit disbursed expense reimbursements, verify chain of custody, and clear or flag for compliance investigation.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Awaiting Audit</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{auditPending.length}</span>
            <span className="text-[10px] text-amber-400">₹{totalPaidValue.toFixed(2)} to review</span>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400"><Clock className="w-5 h-5" /></div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Audit Cleared</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{auditCleared.length}</span>
            <span className="text-[10px] text-violet-400">₹{totalAuditedValue.toFixed(2)} verified</span>
          </div>
          <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400"><ShieldCheck className="w-5 h-5" /></div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Flagged</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{auditFlagged.length}</span>
            <span className="text-[10px] text-rose-400">₹{totalFlaggedValue.toFixed(2)} under investigation</span>
          </div>
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400"><ShieldAlert className="w-5 h-5" /></div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Ledger</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{companyExpenses.length}</span>
            <span className="text-[10px] text-slate-400">all company expenses</span>
          </div>
          <div className="p-2 bg-slate-800 rounded-xl text-slate-400"><FileSpreadsheet className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Ledger List */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden lg:col-span-2 flex flex-col min-h-[520px] shadow-xl">

          {/* Controls */}
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/[0.01]">
            {/* Tabs */}
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 w-max">
              {[
                { key: 'pending', label: `Awaiting Audit`, count: auditPending.length },
                { key: 'cleared', label: `Cleared`, count: auditCleared.length },
                { key: 'flagged', label: `Flagged`, count: auditFlagged.length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSelectedExpense(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${activeTab === tab.key
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-56 ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search expense or employee..."
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
              />
            </div>
          </div>

          {/* List */}
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow py-20 gap-2 text-center">
              <FileSpreadsheet className="w-10 h-10 text-slate-700" />
              <p className="text-slate-500 text-sm">
                {activeTab === 'pending'
                  ? 'No disbursed expenses awaiting audit.'
                  : activeTab === 'cleared'
                    ? 'No expenses have been audited & cleared yet.'
                    : 'No expenses have been flagged for investigation.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[520px] flex-grow">
              {filteredList.map(exp => {
                const isSelected = selectedExpense?.id === exp.id;

                // Policy check for list items
                const activePolicy = (policies || []).find(p => {
                  const isMatchTenant = p.tenantId === currentUser?.tenantId ||
                    (p.tenantId === 'tenant-1' && (currentUser?.tenantId === 'tenant-1' || currentUser?.tenantSlug?.toLowerCase().includes('acme'))) ||
                    (p.tenantId === 'tenant-2' && (currentUser?.tenantId === 'tenant-2' || currentUser?.tenantSlug?.toLowerCase().includes('stark')));
                  return isMatchTenant && p.category.toLowerCase() === exp.category.toLowerCase();
                });
                const itemDays = exp.daysSpanned || 1;
                const itemDailyAmount = itemDays > 0 ? exp.amount / itemDays : exp.amount;
                const exceeds = activePolicy && itemDailyAmount > activePolicy.limit;

                return (
                  <button
                    key={exp.id}
                    onClick={() => { setSelectedExpense(exp); setAuditRemark(''); }}
                    className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-all border-l-2 cursor-pointer ${isSelected
                        ? 'border-l-violet-500 bg-violet-500/[0.02]'
                        : 'border-l-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-center shrink-0">
                        {getCategoryIcon(exp.category)}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                          {exp.title}
                          {exceeds && (
                            <span className="text-[8px] font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1 py-0.2 rounded shrink-0 flex items-center gap-0.5">
                              <ShieldAlert className="w-2 h-2" /> VIOLATION
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {exp.employeeName} · {exp.category} · {exp.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {exceeds && (
                        <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0 animate-pulse" title="Policy Violation Alert">
                          <ShieldAlert className="w-3 h-3" />
                        </div>
                      )}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-extrabold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${statusBadge(exp.status)}`}>
                          {exp.status}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'rotate-90 text-slate-400' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Audit Panel */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex flex-col gap-5 shadow-xl min-h-[520px]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <Eye className="w-4 h-4 text-violet-400" />
            Audit Review Panel
          </h3>

          {selectedExpense ? (
            <div className="flex flex-col gap-4 text-xs flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">

              {/* Claimant */}
              <div className="flex flex-col gap-3 bg-slate-950/20 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white uppercase shadow-md shrink-0">
                    {selectedExpense.employeeName?.charAt(0) || 'E'}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-bold text-slate-200 truncate">{selectedExpense.employeeName}</span>
                    <span className="text-[10px] text-violet-400 uppercase tracking-wider mt-0.5">{selectedExpense.employeeEmail}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Role / Dept</span>
                    <span className="text-[11px] text-slate-300 truncate">{selectedExpense.employeeDesignation}</span>
                    <span className="text-[10px] text-slate-400 truncate">{selectedExpense.employeeDepartment}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold mb-0.5">Bank Details</span>
                    <span className="text-[11px] text-slate-300 truncate font-mono">{selectedExpense.employeeBank}</span>
                    <span className="text-[10px] text-slate-400 truncate uppercase">IFSC: {selectedExpense.employeeIfsc}</span>
                    <span className="text-[10px] text-slate-400 truncate uppercase mt-0.5">PAN: {selectedExpense.employeePan}</span>
                  </div>
                </div>
              </div>

              {/* Claim Details */}
              <div className="flex flex-col gap-2 bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="font-bold text-slate-200 truncate max-w-[160px]">{selectedExpense.title}</span>
                  <span className="text-violet-400 font-extrabold">₹{selectedExpense.amount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1.5 text-[11px] pt-1">
                  <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="text-slate-200 font-semibold">{selectedExpense.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Days Spanned:</span><span className="text-slate-200 font-semibold">{selectedExpense.daysSpanned || 1} day(s)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Filing Date:</span><span className="text-slate-400">{selectedExpense.date}</span></div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${statusBadge(selectedExpense.status)}`}>{selectedExpense.status}</span>
                  </div>
                  {selectedExpense.description && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-slate-500">Business Purpose:</span>
                      <p className="text-slate-400 bg-slate-950/30 p-2 rounded-xl border border-slate-850 text-[10px] leading-relaxed italic">
                        "{selectedExpense.description}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt */}
              {selectedExpense.receiptId && (
                <div className="flex items-center justify-between p-3 bg-slate-950/20 border border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="font-semibold text-slate-200 truncate text-[11px]">{selectedExpense.receiptId.originalName || 'receipt.png'}</span>
                  </div>
                  <button
                    onClick={() => window.open(selectedExpense.receiptId.filePath, '_blank')}
                    className="p-1.5 rounded-xl bg-slate-900 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
                    {(() => {
                const activePolicy = (policies || []).find(p => {
                  const isMatchTenant = p.tenantId === currentUser?.tenantId ||
                    (p.tenantId === 'tenant-1' && (currentUser?.tenantId === 'tenant-1' || currentUser?.tenantSlug?.toLowerCase().includes('acme'))) ||
                    (p.tenantId === 'tenant-2' && (currentUser?.tenantId === 'tenant-2' || currentUser?.tenantSlug?.toLowerCase().includes('stark')));
                  return isMatchTenant && p.category.toLowerCase() === selectedExpense.category.toLowerCase();
                });
                const numDays = selectedExpense.daysSpanned || 1;
                const dailyAmount = numDays > 0 ? selectedExpense.amount / numDays : selectedExpense.amount;
                const exceeds = activePolicy && dailyAmount > activePolicy.limit;

                if (exceeds) {
                  return (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex flex-col gap-1.5 border-l-4 border-l-rose-500">
                      <div className="flex items-center gap-2 text-rose-400 font-bold">
                        <ShieldAlert className="w-4.5 h-4.5 animate-pulse" />
                        <span>Compliance Alert: Policy Violation</span>
                      </div>
                      <p className="text-[11px] text-slate-355 leading-relaxed">
                        This claim of <strong className="text-rose-400 font-mono">₹{selectedExpense.amount.toFixed(2)}</strong> ({numDays} days) has an average daily rate of <strong className="text-rose-400 font-mono">₹{dailyAmount.toFixed(2)}/day</strong>, which exceeds the maximum limit of <strong className="text-slate-100 font-mono">₹{activePolicy.limit.toFixed(2)}/day</strong> set for the category <strong className="text-indigo-400">{selectedExpense.category}</strong>.
                      </p>
                      {activePolicy.rule && (
                        <div className="text-[9px] text-slate-550 font-medium">
                          <strong>Rule:</strong> {activePolicy.rule}
                        </div>
                      )}
                    </div>
                  );
                } else if (activePolicy) {
                  return (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col gap-1.5 border-l-4 border-l-emerald-500">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <ShieldCheck className="w-4.5 h-4.5" />
                        <span>Compliance Check: Passed</span>
                      </div>
                      <p className="text-[11px] text-slate-355 leading-relaxed">
                        The claim of <strong className="text-emerald-400 font-mono">₹{selectedExpense.amount.toFixed(2)}</strong> ({numDays} days) has an average daily rate of <strong className="text-emerald-400 font-mono">₹{dailyAmount.toFixed(2)}/day</strong>, which is within the company policy limit of <strong className="text-slate-100 font-mono">₹{activePolicy.limit.toFixed(2)}/day</strong>.
                      </p>
                    </div>
                  );
                }
              })()}

              {/* Payout Disbursal Receipt */}
              {selectedExpense.payoutReceiptUrl && (
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mt-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-200 truncate text-[11px]">payout_receipt.pdf</span>
                  </div>
                  <button
                    onClick={() => window.open(selectedExpense.payoutReceiptUrl, '_blank')}
                    className="p-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-emerald-500 hover:text-emerald-400 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Approval Lifecycle */}
              {(() => {
                const lc = getLifecycle(selectedExpense);
                return (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lifecycle Journey</span>
                    <div className="flex flex-col gap-3 pl-4 border-l border-slate-800 py-1">
                      <LifecycleStep icon={User} label="Employee Filed" sublabel={selectedExpense.date} done />
                      <LifecycleStep icon={Check} label="Manager Approved" sublabel="L1 sign-off complete" done={lc.managerApproved} active={!lc.managerApproved} />
                      <LifecycleStep icon={DollarSign} label="Finance Disbursed" sublabel="Funds transferred" done={lc.financePaid} active={lc.managerApproved && !lc.financePaid} />
                      <LifecycleStep icon={Shield} label="Auditor Review" sublabel="Compliance check" done={lc.audited} active={lc.financePaid && !lc.audited && !lc.flagged} flagged={lc.flagged} />
                      {lc.flagged
                        ? <LifecycleStep icon={Flag} label="Flagged" sublabel="Sent to compliance" flagged />
                        : <LifecycleStep icon={ShieldCheck} label="Audit Complete" sublabel="Claim fully cleared" done={lc.audited} />
                      }
                    </div>
                  </div>
                );
              })()}

              {/* Chain of Custody */}
              {selectedExpense.auditTrail?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-600" />
                    Chain of Custody
                  </span>
                  <div className="flex flex-col gap-3 pl-3 border-l border-slate-800 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {selectedExpense.auditTrail.map((log, idx) => (
                      <div key={idx} className="relative flex flex-col gap-0.5 text-[10px]">
                        <div className="absolute left-[-14.5px] top-1.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
                        <span className="font-bold text-slate-300">{log.action}</span>
                        <span className="text-slate-500 leading-normal">{log.details}</span>
                        <span className="text-[9px] text-slate-700">By {log.user} · {new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auditor Actions — only for Paid (awaiting audit) */}
              {selectedExpense.status === 'Paid' && (
                <div className="flex flex-col gap-3 border-t border-white/5 pt-4 mt-auto">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-500 font-bold uppercase">Auditor Remark</label>
                    <textarea
                      value={auditRemark}
                      onChange={e => setAuditRemark(e.target.value)}
                      placeholder="Add your audit note or compliance remark..."
                      rows={3}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-200 resize-none focus:outline-none focus:border-violet-500 placeholder-slate-600 transition-all leading-relaxed"
                    />
                  </div>
                  {(() => {
                    const activePolicy = (policies || []).find(p => {
                      const isMatchTenant = p.tenantId === currentUser?.tenantId ||
                        (p.tenantId === 'tenant-1' && (currentUser?.tenantId === 'tenant-1' || currentUser?.tenantSlug?.toLowerCase().includes('acme'))) ||
                        (p.tenantId === 'tenant-2' && (currentUser?.tenantId === 'tenant-2' || currentUser?.tenantSlug?.toLowerCase().includes('stark')));
                      return isMatchTenant && p.category.toLowerCase() === selectedExpense.category.toLowerCase();
                    });
                    const exceeds = activePolicy && selectedExpense.amount > activePolicy.limit;

                    return (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleFlag}
                          className={`flex items-center justify-center gap-1.5 font-bold text-xs py-2.5 px-3 rounded-xl cursor-pointer transition-all active:scale-95 uppercase tracking-wider ${exceeds
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 animate-pulse border border-transparent'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400'
                            }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          Flag
                        </button>
                        <button
                          onClick={handleAudit}
                          className={`flex items-center justify-center gap-1.5 font-bold text-xs py-2.5 px-3 rounded-xl cursor-pointer transition-all active:scale-95 uppercase tracking-wider ${exceeds
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-750'
                              : 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/10'
                            }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Clear
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Already Audited badge */}
              {selectedExpense.status === 'Audited' && (
                <div className="border-t border-white/5 pt-4 mt-auto">
                  <div className="bg-violet-500/5 border border-violet-500/20 p-4 rounded-2xl flex flex-col items-center gap-1.5 text-center">
                    <ShieldCheck className="w-6 h-6 text-violet-400" />
                    <span className="font-bold text-xs text-violet-300">Audit Complete</span>
                    <span className="text-[10px] text-slate-500">Expense cleared by compliance audit.</span>
                  </div>
                </div>
              )}

              {/* Flagged badge */}
              {selectedExpense.status === 'Flagged' && (
                <div className="border-t border-white/5 pt-4 mt-auto">
                  <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl flex flex-col items-center gap-1.5 text-center">
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                    <span className="font-bold text-xs text-rose-300">Under Investigation</span>
                    <span className="text-[10px] text-slate-500">Flagged for compliance review.</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-center p-6 border border-dashed border-slate-800 rounded-3xl gap-2">
              <Shield className="w-10 h-10 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Expense to Audit</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed max-w-[200px]">
                Select a disbursed expense from the queue to verify its chain of custody, review documents, and issue an audit verdict.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
