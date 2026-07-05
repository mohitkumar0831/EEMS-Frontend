import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import {
  CreditCard,
  Search,
  Clock,
  DollarSign,
  CheckCircle2,
  Utensils,
  Plane,
  Laptop,
  FileText,
  ExternalLink,
  History,
  Paperclip,
  Check,
  Send,
  Building,
  User,
  ArrowRight,
  FileSpreadsheet,
  X,
  Printer,
  Download
} from 'lucide-react';

export const FinanceProcess = () => {
  const { currentUser, showToast } = useAppState();
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [payoutMethod, setPayoutMethod] = useState('ACH');
  const [referenceNumber, setReferenceNumber] = useState(() => 'REF-' + Math.floor(100000 + Math.random() * 900000));

  // Slip Modal states
  // const [showSlipModal, setShowSlipModal] = useState(false);
  // const [slipData, setSlipData] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch expenses
      const expRes = await fetch(EXPENSE_ENDPOINTS.GET_ALL_EXPENSES(currentUser.tenantSlug), {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const expData = await expRes.json();

      // Fetch employees to map names
      const empRes = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const empData = await empRes.json();

      if (expData.success && empData.success) {
        const empMap = {};
        empData.data.forEach(e => {
          empMap[e._id] = e;
        });

        const mapped = expData.data.map(exp => ({
          ...exp,
          employeeName: empMap[exp.employeeId] ? `${empMap[exp.employeeId].firstName} ${empMap[exp.employeeId].lastName}` : 'Unknown Employee',
          employeeEmail: empMap[exp.employeeId] ? empMap[exp.employeeId].email : 'N/A'
        }));

        setAllExpenses(mapped);

        if (selectedExpense) {
          const updated = mapped.find(e => e._id === selectedExpense._id);
          if (updated) setSelectedExpense(updated);
        }
      }
    } catch (error) {
      console.error(error);
      showToast('Error loading settlement board data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.tenantSlug) {
      fetchData();
    }
    
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [currentUser?.id, currentUser?.tenantSlug]);

  // Slip Modal states
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipData, setSlipData] = useState(null);

  // Pending queue: claims approved by manager/finance but not paid yet
  const pendingPayouts = allExpenses.filter(e => e.status === 'Manager Approved' || e.status === 'Finance Approved');

  // Processed history: claims that have been paid
  const paidPayouts = allExpenses.filter(e => e.status === 'Paid');

  const handleProcessPayment = async () => {
    if (!selectedExpense) return;

    try {
      const payoutRouteName = payoutMethod === 'ACH' 
        ? 'ACH Direct Deposit' 
        : payoutMethod === 'Wire' 
          ? 'Wire Transfer' 
          : payoutMethod === 'CorpCard' 
            ? 'Corporate Credit Card' 
            : 'Check Clearance';

      // 1. Create Razorpay Order
      const orderRes = await fetch(EXPENSE_ENDPOINTS.CREATE_RAZORPAY_ORDER(currentUser.tenantSlug, selectedExpense._id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ actionBy: currentUser.id })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        showToast(orderData.message || 'Failed to create Razorpay order', 'error');
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XP9S2e2InXN3pJ', // using provided test key fallback
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "EEMS Payout Settlement",
        description: `Expense Claim Disbursal - ${selectedExpense.title}`,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch(EXPENSE_ENDPOINTS.VERIFY_RAZORPAY_PAYMENT(currentUser.tenantSlug, selectedExpense._id), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
              },
              body: JSON.stringify({
                actionBy: currentUser.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payoutRoute: payoutRouteName,
                paymentReference: referenceNumber || response.razorpay_payment_id
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              showToast('Payment verified and disbursed successfully!', 'success');
              
              setSlipData({
                id: selectedExpense._id,
                title: selectedExpense.title,
                amount: selectedExpense.amount,
                category: selectedExpense.category,
                employeeName: selectedExpense.employeeName,
                employeeEmail: selectedExpense.employeeEmail,
                date: new Date(selectedExpense.submittedAt || selectedExpense.createdAt).toLocaleDateString(),
                payoutMethod: payoutRouteName,
                referenceNumber: response.razorpay_payment_id,
                managerName: 'System/Finance Approver',
                timestamp: new Date().toLocaleString()
              });

              fetchData();
              setSelectedExpense(null);
              setShowSlipModal(true);
              setReferenceNumber('REF-' + Math.floor(100000 + Math.random() * 900000));
            } else {
              showToast(verifyData.message || 'Verification failed', 'error');
            }
          } catch (err) {
            console.error(err);
            showToast('Error verifying payment', 'error');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
        theme: {
          color: "#4f46e5" // Indigo 600 to match theme
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        showToast(`Payment Failed: ${response.error.description}`, 'error');
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      showToast('Error initiating payment process', 'error');
    }
  };

  const handleViewSlip = (exp) => {
    // Generate slip data for previously paid items in the history
    setSlipData({
      id: exp._id,
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      employeeName: exp.employeeName,
      employeeEmail: exp.employeeEmail,
      date: new Date(exp.submittedAt || exp.createdAt).toLocaleDateString(),
      payoutMethod: exp.payoutRoute || 'ACH Direct Deposit',
      referenceNumber: exp.paymentReference || 'REF-' + Math.floor(100000 + Math.random() * 900000),
      managerName: exp.actionHistory && exp.actionHistory.length > 0
        ? 'System/Approver'
        : 'Unknown',
      timestamp: exp.actionHistory?.find(l => l.status === 'Paid')?.actionAt
        ? new Date(exp.actionHistory.find(l => l.status === 'Paid').actionAt).toLocaleString()
        : new Date(exp.updatedAt).toLocaleString()
    });
    setShowSlipModal(true);
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

  // Stats Calculations
  const pendingCount = pendingPayouts.length;
  const pendingTotal = pendingPayouts.reduce((sum, e) => sum + e.amount, 0);
  const paidCount = paidPayouts.length;
  const paidTotal = paidPayouts.reduce((sum, e) => sum + e.amount, 0);

  const getFilteredList = () => {
    const list = activeTab === 'pending' ? pendingPayouts : paidPayouts;
    return list.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredList = getFilteredList();

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Finance Settlement board</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Verify manager approvals, review attached invoices, and disburse corporate expense payouts via corporate gateways.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Approved Queue</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{pendingCount} Pending</span>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Payout</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">₹{pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <DollarSign className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Disbursed</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">₹{paidTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Payouts Settled</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">{paidCount} Paid</span>
          </div>
          <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
            <FileSpreadsheet className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3 width): Claims List */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden lg:col-span-2 flex flex-col min-h-[500px] shadow-xl">

          {/* Header Controls */}
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
                Awaiting Disbursement ({pendingCount})
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
                Disbursed History ({paidCount})
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claimant or title..."
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
              />
            </div>
          </div>

          {/* List Content */}
          {filteredList.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center p-4 flex-grow">
              <FileSpreadsheet className="w-10 h-10 text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">
                {activeTab === 'pending'
                  ? 'No approved expense claims ready for disbursement.'
                  : 'No payment transaction logs available.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[520px] flex-grow pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {filteredList.map(exp => {
                const isSelected = selectedExpense?._id === exp._id;
                return (
                  <div
                    key={exp._id}
                    onClick={() => {
                      setSelectedExpense(exp);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4.5 text-left hover:bg-white/[0.02] transition-all border-l-2 cursor-pointer ${isSelected ? 'border-l-indigo-500 bg-indigo-500/[0.02]' : 'border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isSelected ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-slate-900 border border-white/5'
                        }`}>
                        {getCategoryIcon(exp.category)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-200 truncate">{exp.title}</span>
                        <span className="text-[10px] text-slate-500 leading-relaxed font-medium truncate">
                          {exp.employeeName} • {exp.category} • {new Date(exp.submittedAt || exp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs font-extrabold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase shrink-0 ${exp.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-455 border border-emerald-500/25'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                          }`}>
                          {exp.status === 'Paid' ? 'PAID / SETTLED' : 'APPROVED BY L1'}
                        </span>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-slate-655 transition-transform ${isSelected ? 'translate-x-1 text-slate-400' : ''}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Payout Panel */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex flex-col gap-5 shadow-xl min-h-[500px]">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
            <Building className="w-4 h-4 text-indigo-400" />
            Payout Disbursement Gate
          </h3>

          {selectedExpense ? (
            <div className="flex flex-col gap-4 text-xs flex-grow">

              {/* Claimant Header */}
              <div className="flex items-center gap-3 bg-slate-950/20 border border-white/5 p-3 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md">
                  {selectedExpense.employeeName?.charAt(0) || 'E'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-200 truncate">{selectedExpense.employeeName}</span>
                  <span className="text-[9px] text-indigo-400 uppercase tracking-wider mt-0.5">{selectedExpense.employeeEmail || 'Employee'}</span>
                </div>
              </div>

              {/* Claim Summary Details */}
              <div className="flex flex-col gap-2.5 bg-slate-950/40 border border-slate-800/80 p-4.5 rounded-2xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
                  <span className="font-bold text-slate-200 text-sm truncate max-w-[160px]">{selectedExpense.title}</span>
                  <span className="text-indigo-400 font-extrabold text-sm">₹{selectedExpense.amount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2 pt-2 text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">Amount:</span><span className="text-emerald-400 font-bold text-sm">₹{selectedExpense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="text-slate-300 font-semibold">{selectedExpense.category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Transaction Date:</span><span className="text-slate-400">{new Date(selectedExpense.submittedAt || selectedExpense.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-slate-500">Business Purpose:</span>
                    <p className="text-slate-400 bg-slate-950/30 p-2.5 rounded-xl border border-slate-850 text-[11px] leading-relaxed italic mt-1">
                      "{selectedExpense.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Manager L1 Signature Comment Box */}
              {selectedExpense.comments && selectedExpense.comments.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Manager Approval Verification</span>
                  <div className="p-3.5 bg-slate-950/20 border border-slate-850 rounded-2xl flex flex-col gap-1 text-[11px]">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5 text-indigo-400">
                      <Check className="w-3.5 h-3.5 p-0.5 rounded-full bg-indigo-500/10" />
                      Approved by {selectedExpense.comments[selectedExpense.comments.length - 1].author}
                    </span>
                    <p className="text-slate-400 italic mt-1 leading-relaxed">
                      "{selectedExpense.comments[selectedExpense.comments.length - 1].text}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 rounded-2xl flex items-center gap-2">
                  <Check className="w-4 h-4 p-0.5 rounded-full bg-indigo-500/10 shrink-0" />
                  <span className="text-[10px]">Manager L1 Signature verified and validated.</span>
                </div>
              )}

              {/* Invoice Attachment */}
              {selectedExpense.receipt && (
                <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-850 rounded-2xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Paperclip className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-200 truncate text-[11px]">{selectedExpense.receiptId?.originalName || 'receipt.png'}</span>
                      <span className="text-[9px] text-slate-500 uppercase mt-0.5">Invoice File</span>
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

              {/* Payout Processing Form */}
              {(selectedExpense.status === 'Manager Approved' || selectedExpense.status === 'Finance Approved') && (
                <div className="flex flex-col gap-3.5 border-t border-white/5 pt-4.5 mt-auto">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-500 font-bold uppercase">Payout Route</label>
                      <select
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        className="bg-slate-950/60 border border-slate-850 rounded-xl py-2 px-3 text-[11px] text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
                      >
                        <option value="ACH">ACH Direct Deposit</option>
                        <option value="Wire">Wire Transfer</option>
                        <option value="CorpCard">Corporate Card Credit</option>
                        <option value="Check">Check Clearance</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-500 font-bold uppercase">Reference No.</label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="bg-slate-950/60 border border-slate-850 rounded-xl py-2 px-3 text-[11px] text-slate-150 font-mono font-bold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-650 hover:from-emerald-600 hover:to-teal-750 text-white rounded-xl py-3 px-4 font-bold text-xs shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <CreditCard className="w-4 h-4" />
                    Process Payout & Disburse
                  </button>
                </div>
              )}

              {/* Already Settled State with Slip Generator Link */}
              {selectedExpense.status === 'Paid' && (
                <div className="border-t border-white/5 pt-4.5 mt-auto">
                  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-emerald-400">Payout Successfully Disbursed</span>
                      <span className="text-[10px] text-slate-400">Via {selectedExpense.payoutRoute} (Ref: {selectedExpense.paymentReference})</span>
                    </div>

                    <button
                      onClick={() => handleViewSlip(selectedExpense)}
                      className="mt-2 w-full py-2 bg-slate-900 border border-white/5 hover:border-emerald-500/30 text-xs font-bold text-slate-300 hover:text-emerald-400 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      View Remittance Slip
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-28 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-6 flex-grow">
              <CreditCard className="w-10 h-10 text-slate-700 mb-3" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payout Queue</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed max-w-[200px] mt-1.5">
                Select an approved claim from the pending list to review claimant metadata, manager signatures, select payout channels, and disburse bank transfers.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Slip Modal Popup */}
      {showSlipModal && slipData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full relative shadow-2xl overflow-hidden flex flex-col gap-4 animate-scale-up">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expense Payout Slip</h4>
              <button
                onClick={() => setShowSlipModal(false)}
                className="p-1 rounded-lg bg-slate-950/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Card Container (Stylized Paper Invoice) */}
            <div className="bg-white text-slate-800 p-5 rounded-2xl flex flex-col gap-4 font-mono shadow-inner border border-slate-200 relative overflow-hidden select-text text-left">

              {/* PAID Stamp (Diagonal Green Stamp) */}
              <div className="absolute right-3 top-18 border-4 border-emerald-500/80 text-emerald-600/90 font-extrabold text-[12px] uppercase px-2 py-0.5 rounded rotate-[-12deg] tracking-widest bg-white/95 opacity-90 select-none shadow">
                PAID & CLEARED
              </div>

              {/* Company Logo and Title */}
              <div className="flex flex-col items-center border-b border-slate-200 pb-3 text-center">
                <span className="font-extrabold text-sm tracking-wider text-slate-900">EXPENSEFLOW INC.</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">DISBURSEMENT TRANSACTION RECEIPT</span>
              </div>

              {/* Receipt Key-Values */}
              <div className="flex flex-col gap-2 text-[10px] border-b border-dashed border-slate-200 pb-3 leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-slate-550">REFERENCE ID:</span>
                  <span className="font-bold text-slate-900">{slipData.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-550">CLEARED DATE:</span>
                  <span className="font-bold text-slate-900">{slipData.timestamp.split(',')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-550">RECIPIENT:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[130px]">{slipData.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-550">GATEWAY ROUTE:</span>
                  <span className="font-bold text-slate-900">{slipData.payoutMethod}</span>
                </div>
              </div>

              {/* Item Details */}
              <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 text-[10px] leading-normal">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>ITEM DESCRIPTION</span>
                  <span>QTY</span>
                </div>
                <div className="flex justify-between text-slate-650">
                  <span className="truncate max-w-[160px]">{slipData.title}</span>
                  <span>1</span>
                </div>
                <div className="text-[8px] text-slate-500 uppercase">
                  Category: {slipData.category} • Approver: {slipData.managerName}
                </div>
              </div>

              {/* Payout Breakdown */}
              <div className="flex flex-col gap-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-550">SUBTOTAL AMOUNT:</span>
                  <span className="text-slate-900">₹{slipData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-550">DEDUCTIONS / TAX:</span>
                  <span className="text-slate-900">₹0.00</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-900 pt-2 mt-1">
                  <span>NET Payout:</span>
                  <span>₹{slipData.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Barcode and Stamp */}
              <div className="flex flex-col items-center gap-1 border-t border-dashed border-slate-200 pt-3 mt-1 select-none text-center">
                <div className="font-mono tracking-widest text-[8px] text-slate-500 font-medium">
                  *EXP-{slipData.id.toUpperCase()}*
                </div>
                <span className="text-[7px] text-slate-400">
                  Transaction verified and completed. Thank you.
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
              <button
                onClick={() => alert('Sending receipt slip to system printing node...')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 border border-white/5 cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                Print Slip
              </button>
              <button
                onClick={() => alert('Downloading payout slip PDF attachment...')}
                className="bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-750 text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
