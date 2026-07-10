import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, AUTH_ENDPOINTS } from '../../constants/apiConstants';
import { 
  AlertTriangle, 
  Plus, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Paperclip, 
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
  Utensils,
  Laptop,
  FileText,
  Plane
} from 'lucide-react';

export const FileExpenseClaim = () => {
  const navigate = useNavigate();
  const { currentUser, policies, submitExpense } = useAppState();
  const [companyManagers, setCompanyManagers] = useState([]);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meals');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [assignedManagerId, setAssignedManagerId] = useState('');

  useEffect(() => {
    const fetchCompanyAdmin = async () => {
      try {
        const response = await fetch(AUTH_ENDPOINTS.GET_COMPANY_ADMIN(currentUser.tenantSlug), {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          const admin = data.data;
          setCompanyManagers([admin]);
          setAssignedManagerId(admin._id || admin.id);
        }
      } catch (err) {
        console.error('Error fetching company admin:', err);
      }
    };

    if (currentUser?.tenantSlug) {
      fetchCompanyAdmin();
    }
  }, [currentUser]);

  const activePolicy = policies.find(
    p => p.tenantId === currentUser?.tenantId && p.category.toLowerCase() === category.toLowerCase()
  );
  
  const numericAmount = parseFloat(amount) || 0;
  const isOverPolicyLimit = activePolicy && numericAmount > activePolicy.limit;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileClaim = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    setIsSubmitting(true);
    let receiptId = null;

    try {
      const employeeId = currentUser?._id || currentUser?.id;
      
      // 1. Upload receipt if file is selected
      if (receiptFile) {
        const formData = new FormData();
        formData.append('receipt', receiptFile);
        formData.append('employeeId', employeeId);

        const uploadRes = await fetch(EXPENSE_ENDPOINTS.UPLOAD_RECEIPT(currentUser.tenantSlug), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.success) {
          receiptId = uploadData.data._id;
        } else {
          console.error('Receipt upload failed:', uploadData);
          alert(uploadData.message || 'Receipt upload failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Create the expense
      const payload = {
        title: title.trim(),
        category: category,
        amount: numericAmount,
        description: description.trim() || undefined,
        employeeId: employeeId,
        assignedManagerId: assignedManagerId || undefined,
        receiptId: receiptId || undefined,
        policyId: activePolicy ? activePolicy._id || activePolicy.id : undefined,
        status: 'Submitted'
      };

      const expenseRes = await fetch(EXPENSE_ENDPOINTS.CREATE_EXPENSE(currentUser.tenantSlug), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(payload)
      });

      const expenseData = await expenseRes.json();
      
      if (expenseRes.ok && expenseData.success) {
        setTitle('');
        setCategory('Meals');
        setAmount('');
        setDescription('');
        setReceiptFile(null);
        navigate(`/${currentUser.tenantSlug}/dashboard/auditor/reimbursements`);
      } else {
        console.error('Expense creation failed:', expenseData);
        alert(expenseData.message || 'Failed to submit expense');
      }
    } catch (err) {
      console.error('Error submitting expense:', err);
      alert('Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedManager = companyManagers.find(m => (m._id || m.id) === assignedManagerId);

  // Helper to match category to icon
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Meals':
        return <Utensils className="w-4 h-4 text-amber-450" />;
      case 'Travel':
        return <Plane className="w-4 h-4 text-sky-450" />;
      case 'Equipment':
        return <Laptop className="w-4 h-4 text-indigo-450" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">File Reimbursement Claim</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Create an expense reimbursement claim, attach digital invoices, and route to your preferred manager for L1 approval.
        </p>
      </div>

      {/* Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Expense Form */}
        <div className="bg-slate-900/60 border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl lg:col-span-2 flex flex-col gap-5">
          <form onSubmit={handleFileClaim} className="flex flex-col gap-4.5 text-xs">
            
            {/* Title Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Expense Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flight ticket to Seattle Tech Conference"
                className="rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 placeholder-slate-700 transition-all font-medium"
                required
              />
            </div>

            {/* Category & Amount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 transition-all font-semibold"
                >
                  <option value="Meals">Meals / Business Dining</option>
                  <option value="Travel">Travel / Accommodation</option>
                  <option value="Equipment">IT Equipment / Supplies</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Total Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-8 pr-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 font-bold placeholder-slate-750"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Justification Text Area */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Business Justification</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state the business purpose for this claim (e.g. Onsite client training)..."
                className="h-22 resize-none rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 leading-normal font-medium placeholder-slate-700"
                required
              />
            </div>

            {/* Manager Selection Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Route to Company Admin</label>
              <div className="flex flex-col gap-3">
                <select
                  value={assignedManagerId}
                  onChange={(e) => setAssignedManagerId(e.target.value)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 py-3 px-4 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/10 transition-all font-semibold"
                  required
                >
                  <option value="" disabled>Select Company Admin...</option>
                  {companyManagers.map(m => (
                    <option key={m._id || m.id} value={m._id || m.id}>
                      {m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim()} (Company Admin) — {m.email}
                    </option>
                  ))}
                </select>

                {/* Selected Reviewer Contact Card */}
                {selectedManager && (
                  <div className="flex items-center gap-3 p-3 bg-slate-950/30 border border-slate-850 rounded-2xl animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                      {(selectedManager.firstName || selectedManager.name || 'M').charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0 text-[10px]">
                      <span className="font-bold text-slate-350">{selectedManager.name || `${selectedManager.firstName || ''} ${selectedManager.lastName || ''}`.trim()}</span>
                      <span className="text-slate-500 uppercase mt-0.5 tracking-wider">{selectedManager.department || 'General'} • {selectedManager.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Digital Invoices Attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Attach Receipt Invoice</label>
              <div className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-5.5 text-center transition-all hover:border-indigo-500/20">
                <input 
                  type="file" 
                  onChange={(e) => setReceiptFile(e.target.files[0])} 
                  className="absolute inset-0 cursor-pointer opacity-0" 
                />
                <Paperclip className="w-5 h-5 text-indigo-400" />
                <span className="text-[11px] text-slate-400 font-medium">
                  {receiptFile ? `File Selected: ${receiptFile.name}` : 'Click here or drag-and-drop receipt image (PDF, PNG, JPG)'}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Max Size Limit: 5MB</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-650 px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all hover:from-indigo-650 hover:to-purple-750 active:scale-95 font-bold uppercase tracking-wider ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'Filing Claim...' : 'File Reimbursement Claim'}
            </button>
          </form>
        </div>

        {/* Right Column (1/3 width): Policy & Journey Simulator */}
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Category Policy Compliance Card */}
          <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-sm font-bold text-slate-200">Category Policy Guard</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Automated policy checks based on corporate compliance limits.</p>
            </div>

            {activePolicy ? (
              <div className="flex flex-col gap-3.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Selected Category:</span>
                  <span className="font-semibold text-slate-250">{category}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Standard Spending Cap:</span>
                  <span className="font-extrabold text-slate-205">₹{activePolicy.limit.toFixed(2)}</span>
                </div>

                {/* Limit status indicator */}
                {numericAmount > 0 && (
                  <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                    isOverPolicyLimit 
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-450' 
                      : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-450'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-[11px]">
                      {isOverPolicyLimit ? (
                        <>
                          <ShieldAlert className="w-4.5 h-4.5 text-rose-450 shrink-0" />
                          <span>Policy Violation Warning</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-450 shrink-0" />
                          <span>Claim Compliant</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {isOverPolicyLimit 
                        ? `Your claim amount of ₹${numericAmount.toFixed(2)} exceeds the limit (₹${activePolicy.limit.toFixed(2)}). It will be flagged for compliance review.`
                        : `Your claim amount of ₹${numericAmount.toFixed(2)} is within policy bounds. It will be routed directly for approval.`
                      }
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-550 italic">Select a category to view associated policies.</p>
            )}
          </div>

          {/* Card 2: Routing Journey Simulator */}
          <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-sm font-bold text-slate-200">Routing Lifecycle</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">The sequence of review stages this claim will traverse.</p>
            </div>

            <div className="flex flex-col gap-4 relative pl-3.5 border-l border-slate-800/80 mt-1">
              
              {/* Stage 1: Employee */}
              <div className="relative text-[10px] leading-relaxed">
                <div className="absolute left-[-20.5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-emerald-500/30" />
                <span className="font-bold text-slate-350 block">1. Employee Submission</span>
                <span className="text-slate-500 mt-0.5 block">Initiated by you ({currentUser?.name || 'Employee'})</span>
              </div>

              {/* Stage 2: Company Admin */}
              <div className="relative text-[10px] leading-relaxed">
                <div className="absolute left-[-20.5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-indigo-500/30" />
                <span className="font-bold text-slate-350 block">2. Company Admin Authorization & Disbursal</span>
                <span className="text-slate-500 mt-0.5 block">
                  Assigned reviewer: <span className="font-semibold text-slate-400">{selectedManager ? (selectedManager.name || `${selectedManager.firstName || ''} ${selectedManager.lastName || ''}`.trim()) : 'Choose reviewer'}</span>
                </span>
                <span className="text-slate-550 mt-1 block italic">Final approval and direct payout</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
