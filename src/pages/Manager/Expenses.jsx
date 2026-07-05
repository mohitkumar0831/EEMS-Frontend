import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import {
  Utensils,
  Plane,
  Laptop,
  FileText,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  Clock,
  Paperclip,
  History,
  Calendar,
  Search,
  ArrowRight,
  User,
  DollarSign,
  Briefcase,
  CheckCircle2,
  FileX,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Expenses = () => {
  const { currentUser, showToast } = useAppState();
  const [managerExpenses, setManagerExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  const fetchData = async () => {
    try {
      // Fetch expenses
      const expenseResponse = await fetch(EXPENSE_ENDPOINTS.GET_MANAGER_EXPENSES(currentUser.tenantSlug, currentUser.id), {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const expenseData = await expenseResponse.json();
      
      // Fetch employees to map names
      const employeeResponse = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const employeeData = await employeeResponse.json();
      
      if (expenseData.success && employeeData.success) {
        const employeesMap = {};
        employeeData.data.forEach(emp => {
          employeesMap[emp._id] = emp;
        });
        
        const mappedExpenses = expenseData.data.map(exp => ({
          ...exp,
          employeeName: employeesMap[exp.employeeId] ? `${employeesMap[exp.employeeId].firstName} ${employeesMap[exp.employeeId].lastName}` : 'Unknown Employee',
          employeeEmail: employeesMap[exp.employeeId] ? employeesMap[exp.employeeId].email : 'N/A'
        }));
        setManagerExpenses(mappedExpenses);
        
        // Update selectedExpense if it was selected before refresh
        if (selectedExpense) {
          const updated = mappedExpenses.find(e => e._id === selectedExpense._id);
          if (updated) setSelectedExpense(updated);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id && currentUser?.tenantSlug) {
      fetchData();
    }
  }, [currentUser]);

  // Pending reviews assigned to this manager
  const pendingExpenses = managerExpenses.filter(
    e => e.status === 'Submitted' || e.status === 'Under Review'
  );

  // Past processed reviews assigned to this manager
  const processedExpenses = managerExpenses.filter(
    e => e.status !== 'Submitted' && e.status !== 'Under Review' && e.status !== 'Draft'
  );

  const handleApprove = async () => {
    if (!selectedExpense) return;
    try {
      const response = await fetch(EXPENSE_ENDPOINTS.UPDATE_EXPENSE_STATUS(currentUser.tenantSlug, selectedExpense._id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          status: 'Manager Approved',
          remarks: comment || 'Approved by manager',
          actionBy: currentUser.id
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Expense approved successfully', 'success');
        fetchData();
        setComment('');
        setSelectedExpense(null);
      } else {
        showToast(data.message || 'Failed to approve expense', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error updating expense', 'error');
    }
  };

  const handleReject = async () => {
    if (!selectedExpense) return;
    if (!comment.trim()) {
      showToast('A reason for rejection must be provided in the comments field.', 'warning');
      return;
    }
    try {
      const response = await fetch(EXPENSE_ENDPOINTS.UPDATE_EXPENSE_STATUS(currentUser.tenantSlug, selectedExpense._id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          status: 'Manager Rejected',
          remarks: comment,
          actionBy: currentUser.id
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast('Expense rejected successfully', 'success');
        fetchData();
        setComment('');
        setSelectedExpense(null);
      } else {
        showToast(data.message || 'Failed to reject expense', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error updating expense', 'error');
    }
  };

  // Helper to match category to icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Meals':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'Travel':
        return <Plane className="w-4 h-4 text-sky-400" />;
      case 'Equipment':
        return <Laptop className="w-4 h-4 text-indigo-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  // Quick comments template
  const quickComments = [
    "Approved. Matches Q3 travel scope",
    "Receipt verified and validated",
    "Missing itemized details. Please resubmit",
    "Standard allowance limit exceeded",
  ];

  // Stats Calculations
  const pendingCount = pendingExpenses.length;
  const pendingTotal = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const flaggedCount = pendingExpenses.filter(e => e.status === 'Under Review').length;
  const processedCount = processedExpenses.length;

  // Filter list by search query
  const getFilteredList = () => {
    const list = activeTab === 'pending' ? pendingExpenses : processedExpenses;
    return list.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredList = getFilteredList();

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Manager Review Board</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Verify corporate policy compliance, read employee justifications, and sign off on submitted travel and meal claims.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Claims Queue</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{pendingCount} Pending</span>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Amount</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">₹{pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <DollarSign className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Policy Flags</span>
            <span className="text-xl font-bold text-amber-400 mt-1 block">{flaggedCount} Violations</span>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
            <AlertCircle className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Approved</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{processedCount} Settled</span>
          </div>
          <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Claims list and Search */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden lg:col-span-2 flex flex-col min-h-[500px] shadow-xl">

          {/* Tabs and Search Bar Header */}
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01]">
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 w-max shrink-0">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setSelectedExpense(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${activeTab === 'pending'
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Pending Review ({pendingCount})
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  setSelectedExpense(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${activeTab === 'history'
                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Audit History ({processedCount})
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee or claim title..."
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
              />
            </div>
          </div>

          {/* List Content */}
          {filteredList.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center p-4 flex-grow">
              <FileX className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">
                {activeTab === 'pending'
                  ? 'No pending claims requiring your approval.'
                  : 'No processed claim history in your logs.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[520px] flex-grow pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {filteredList.map(exp => {
                const isSelected = selectedExpense?._id === exp._id;
                return (
                  <button
                    key={exp._id}
                    onClick={() => {
                      setSelectedExpense(exp);
                      setComment('');
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4.5 text-left hover:bg-white/[0.02] transition-all border-l-2 cursor-pointer ${isSelected ? 'border-l-indigo-500 bg-indigo-500/[0.02]' : 'border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Round Category Icon */}
                      <div className="w-9 h-9 rounded-xl bg-slate-950/50 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                        {getCategoryIcon(exp.category)}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-200">{exp.title}</span>
                        <span className="text-[10px] text-slate-500 leading-relaxed font-medium">
                          {exp.employeeName} • {exp.category} • {new Date(exp.submittedAt || exp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs font-extrabold text-slate-100">₹{exp.amount?.toFixed(2)}</span>
                        {/* Display custom badge based on status */}
                        {exp.status === 'Under Review' && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[8px] font-bold tracking-wider uppercase shrink-0">
                            FLAGGED
                          </span>
                        )}
                        {exp.status === 'Submitted' && (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-[8px] font-bold tracking-wider uppercase shrink-0">
                            PENDING
                          </span>
                        )}
                        {(exp.status === 'Manager Approved' || exp.status === 'Finance Approved' || exp.status === 'Paid') && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[8px] font-bold tracking-wider uppercase shrink-0">
                            APPROVED
                          </span>
                        )}
                        {(exp.status === 'Manager Rejected' || exp.status === 'Finance Rejected') && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[8px] font-bold tracking-wider uppercase shrink-0">
                            REJECTED
                          </span>
                        )}
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${isSelected ? 'translate-x-1 text-slate-400' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Review Details Panel */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex flex-col gap-5 shadow-xl min-h-[500px]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Decision Work Canvas
          </h3>

          {selectedExpense ? (
            <div className="flex flex-col gap-4 text-xs flex-grow">

              {/* Flag notification */}
              {selectedExpense.status === 'Under Review' && (
                <div className="bg-amber-950/40 border border-amber-500/25 p-3.5 rounded-2xl text-amber-400 flex items-start gap-2.5 leading-relaxed">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-bold block text-xs">Policy Violation Flagged</span>
                    This expense claim has exceeded the standard category spending limit defined by policy rules.
                  </div>
                </div>
              )}

              {/* Employee Summary Card */}
              <div className="flex items-center gap-3 bg-slate-950/20 border border-white/5 p-3 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md">
                  {selectedExpense.employeeName?.charAt(0) || 'E'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-200 truncate">{selectedExpense.employeeName}</span>
                  <span className="text-[9px] text-indigo-400 uppercase tracking-wider mt-0.5">{selectedExpense.employeeEmail || 'Employee'}</span>
                </div>
              </div>

              {/* Claim Details */}
              <div className="flex flex-col gap-2.5 bg-slate-950/40 border border-slate-800/80 p-4.5 rounded-2xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
                  <span className="font-bold text-slate-200 text-sm truncate max-w-[160px]">{selectedExpense.title}</span>
                  <span className="text-indigo-400 font-extrabold text-sm">₹{selectedExpense.amount?.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2 pt-2 leading-relaxed text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="text-slate-300 font-semibold">{selectedExpense.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction Date:</span><span className="text-slate-400">{new Date(selectedExpense.submittedAt || selectedExpense.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-slate-500">Employee Description:</span>
                    <p className="text-slate-400 bg-slate-950/30 p-2.5 rounded-xl border border-slate-800/40 text-[11px] leading-relaxed mt-1 italic">
                      "{selectedExpense.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Receipt File Preview Card */}
              {selectedExpense.receipt && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Attached Receipt Invoice</span>
                  <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-800 rounded-2xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                        <Paperclip className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-200 truncate text-[11px]">{selectedExpense.receiptId?.originalName || 'receipt.png'}</span>
                        <span className="text-[9px] text-slate-500 uppercase mt-0.5">Image File</span>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(selectedExpense.receiptId?.fileUrl, '_blank')}
                      className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-slate-200 cursor-pointer shadow-inner shrink-0"
                      title="Open Receipt Invoice"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Audit Timeline */}
              {selectedExpense.actionHistory && selectedExpense.actionHistory.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-600" />
                    Transaction Audit Trail
                  </span>

                  <div className="flex flex-col gap-3.5 pl-3 border-l border-slate-800 max-h-32 overflow-y-auto pr-1 mt-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {selectedExpense.actionHistory.map((log, idx) => (
                      <div key={idx} className="relative flex flex-col gap-0.5 text-[10px]">
                        {/* Timeline Node dot */}
                        <div className="absolute left-[-16.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner" />
                        <span className="text-slate-500 font-semibold">{new Date(log.actionAt).toLocaleString()}</span>
                        <span className="font-bold text-slate-200">{log.status} ({log.actionBy})</span>
                        <span className="text-slate-400 mt-0.5">{log.remarks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approver Action Panel */}
              {(selectedExpense.status === 'Submitted' || selectedExpense.status === 'Under Review') && (
                <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4.5 mt-auto">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Approver Comment for Employee
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add comments, approvals notes, or rejection feedback reasons..."
                      className="bg-slate-950/60 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 h-18 resize-none focus:ring-1 focus:ring-indigo-500/10 transition-all leading-normal"
                    />
                  </div>

                  {/* Quick Comments Selection */}
                  <div className="flex flex-wrap gap-1.5">
                    {quickComments.map((qc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setComment(qc)}
                        className="px-2.5 py-1 border border-white/5 hover:border-slate-800 rounded-lg text-[9px] font-semibold text-slate-500 hover:text-slate-300 bg-white/[0.01] hover:bg-slate-950/30 transition-all cursor-pointer"
                      >
                        {qc}
                      </button>
                    ))}
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <button
                      onClick={handleReject}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 rounded-xl py-2.5 px-4 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                    >
                      <X className="w-4 h-4" />
                      Reject Claim
                    </button>
                    <button
                      onClick={handleApprove}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl py-2.5 px-4 font-semibold text-xs shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                    >
                      <Check className="w-4 h-4" />
                      Approve Claim
                    </button>
                  </div>
                </div>
              )}

              {/* Already Processed Status Card */}
              {(selectedExpense.status !== 'Submitted' && selectedExpense.status !== 'Under Review' && selectedExpense.status !== 'Draft') && (
                <div className="border-t border-white/5 pt-4.5 mt-auto text-center">
                  <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 ${(selectedExpense.status === 'Manager Rejected' || selectedExpense.status === 'Finance Rejected')
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                    }`}>
                    {(selectedExpense.status === 'Manager Rejected' || selectedExpense.status === 'Finance Rejected') ? (
                      <>
                        <X className="w-6 h-6 p-1 rounded-full bg-rose-500/10" />
                        <span className="font-bold text-xs">Expense Rejected ({selectedExpense.status})</span>
                        <span className="text-[10px] text-slate-400">This claim has already been marked as rejected.</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-6 h-6 p-1 rounded-full bg-emerald-500/10" />
                        <span className="font-bold text-xs">Expense Approved ({selectedExpense.status})</span>
                        <span className="text-[10px] text-slate-400">This claim has been processed.</span>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-28 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-6 flex-grow">
              <MessageSquare className="w-10 h-10 text-slate-700 mb-3" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select a Claim</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed max-w-[200px] mt-1.5">
                Select an expense claim from the list to review receipt attachments, verify compliance audits, and approve or reject with comments.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
