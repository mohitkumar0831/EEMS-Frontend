import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';
import {
  ClipboardList,
  Plane,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Utensils,
  Laptop,
  FileText,
  Compass
} from 'lucide-react';

const ClaimsStatusChart = ({ totalClaims, pendingClaimsCount, approvedClaimsCount, totalReimbursedCount }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = [
    { label: 'Submitted', value: totalClaims, type: 'count', color: 'url(#submittedGrad)', hoverColor: '#818cf8', displayVal: `${totalClaims} claims` },
    { label: 'Pending Review', value: pendingClaimsCount, type: 'count', color: 'url(#pendingGrad)', hoverColor: '#fbbf24', displayVal: `${pendingClaimsCount} claims` },
    { label: 'Approved', value: approvedClaimsCount, type: 'count', color: 'url(#approvedGrad)', hoverColor: '#60a5fa', displayVal: `${approvedClaimsCount} claims` },
    { label: 'Reimbursed', value: totalReimbursedCount, type: 'count', color: 'url(#reimbursedGrad)', hoverColor: '#34d399', displayVal: `${totalReimbursedCount} claims` },
  ];

  const counts = [totalClaims, pendingClaimsCount, approvedClaimsCount, totalReimbursedCount];
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
            <linearGradient id="submittedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.35" />
            </linearGradient>
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

export const Overview = () => {
  const navigate = useNavigate();
  const { currentUser, users } = useAppState();

  const [metrics, setMetrics] = useState({
    pendingExpensesCount: 0,
    budgetUtilized: 0,
    categorySpend: {},
    pendingTravelCount: 0
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(EXPENSE_ENDPOINTS.GET_MANAGER_DASHBOARD(currentUser.tenantSlug, currentUser.id || currentUser._id), {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch manager dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEmployeesCount = async () => {
      try {
        const res = await fetch(USER_ENDPOINTS.GET_MANAGER_EMPLOYEES(currentUser.tenantSlug, currentUser.id || currentUser._id), {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setTotalEmployees(data.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch manager employees:', err);
      }
    };

    if (currentUser?.tenantSlug && (currentUser.id || currentUser._id)) {
      fetchMetrics();
      fetchEmployeesCount();
    }
  }, [currentUser]);

  const companyUsers = users.filter(u => u.tenantId === currentUser?.tenantId);

  // Filter for team members in the same department (excluding the manager themselves)
  const teamMembers = companyUsers.filter(u => u.department === currentUser?.department && u.role === 'Employee');

  const totalSpent = Object.values(metrics.categorySpend).reduce((sum, val) => sum + val, 0) || 1; // Avoid divide by zero

  const categoryDetails = Object.entries(metrics.categorySpend).map(([cat, amount]) => {
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
    }

    return {
      category: cat,
      amount,
      percentage: (amount / totalSpent) * 100,
      colorClass,
      icon
    };
  }).sort((a, b) => b.amount - a.amount);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Approvals Dashboard</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Overview of pending team budget claims, travel authorizations, and active department staff standings.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pending Expenses */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Expenses</span>
            <span className="text-3xl font-extrabold text-slate-100">{metrics.pendingExpensesCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Total Employee */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Employee</span>
            <span className="text-3xl font-extrabold text-slate-100">{totalEmployees}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        {/* Audited Expense */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audited Expense</span>
            <span className="text-3xl font-extrabold text-slate-100">{metrics.auditedExpenseCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Approved Spend</span>
            <span className="text-3xl font-extrabold text-slate-100">₹{metrics.budgetUtilized.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClaimsStatusChart
          totalClaims={metrics.totalClaims || 0}
          pendingClaimsCount={metrics.pendingExpensesCount || 0}
          approvedClaimsCount={metrics.approvedClaimsCount || 0}
          totalReimbursedCount={metrics.totalReimbursedCount || 0}
        />
        <SpendByCategoryChart
          categoryDetails={categoryDetails}
          totalMySpent={totalSpent}
        />
      </div>

      {/* Interactive Main Sections */}
      <div className="flex flex-col gap-6 w-full">

        {/* Main Column: Approval Queues */}
        <div className="flex flex-col gap-6 w-full">

          {/* Expenses Queue Card */}
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Immediate Expense Queue</h4>
                <p className="text-xs text-slate-500 mt-1">Pending claims submitted by your department employees.</p>
              </div>
            </div>

            {metrics.pendingExpenses?.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
                <p className="text-slate-500 text-xs">Hurray! No pending expense claims to approve.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {metrics.pendingExpenses?.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-slate-950/20 hover:border-slate-800 transition-colors">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 truncate">{exp.title}</span>
                        {exp.status === 'Under Review' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                            Policy Flagged
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">By {users.find(u => u.id === exp.employeeId || u._id === exp.employeeId)?.name || 'Employee'} • {exp.category} • {new Date(exp.submittedAt || exp.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Spend analysis & Staff overview */}
        {/* <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="text-sm font-bold text-slate-200">Department Spend breakdown</h4>
              <p className="text-xs text-slate-500 mt-1">Validated expenses by claim category.</p>
            </div>

            {categoryDetails.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No approved spend details found.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {categoryDetails.map(item => (
                  <div key={item.category} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-slate-200">{item.category}</span>
                      </div>
                      <span className="text-slate-400">₹{item.amount.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950/60 border border-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

      </div>
    </div>
  );
};
