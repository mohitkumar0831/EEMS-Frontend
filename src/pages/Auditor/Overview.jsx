import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS } from '../../constants/apiConstants';
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Flag,
  Clock,
  DollarSign,
  Users,
  Utensils,
  Plane,
  Laptop,
  FileText,
  TrendingUp,
  Eye,
  Lock,
  Compass
} from 'lucide-react';

const AuditorClaimsStatusChart = ({ pendingAuditCount, approvedClaimsCount, totalReimbursedCount }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = [
    { label: 'Pending Audit', value: pendingAuditCount, type: 'count', color: 'url(#pendingGrad)', hoverColor: '#fbbf24', displayVal: `${pendingAuditCount} claims` },
    { label: 'Approved', value: approvedClaimsCount, type: 'count', color: 'url(#approvedGrad)', hoverColor: '#60a5fa', displayVal: `${approvedClaimsCount} claims` },
    { label: 'Reimbursed', value: totalReimbursedCount, type: 'count', color: 'url(#reimbursedGrad)', hoverColor: '#34d399', displayVal: `${totalReimbursedCount} claims` },
  ];

  const counts = [pendingAuditCount, approvedClaimsCount, totalReimbursedCount];
  const maxCount = Math.max(...counts, 5);

  const width = 500;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 55;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
      <div className="flex flex-col gap-1 mb-4">
        <h4 className="text-sm font-bold text-slate-200">Claims & Reimbursement Analytics</h4>
        <p className="text-[10px] text-slate-500">Overview of claims activity volume vs. total reimbursed claims.</p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="reimbursedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  className="text-[9px] font-medium"
                >
                  {Math.round(ratio * maxCount)}
                </text>
              </g>
            );
          })}

          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#334155"
            strokeWidth="1.5"
            opacity="0.5"
          />

          {data.map((item, idx) => {
            const segmentWidth = chartWidth / data.length;
            const barWidth = 36;
            const x = paddingLeft + segmentWidth * idx + (segmentWidth - barWidth) / 2;

            const valRatio = item.value / maxCount;
            const barHeight = valRatio * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            const isHovered = hoveredBar === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                className="cursor-pointer"
              >
                <rect
                  x={paddingLeft + segmentWidth * idx}
                  y={paddingTop}
                  width={segmentWidth}
                  height={chartHeight}
                  fill="transparent"
                />

                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  rx={6}
                  ry={6}
                  fill={item.color}
                  stroke={isHovered ? item.hoverColor : 'transparent'}
                  strokeWidth={1.5}
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))' : 'none',
                    transformOrigin: `${x + barWidth / 2}px ${paddingTop + chartHeight}px`,
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)'
                  }}
                />

                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={isHovered ? '#f8fafc' : '#94a3b8'}
                  className="text-[9px] font-bold transition-colors duration-200"
                >
                  {item.value}
                </text>

                <text
                  x={x + barWidth / 2}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#f8fafc' : '#64748b'}
                  className="text-[10px] font-bold tracking-wide transition-colors duration-200"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredBar !== null && (
          <div
            className="absolute z-10 rounded-xl border border-white/10 bg-slate-950/80 p-2.5 shadow-2xl backdrop-blur-md transition-all pointer-events-none duration-150"
            style={{
              left: `${(paddingLeft + (chartWidth / data.length) * hoveredBar + (chartWidth / data.length) / 2) / width * 100}%`,
              top: '15%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex flex-col gap-0.5 items-center">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{data[hoveredBar].label}</span>
              <span className="text-xs font-extrabold text-slate-100">{data[hoveredBar].displayVal}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[9px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <span>Left Axis: Claims Count</span>
        </div>
      </div>
    </div>
  );
};

const SpendByCategoryChart = ({ categoryDetails, totalMySpent }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const colors = {
    Meals: '#fbbf24',
    Travel: '#38bdf8',
    Equipment: '#c084fc',
    Others: '#818cf8'
  };

  const getHexColor = (cat) => colors[cat] || colors.Others;

  const radius = 90;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  const hasData = categoryDetails.length > 0;
  let accumulatedOffset = 0;

  const slices = hasData ? categoryDetails.map((item, idx) => {
    const percentage = item.percentage || 0;
    const sliceLength = (percentage / 100) * circumference;
    const strokeOffset = accumulatedOffset;
    accumulatedOffset += sliceLength;

    return {
      ...item,
      sliceLength,
      strokeOffset,
      color: getHexColor(item.category),
      gradient: `url(#${item.category.toLowerCase()}Grad)`
    };
  }) : [
    {
      category: 'No Spend Data',
      amount: 0,
      percentage: 100,
      sliceLength: circumference,
      strokeOffset: 0,
      color: '#475569',
      gradient: 'url(#nodataGrad)',
      icon: <Compass className="w-4.5 h-4.5" />
    }
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300 flex flex-col gap-4">
      {/* Background Decorative Radial Glow */}
      <div className="absolute -left-12 -top-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-1 z-10">
        <h4 className="text-sm font-bold text-slate-200 tracking-wide">Spend Distribution by Category</h4>
        <p className="text-[10px] text-slate-400 font-medium">Approved and paid spend distributions across categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        {/* Donut SVG Container */}
        <div className="relative flex justify-center items-center p-2">
          {/* Glassmorphic Backdrop Ring */}
          <div className="absolute w-[220px] h-[220px] rounded-full border border-white/5 bg-slate-950/20 backdrop-blur-md shadow-2xl pointer-events-none flex items-center justify-center" />

          <svg viewBox="0 0 240 240" className="w-44 h-44 sm:w-52 sm:h-52 transform -rotate-90 z-10 overflow-visible">
            <defs>
              {/* Meals: Amber to Orange */}
              <linearGradient id="mealsGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              {/* Travel: Sky to Blue */}
              <linearGradient id="travelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              {/* Equipment: Purple to Pink */}
              <linearGradient id="equipmentGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              {/* Default/Others: Indigo to Blue */}
              <linearGradient id="othersGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              {/* No Data: Dark Slate */}
              <linearGradient id="nodataGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* Faint Background Track Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="transparent"
              stroke="#0f172a"
              strokeWidth={strokeWidth}
              opacity="0.8"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth - 4}
              opacity="0.5"
            />

            {slices.map((slice, idx) => {
              const isHovered = hoveredIndex === idx;
              const hasMultipleSlices = slices.length > 1;
              const gap = hasMultipleSlices ? 6 : 0;
              const adjustedLength = Math.max(slice.sliceLength - gap, 1);
              const adjustedOffset = slice.strokeOffset + (gap / 2);

              return (
                <circle
                  key={slice.category}
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={slice.gradient || slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${adjustedLength} ${circumference}`}
                  strokeDashoffset={-adjustedOffset}
                  strokeLinecap={hasMultipleSlices ? "round" : "butt"}
                  className="transition-all duration-300 ease-out cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transformOrigin: '120px 120px',
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}aa)` : 'none'
                  }}
                />
              );
            })}
          </svg>

          {/* Central content hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            {hoveredIndex !== null ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                  {slices[hoveredIndex].category}
                </span>
                <span className="text-base font-extrabold text-slate-100 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ₹{slices[hoveredIndex].amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-indigo-405 font-extrabold mt-1">
                  {slices[hoveredIndex].percentage.toFixed(1)}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">
                  Employee Spend
                </span>
                <span className="text-lg font-extrabold text-slate-100 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  ₹{totalMySpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Spend summary
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 z-10">
          {slices.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.category}
                className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer ${isHovered
                  ? 'border-white/15 bg-slate-800/40 translate-x-1.5 shadow-md shadow-indigo-500/5'
                  : 'border-white/5 bg-slate-900/20 hover:bg-slate-900/40 hover:border-white/10'
                  }`}
                style={{
                  borderLeft: isHovered ? `3px solid ${item.color}` : '1px solid rgba(255, 255, 255, 0.05)'
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-3">
                  {/* Styled Icon Wrapper */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? `${item.color}15` : 'rgba(255, 255, 255, 0.03)',
                      color: isHovered ? item.color : '#94a3b8',
                      border: `1px solid ${isHovered ? `${item.color}30` : 'rgba(255, 255, 255, 0.05)'}`
                    }}
                  >
                    {item.icon || <FileText className="w-4.5 h-4.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors duration-200">{item.category}</span>
                    <span className="text-[9px] text-slate-550 font-medium">Reimbursement Spend</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-extrabold text-slate-100 group-hover:text-white transition-colors duration-200">
                    ₹{item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[9px] text-slate-400 font-extrabold" style={{ color: isHovered ? item.color : '#94a3b8' }}>
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AuditorOverview = () => {
  const { currentUser, auditLogs } = useAppState();
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [apiExpenses, setApiExpenses] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!currentUser?.tenantSlug) return;
      try {
        const [resMetrics, resExpenses] = await Promise.all([
          fetch(EXPENSE_ENDPOINTS.GET_AUDITOR_DASHBOARD(currentUser.tenantSlug), {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          }),
          fetch(EXPENSE_ENDPOINTS.GET_ALL_EXPENSES(currentUser.tenantSlug), {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          })
        ]);

        if (resMetrics.ok) {
          const json = await resMetrics.json();
          if (json.success) setDashboardMetrics(json.data);
        }

        if (resExpenses.ok) {
          const expJson = await resExpenses.json();
          if (expJson.success) setApiExpenses(expJson.data);
        }
      } catch (err) {
        console.error('Failed to load auditor dashboard', err);
      }
    };
    fetchDashboard();
  }, [currentUser?.tenantSlug, currentUser?.token]);

  const companyExpenses = apiExpenses;
  const companyLogs = auditLogs.filter(l => l.tenantId === currentUser?.tenantId || l.tenantId === 'platform');

  const totalClaims = dashboardMetrics?.ledgerClaims?.count || 0;
  const uniqueClaimants = dashboardMetrics?.ledgerClaims?.activeClaimants || 0;

  const complianceRate = dashboardMetrics?.complianceRate?.percentage || 100;
  const violationCount = dashboardMetrics?.complianceRate?.violationsFound || 0;

  const flaggedExpensesCount = dashboardMetrics?.flaggedClaims?.count || 0;
  const flaggedValue = dashboardMetrics?.flaggedClaims?.underProbeAmount || 0;

  const auditClearedCount = dashboardMetrics?.auditCleared?.count || 0;

  const pendingAuditCount = dashboardMetrics?.awaitingAudit?.count || 0;
  const pendingAuditValue = dashboardMetrics?.awaitingAudit?.amountToReview || 0;

  const policyViolationsCount = dashboardMetrics?.policyViolations?.count || 0;

  const totalDisbursed = dashboardMetrics?.totalDisbursed?.amount || 0;

  const totalReimbursedCount = dashboardMetrics?.totalReimbursedCount || 0;
  const rawCategorySpend = dashboardMetrics?.categorySpend || {};

  const totalSpent = Object.values(rawCategorySpend).reduce((sum, val) => sum + val, 0) || 1;

  const categoryDetails = Object.entries(rawCategorySpend).map(([cat, amount]) => {
    let colorClass = 'bg-indigo-500';
    let icon = <FileText className="w-4 h-4 text-slate-400" />;

    if (cat === 'Meals') {
      colorClass = 'bg-amber-500';
      icon = <Utensils className="w-4 h-4 text-amber-400" />;
    } else if (cat === 'Travel') {
      colorClass = 'bg-sky-500';
      icon = <Plane className="w-4 h-4 text-sky-400" />;
    } else if (cat === 'Equipment') {
      colorClass = 'bg-purple-500';
      icon = <Laptop className="w-4 h-4 text-purple-400" />;
    } else {
      colorClass = 'bg-indigo-500';
      icon = <FileText className="w-4 h-4 text-indigo-400" />;
    }

    return {
      category: cat,
      amount,
      percentage: (amount / totalSpent) * 100,
      colorClass,
      icon
    };
  }).sort((a, b) => b.amount - a.amount);

  // Group expenses by category for risk breakdown
  const categories = ['Meals', 'Travel', 'Equipment'];
  const categoryData = categories.map(cat => {
    const catExp = companyExpenses.filter(e => e.category === cat);
    const total = catExp.reduce((s, e) => s + e.amount, 0);
    const flagged = catExp.filter(e => e.status === 'Flagged' || e.status === 'Under Review').length;
    return { name: cat, count: catExp.length, total, flagged };
  });
  const maxCatTotal = Math.max(...categoryData.map(c => c.total), 1);

  // Recent 5 audit events from auditLogs
  const recentLogs = [...companyLogs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);

  // Checklist items
  const checklistItems = [
    { label: 'Role-Based Access Guard', sub: 'Security separation verification', ok: true },
    { label: 'Approval Workflow Trace', sub: 'Multi-level validation tracking', ok: true },
    { label: 'Payment Gateway Compliance', sub: 'Reimbursement disbursement trail', ok: true },
    { label: 'Policy Cap Enforcement', sub: 'Category spend-limit rule binding', ok: violationCount === 0 },
    { label: 'Flagged Claims Investigation', sub: 'Active investigation on flagged items', ok: flaggedExpensesCount === 0 },
  ];

  const getCategoryIcon = (cat) => {
    if (cat === 'Meals') return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
    if (cat === 'Travel') return <Plane className="w-3.5 h-3.5 text-sky-400" />;
    if (cat === 'Equipment') return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Row 1: Primary KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ledger Claims</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-1">{totalClaims}</div>
            <span className="text-[10px] text-indigo-400">{uniqueClaimants} active claims</span>
          </div>
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Flagged Claims</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-1">{flaggedExpensesCount}</div>
            {/* <span className="text-[10px] text-rose-400">₹{flaggedValue.toFixed(2)} under probe</span> */}
          </div>
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/70 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Audit Cleared</span>
            <div className="text-2xl font-extrabold text-violet-400 mt-1">{auditClearedCount}</div>
            <span className="text-[10px] text-violet-400">by your sign-off</span>
          </div>
          <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ── Row 2: Secondary Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awaiting Audit</span>
          <span className="text-lg font-extrabold text-amber-300">{pendingAuditCount}</span>
          <span className="text-[10px] text-slate-500">₹{pendingAuditValue.toFixed(2)} to review</span>
        </div>

        <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-1 shadow-lg">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Disbursed</span>
          <span className="text-lg font-extrabold text-sky-300">₹{totalDisbursed.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500">across paid claims</span>
        </div>

      </div>

      {/* ── Row 3: Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AuditorClaimsStatusChart
          pendingAuditCount={pendingAuditCount}
          approvedClaimsCount={auditClearedCount}
          totalReimbursedCount={totalReimbursedCount}
        />
        <SpendByCategoryChart
          categoryDetails={categoryDetails}
          totalMySpent={totalSpent === 1 ? 0 : totalSpent}
        />
      </div>

      {/* ── Row 4: Category Risk + Recent Activity ── */}
      <div className="grid grid-cols-1 gap-5">

        {/* Category Risk Breakdown */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-5 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Category Risk Breakdown</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Expense volume and flagged counts by category</p>
          </div>

          <div className="flex flex-col gap-4">
            {categoryData.map(cat => {
              const barWidth = maxCatTotal > 0 ? (cat.total / maxCatTotal) * 100 : 0;
              const flaggedPct = cat.count > 0 ? (cat.flagged / cat.count) * 100 : 0;
              const barColor = cat.name === 'Meals' ? 'bg-amber-400' : cat.name === 'Travel' ? 'bg-sky-400' : 'bg-indigo-400';
              return (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat.name)}
                      <span className="font-semibold text-slate-300">{cat.name}</span>
                      <span className="text-[9px] text-slate-600">{cat.count} claims</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-slate-100">₹{cat.total.toFixed(2)}</span>
                      {cat.flagged > 0 && (
                        <span className="text-[9px] font-bold text-rose-400 flex items-center gap-0.5">
                          <Flag className="w-2.5 h-2.5" />{cat.flagged} flagged
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Total bar */}
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor} opacity-30`} style={{ width: `${barWidth}%` }} />
                  </div>
                  {/* Flagged sub-bar */}
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden -mt-2">
                    <div className={`h-full rounded-full bg-rose-500`} style={{ width: `${flaggedPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[9px] text-slate-500 border-t border-white/5 pt-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Total spend</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Flagged ratio</span>
          </div>
        </div>

      </div>

    </div>
  );
};
