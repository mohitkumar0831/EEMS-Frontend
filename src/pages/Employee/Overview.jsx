import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Plane,
  Laptop,
  Utensils,
  FileText,
  Clock,
  Compass
} from 'lucide-react';

const ClaimsStatusChart = ({ totalClaims, pendingClaimsCount, approvedClaimsCount, totalReimbursedCount, totalReimbursed }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxAmount = Math.max(totalReimbursed || 0, 1000);

  const data = [
    { label: 'Submitted', value: totalClaims, type: 'count', color: 'url(#submittedGrad)', hoverColor: '#818cf8', displayVal: `${totalClaims} claims` },
    { label: 'Pending', value: pendingClaimsCount, type: 'count', color: 'url(#pendingGrad)', hoverColor: '#fbbf24', displayVal: `${pendingClaimsCount} claims` },
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
        <p className="text-[10px] text-slate-500">Overview of your claims activity volume vs. total reimbursed amount.</p>
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
                <text
                  x={width - paddingRight + 10}
                  y={y + 4}
                  textAnchor="start"
                  fill="#94a3b8"
                  className="text-[9px] font-medium"
                >
                  ₹{Math.round(ratio * maxAmount >= 1000 ? `${(ratio * maxAmount / 1000).toFixed(0)}k` : Math.round(ratio * maxAmount))}
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

            const valRatio = item.type === 'count' ? item.value / maxCount : item.value / maxAmount;
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
                  {item.type === 'amount' ? `₹${Math.round(item.value)}` : item.value}
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
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>Right Axis: Reimbursed (₹)</span>
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
                  Total Spend
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
  const { currentUser } = useAppState();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!currentUser) return;
        const tenantSlug = currentUser.tenantSlug || 'platform'; // Use tenantSlug instead of tenantId
        const res = await axios.get(EXPENSE_ENDPOINTS.GET_EMPLOYEE_DASHBOARD(tenantSlug, currentUser.id));
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [currentUser]);

  if (loading || !dashboardData) {
    return <PageSkeleton />;
  }

  const {
    totalClaims = 0,
    pendingClaimsCount = 0,
    approvedClaimsCount = 0,
    totalReimbursed = 0,
    totalReimbursedCount = 0,
    flaggedClaimsCount = 0,
    personalCategorySpend = {},
    recentClaims = [],
    recentTravel = [],
    policies = []
  } = dashboardData;

  const totalMySpent = Object.values(personalCategorySpend).reduce((sum, val) => sum + val, 0) || 1;

  const categoryDetails = Object.entries(personalCategorySpend).map(([cat, amount]) => {
    let colorClass = 'bg-indigo-500';
    let icon = <FileText className="w-4 h-4 text-slate-450" />;

    if (cat === 'Meals') {
      colorClass = 'bg-amber-500';
      icon = <Utensils className="w-4 h-4 text-amber-450" />;
    } else if (cat === 'Travel') {
      colorClass = 'bg-sky-500';
      icon = <Plane className="w-4 h-4 text-sky-450" />;
    } else if (cat === 'Equipment') {
      colorClass = 'bg-purple-500';
      icon = <Laptop className="w-4 h-4 text-purple-450" />;
    }

    return {
      category: cat,
      amount,
      percentage: (amount / totalMySpent) * 100,
      colorClass,
      icon
    };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      {/* <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Employee Overview</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Monitor your submitted reimbursement claims, active travel requests, and corporate policy compliance standing.
        </p>
      </div> */}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Submitted Claims */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Submitted Claims</span>
            <span className="text-3xl font-extrabold text-slate-100">{totalClaims}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        {/* Claims Pending Review */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Pending Review</span>
            <span className="text-3xl font-extrabold text-slate-100">{pendingClaimsCount}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* Approved (Unpaid) */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Approved (Unpaid)</span>
            <span className="text-3xl font-extrabold text-slate-100">{approvedClaimsCount}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Total Reimbursed */}
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-450">Total Reimbursed</span>
            <span className="text-3xl font-extrabold text-slate-100">₹{totalReimbursed.toFixed(2)}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClaimsStatusChart
          totalClaims={totalClaims}
          pendingClaimsCount={pendingClaimsCount}
          approvedClaimsCount={approvedClaimsCount}
          totalReimbursedCount={totalReimbursedCount}
          totalReimbursed={totalReimbursed}
        />
        <SpendByCategoryChart
          categoryDetails={categoryDetails}
          totalMySpent={totalMySpent}
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Claims list card */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Recent Claims Activity</h3>
              <p className="text-xs text-slate-500 mt-1">Audit status tracking on your latest expense claim submissions.</p>
            </div>
          </div>

          {recentClaims.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
              <p className="text-xs text-slate-500">No expense claims filed yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentClaims.slice(0, 4).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/20 p-3.5 hover:border-slate-800 transition-colors">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-xs font-bold text-slate-200">{exp.title}</span>
                    <span className="text-[10px] text-slate-550">{exp.category} • {exp.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-200">₹{exp.amount.toFixed(2)}</span>
                    <span className={`rounded-lg border px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase ${exp.status === 'Paid'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : exp.status === 'Approved'
                        ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                        : exp.status === 'Rejected'
                          ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                      }`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Travel Request Card */}
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Recent Plans</h3>
              <p className="text-xs text-slate-500 mt-1">Status of plans requests submitted for authorization.</p>
            </div>
          </div>

          {recentTravel.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
              <p className="text-xs text-slate-500">No plans submitted.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentTravel.slice(0, 4).map((tr) => (
                <div key={tr.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/20 p-3.5 hover:border-slate-800 transition-colors">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-xs font-bold text-slate-200">{tr.destination}</span>
                    <span className="text-[10px] text-slate-550">{tr.purpose}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-200">₹{tr.estimatedCost.toFixed(2)}</span>
                    <span className={`rounded-lg border px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase ${tr.status === 'Approved'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : tr.status === 'Rejected'
                        ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                        : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                      }`}>
                      {tr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
