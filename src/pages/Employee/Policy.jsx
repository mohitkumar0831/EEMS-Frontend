import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import {
  Shield,
  Utensils,
  Plane,
  Laptop,
  Car,
  Hotel,
  Clock,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronRight,
  DollarSign,
  CalendarDays,
  BookOpen,
  FileText
} from 'lucide-react';

const categories = [
  {
    id:      'meals',
    icon:    Utensils,
    color:   'text-amber-400',
    bg:      'bg-amber-500/10',
    border:  'border-amber-500/20',
    label:   'Meals & Entertainment',
    cap:     '₹75 / day',
    rules: [
      'Maximum ₹75 per day for meals, including breakfast, lunch, and dinner combined.',
      'Business purpose must be stated in the claim description.',
      'Alcohol is not reimbursable under any circumstances.',
      'Meals for individual employees (no client/team present) are capped at ₹20.',
      'Receipts are required for all meal claims above ₹25.',
    ]
  },
  {
    id:      'travel',
    icon:    Plane,
    color:   'text-sky-400',
    bg:      'bg-sky-500/10',
    border:  'border-sky-500/20',
    label:   'Business Travel',
    cap:     'Actuals + approval',
    rules: [
      'All travel exceeding ₹500 must receive prior manager approval before booking.',
      'Economy class is mandatory for domestic flights under 6 hours.',
      'Reimbursement is provided for standard fares only — no upgrades.',
      'Hotel stays are reimbursed at actuals up to ₹200/night (city rates may vary).',
      'Per-diem for meals during travel is ₹85/day — no additional meal receipts required.',
    ]
  },
  {
    id:      'equipment',
    icon:    Laptop,
    color:   'text-indigo-400',
    bg:      'bg-indigo-500/10',
    border:  'border-indigo-500/20',
    label:   'Equipment & Hardware',
    cap:     '₹1,000 limit',
    rules: [
      'Equipment purchases up to ₹300 can be reimbursed with manager approval.',
      'Purchases between ₹300–₹1,000 require both manager and finance pre-approval.',
      'Any purchase above ₹1,000 must go through the company procurement process.',
      'All hardware purchased becomes company property and must be returned upon exit.',
      'Software/SaaS subscriptions require IT department approval before purchase.',
    ]
  },
  {
    id:      'mileage',
    icon:    Car,
    color:   'text-emerald-400',
    bg:      'bg-emerald-500/10',
    border:  'border-emerald-500/20',
    label:   'Mileage & Local Transport',
    cap:     '₹0.67 / mile',
    rules: [
      'Personal vehicle usage is reimbursed at the current IRS standard rate (₹0.67/mile).',
      'Commuting to your regular office is not eligible for reimbursement.',
      'Rideshare (Uber/Lyft) and taxi expenses are reimbursable with receipts.',
      'Parking fees and tolls incurred for business purposes are reimbursable.',
      'Mileage claims must include start/end addresses in the claim description.',
    ]
  },
  {
    id:      'accommodation',
    icon:    Hotel,
    color:   'text-violet-400',
    bg:      'bg-violet-500/10',
    border:  'border-violet-500/20',
    label:   'Accommodation',
    cap:     '₹200 / night',
    rules: [
      'Standard hotel accommodation is reimbursed at actuals up to ₹200/night.',
      'High-cost cities (NYC, SF, London) may be pre-approved for up to ₹300/night.',
      'Airbnb and short-term rentals are allowed if total cost is lower than hotel equivalent.',
      'Mini-bar, spa, and personal entertainment charges are not reimbursable.',
      'Booking confirmation and itemised receipt must be attached to the claim.',
    ]
  },
  {
    id:      'other',
    icon:    FileText,
    color:   'text-slate-400',
    bg:      'bg-slate-700/30',
    border:  'border-slate-700/50',
    label:   'Other Expenses',
    cap:     'Case by case',
    rules: [
      'Any expense not covered by the categories above requires manager pre-approval.',
      'Training, courses, and certifications are reimbursable up to ₹500/year.',
      'Office supplies purchased for home office are reimbursable up to ₹150/year.',
      'Client gifts are reimbursable up to ₹50 per client with manager approval.',
      'Personal expenses are never reimbursable regardless of circumstance.',
    ]
  }
];

const generalRules = [
  { icon: Receipt,      label: 'Receipt Requirement',     desc: 'Itemised receipts must be uploaded for all claims above ₹25. Claims without receipts will be automatically flagged.' },
  { icon: CalendarDays, label: 'Submission Window',       desc: 'All expense claims must be submitted within 30 days of the expense date. Late submissions will be rejected by the system.' },
  { icon: Clock,        label: 'Processing Timeline',     desc: 'Approved claims are processed within 5–7 business days. Finance team disburses via ACH or wire transfer.' },
  { icon: DollarSign,   label: 'Monthly Cap',             desc: 'Each employee has a ₹2,000 monthly expense cap across all categories combined. Exceptions require director sign-off.' },
  { icon: AlertTriangle,label: 'Non-Reimbursable Items',  desc: 'Personal expenses, fines/penalties, gifts over ₹50 (without approval), and alcohol are never reimbursable.' },
  { icon: Shield,       label: 'Compliance & Audit',      desc: 'All claims are subject to random auditing. Fraudulent claims may result in disciplinary action including termination.' },
];

export const EmployeePolicy = () => {
  const [expanded, setExpanded] = useState(null);
  const { currentUser, tenants } = useAppState();

  const tenantName = currentUser?.tenantId === 'platform'
    ? 'ExpenseFlow Platform'
    : tenants?.find(t => t.id === currentUser?.tenantId)?.name || 'Your Company';

  return (
    <div className="flex flex-col gap-7">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Company Expense Policy
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          Official expense reimbursement guidelines for <span className="text-indigo-400 font-semibold">{tenantName}</span>. 
          Read and follow these policies before submitting any claims.
        </p>
      </div>

      {/* Policy last updated banner */}
      <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl px-5 py-3.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <p className="text-xs text-indigo-300 leading-relaxed">
          <span className="font-bold">Policy Version 3.2 · Effective June 1, 2026.</span> This policy supersedes all previous versions. Contact your HR department for any queries.
        </p>
      </div>

      {/* General Rules Grid */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Shield className="w-4 h-4 text-violet-400" />
          General Rules &amp; Compliance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {generalRules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-lg hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{rule.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rule.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Accordion */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Category-Wise Spending Limits
        </h4>

        <div className="flex flex-col gap-3">
          {categories.map(cat => {
            const Icon    = cat.icon;
            const isOpen  = expanded === cat.id;
            return (
              <div
                key={cat.id}
                className={`bg-slate-900/60 border rounded-2xl overflow-hidden shadow-lg transition-all ${
                  isOpen ? 'border-indigo-500/25' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center ${cat.color} shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5 text-left">
                      <span className="text-sm font-bold text-slate-200">{cat.label}</span>
                      <span className="text-[10px] text-slate-500">Cap: <span className="font-bold text-slate-300">{cat.cap}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${cat.bg} ${cat.color} ${cat.border}`}>
                      {cat.rules.length} rules
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-slate-400" />
                      : <ChevronRight className="w-4 h-4 text-slate-600" />
                    }
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    <ul className="flex flex-col gap-2.5">
                      {cat.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl px-5 py-4">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">Important:</span> Submitting a false or inflated expense claim constitutes fraud. All claims are audited and cross-referenced with receipts. Non-compliance may result in disciplinary proceedings. When in doubt, contact your manager before filing.
        </p>
      </div>

    </div>
  );
};
