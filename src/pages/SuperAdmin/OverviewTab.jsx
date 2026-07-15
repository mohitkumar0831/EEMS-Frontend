import React, { useState, useEffect } from 'react';
import {
  Globe, Users, Settings, ShieldAlert, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Building2, Briefcase, Clock,
  CheckCircle2, AlertTriangle, XCircle, Plane, Activity
} from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { BILLING_ENDPOINTS } from '../../constants/apiConstants';
const GenericBarChart = ({ title, subtitle, data, yAxisLabel, isCurrency = false }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxCount = Math.max(...data.map(d => d.value), 5);

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
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-[10px] text-slate-500">{subtitle}</p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(ratio * maxCount);
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
                  {isCurrency ? (val > 1000 ? (val / 1000).toFixed(1) + 'k' : val) : val}
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
            const barWidth = Math.min(36, segmentWidth - 10);
            const x = paddingLeft + segmentWidth * idx + (segmentWidth - barWidth) / 2;

            const valRatio = item.value / maxCount;
            const barHeight = valRatio * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            const isHovered = hoveredBar === idx;
            const colorId = `url(#barGrad${idx % 5})`;

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
                  fill={colorId}
                  stroke={isHovered ? '#fff' : 'transparent'}
                  strokeWidth={1.5}
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: isHovered ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))' : 'none',
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
                  {isCurrency ? (item.value > 1000 ? (item.value / 1000).toFixed(1) + 'k' : item.value) : item.value}
                </text>

                <text
                  x={x + barWidth / 2}
                  y={paddingTop + chartHeight + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#f8fafc' : '#64748b'}
                  className="text-[10px] font-bold tracking-wide transition-colors duration-200"
                >
                  {item.label.length > 8 ? item.label.substring(0, 6) + '..' : item.label}
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
              <span className="text-xs font-extrabold text-slate-100">
                {isCurrency ? `₹${data[hoveredBar].value.toLocaleString()}` : data[hoveredBar].value}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[9px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <span>Left Axis: {yAxisLabel}</span>
        </div>
      </div>
    </div>
  );
};

export const OverviewTab = ({ stats }) => {
  if (!stats) return null;

  // ── Computed Metrics from Backend API ─────────────────
  const {
    activeTenants = 0,
    totalTenants = 0,
    totalUsers = 0,
    roleCounts = {},
    totalSpend = 0,
    totalClaims = 0,
    pendingClaims = 0,
    approvedClaims = 0,
    flaggedClaims = 0,
    categorySpend = {},
    activePolicies = 0,
    pendingTravel = 0,
    auditLogs = [],
    tenants = [],
    usersPerTenantMap = {},
    tenantSpendMap = {}
  } = stats;

  const categoryEntries = Object.entries(categorySpend).sort((a, b) => b[1] - a[1]);
  const categoryColors = ['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const categoryTextColors = ['text-indigo-400', 'text-purple-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400'];

  const topCompaniesByUsers = [...tenants]
    .map(t => ({ label: t.companyName || t.name || 'Unknown', value: usersPerTenantMap[t._id || t.id] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const topCompaniesBySpend = [...tenants]
    .map(t => ({ label: t.companyName || t.name || 'Unknown', value: tenantSpendMap[t._id || t.id] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const { currentUser } = useAppState();
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMonthlyVolume = async () => {
      try {
        const year = new Date().getFullYear();
        const res = await fetch(BILLING_ENDPOINTS.GET_MONTHLY_VOLUME(year), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
          }
        });
        const data = await res.json();

        if (data.success && data.data) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          // Map data to chart format
          let maxSpend = Math.max(...data.data.map(d => d.totalSpend), 1);

          const formatted = data.data.map(d => ({
            m: monthNames[d._id - 1], // _id is month number (1-12)
            spend: d.totalSpend,
            val: Math.max(10, (d.totalSpend / maxSpend) * 100) // Minimum 10% height for visibility
          }));

          // Fill missing months up to the current month or available data
          const currentMonth = new Date().getMonth() + 1; // 1-12
          const fullData = [];

          for (let i = 1; i <= currentMonth; i++) {
            const found = formatted.find(f => f.m === monthNames[i - 1]);
            if (found) fullData.push(found);
            else fullData.push({ m: monthNames[i - 1], spend: 0, val: 5 }); // 5% height for empty months
          }

          setMonthlyData(fullData);
        }
      } catch (err) {
        console.error('Failed to fetch monthly volume', err);
      }
    };
    fetchMonthlyVolume();
  }, [currentUser]);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Welcome Banner ────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-slate-900 border border-indigo-500/10 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Platform Command Center
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-lg">
              Real-time overview of multi-tenant operations, expense processing pipelines, and compliance audit coverage across all provisioned workspaces.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* ── Primary KPI Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Tenants */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{roleCounts['CompanyAdmin'] || 0}</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Registered company</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 z-10">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{totalUsers}</span>
              <span className="text-[10px] font-bold text-slate-500">across {Object.keys(usersPerTenantMap).length} companies</span>
            </div>
            <span className="text-[10px] text-slate-500">Avg {(totalUsers / Math.max(Object.keys(usersPerTenantMap).length, 1)).toFixed(1)} per tenant</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 z-10">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Spend</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">
                ₹{totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">{totalClaims} total claims submitted</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Pipeline Status Indicators ────────────────── */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
            <Clock className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{pendingClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Claims</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{approvedClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Approved</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/15 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{flaggedClaims}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Flagged Review</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 px-4 py-3.5 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
            <Plane className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-100">{pendingTravel}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Travel Requests</div>
          </div>
        </div>
      </div> */}

      {/* ── Middle Row: Chart + Category Breakdown ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Activity Chart */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                Platform Subscription Transaction Activity
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Subscription processing volume</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {new Date().getFullYear()}
            </span>
          </div>

          <div className="h-52 flex items-end gap-3 pt-6 px-2">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-slate-300 bg-slate-800 border border-white/10 px-2 py-1 rounded-lg whitespace-nowrap mb-1">
                  ₹{d.spend.toLocaleString()}
                </div>
                <div
                  style={{ height: `${d.val}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg shadow-lg shadow-indigo-500/10 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 relative"
                >
                  <div className="absolute inset-0 bg-white/5 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
              Category Allocation
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Spend distribution by expense category</p>
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {categoryEntries.map(([cat, amount], idx) => {
              const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">{cat}</span>
                    <span className={`font-mono font-bold ${categoryTextColors[idx % categoryTextColors.length]}`}>
                      {pct.toFixed(1)}% · ₹{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full ${categoryColors[idx % categoryColors.length]} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categoryEntries.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-4">No expense data available</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Tenant Grid + Role Distribution + Company Metrics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Workspace Health Cards */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col h-[300px]">
          <div className="shrink-0 mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-4.5 h-4.5 text-indigo-400" />
              Workspace Health Index
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Per-tenant metrics overview</p>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tenants.map((t, idx) => {
              const borderColors = ['border-indigo-500/20', 'border-emerald-500/20', 'border-fuchsia-500/20'];
              const bgColors = ['bg-indigo-500/5', 'bg-emerald-500/5', 'bg-fuchsia-500/5'];
              return (
                <div key={t.tenantId || idx} className={`p-4 rounded-xl border ${borderColors[idx % 3]} ${bgColors[idx % 3]} shrink-0`}>
                  <div className="flex justify-between items-start mb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{t.companyName || t.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500">{t.tenantId || t.id}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-extrabold uppercase">{t.status || 'Active'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.userCount || '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Users</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.expenseCount || '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Claims</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-100">{t.totalSpend ? `₹${t.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : '-'}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase">Spend</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Distribution Matrix */}
        <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col h-[300px]">
          <div className="shrink-0 mb-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-indigo-400" />
              Role Distribution Matrix
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">User population by access level</p>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Object.entries(roleCounts).map(([role, count], idx) => {
              const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
              const roleColors = {
                SuperAdmin: { bar: 'bg-indigo-500', text: 'text-indigo-400', icon: '🛡️' },
                CompanyAdmin: { bar: 'bg-purple-500', text: 'text-purple-400', icon: '🏢' },
                Manager: { bar: 'bg-blue-500', text: 'text-blue-400', icon: '👔' },
                Employee: { bar: 'bg-emerald-500', text: 'text-emerald-400', icon: '👤' },
                'Finance Team': { bar: 'bg-amber-500', text: 'text-amber-400', icon: '💰' },
                Auditor: { bar: 'bg-rose-500', text: 'text-rose-400', icon: '🔍' }
              };
              const color = roleColors[role] || { bar: 'bg-slate-500', text: 'text-slate-400', icon: '•' };

              return (
                <div key={role} className="bg-slate-950/30 p-3 rounded-xl border border-white/[0.02]">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span>{color.icon}</span> {role}
                    </span>
                    <span className={`font-mono font-bold ${color.text}`}>{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${color.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Users per Company Chart */}
        <div className="h-[300px]">
          <GenericBarChart
            title="Users per Company"
            subtitle="Top companies by registered user base"
            data={topCompaniesByUsers}
            yAxisLabel="Total Users"
          />
        </div>
      </div>
    </div>
  );
};
