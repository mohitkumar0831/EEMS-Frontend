import React, { useState } from 'react';
import {
  Search,
  Filter,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  Users,
  Receipt,
  Download,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsTab = ({ tenantUsers, tenantExpenses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

  // Filter users to only employees or anyone who has expenses
  const employees = tenantUsers.filter(u => u.role === 'Employee' || tenantExpenses.some(e => e.employeeId === u.id));

  // Get list of departments for filter
  const departments = ['All', ...new Set(employees.map(u => u.department || 'General'))];

  // Helper to generate deterministic employee ID if missing
  const getEmpId = (emp) => {
    if (emp.employeeId) return emp.employeeId;
    const suffix = emp.id.includes('-') ? emp.id.split('-').pop().toUpperCase() : emp.id.toUpperCase();
    return `EMP-${suffix}`;
  };

  // Helper to generate deterministic phone number if missing
  const getPhone = (emp) => {
    if (emp.phone) return emp.phone;
    const lastChar = emp.id.charCodeAt(emp.id.length - 1) || 0;
    const mid = (lastChar % 900) + 100;
    const end = (lastChar * 17) % 10000;
    const paddedEnd = String(end).padStart(4, '0');
    return `+1 (555) ${mid}-${paddedEnd}`;
  };

  // Calculate stats for each employee
  const employeeReportData = employees.map(emp => {
    const empExpenses = tenantExpenses.filter(e => e.employeeId === emp.id);
    const approvedSpend = empExpenses
      .filter(e => e.status === 'Approved' || e.status === 'Paid')
      .reduce((sum, e) => sum + e.amount, 0);
    const pendingSpend = empExpenses
      .filter(e => e.status === 'Pending' || e.status === 'Under Review')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalClaimsCount = empExpenses.length;

    return {
      user: emp,
      empId: getEmpId(emp),
      phone: getPhone(emp),
      approvedSpend,
      pendingSpend,
      totalClaimsCount,
      expenses: empExpenses
    };
  });

  // Filter report data based on search and department
  const filteredReportData = employeeReportData.filter(item => {
    const matchesSearch =
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || (item.user.department || 'General') === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Global calculations
  const totalApprovedCompanySpend = employeeReportData.reduce((sum, item) => sum + item.approvedSpend, 0);
  const totalPendingCompanySpend = employeeReportData.reduce((sum, item) => sum + item.pendingSpend, 0);
  const totalActiveClaimsCount = tenantExpenses.length;
  const averageSpendPerEmployee = employees.length ? totalApprovedCompanySpend / employees.length : 0;

  const toggleRow = (empId) => {
    if (expandedEmployeeId === empId) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(empId);
    }
  };

  const handleExportCSV = () => {
    // Build CSV header
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Phone',
      'Department',
      'Role',
      'Total Claims',
      'Approved Spend (₹)',
      'Pending Spend (₹)',
      'Expense Title',
      'Expense Category',
      'Expense Amount (₹)',
      'Expense Status',
      'Expense Date'
    ];

    const rows = [];

    filteredReportData.forEach(item => {
      if (item.expenses.length === 0) {
        // Employee with no expenses — still include one row
        rows.push([
          item.empId,
          item.user.name,
          item.user.email,
          item.phone,
          item.user.department || 'General',
          item.user.role,
          0,
          item.approvedSpend.toFixed(2),
          item.pendingSpend.toFixed(2),
          '', '', '', '', ''
        ]);
      } else {
        item.expenses.forEach((exp, idx) => {
          rows.push([
            // Only repeat employee info on first expense row
            idx === 0 ? item.empId : '',
            idx === 0 ? item.user.name : '',
            idx === 0 ? item.user.email : '',
            idx === 0 ? item.phone : '',
            idx === 0 ? (item.user.department || 'General') : '',
            idx === 0 ? item.user.role : '',
            idx === 0 ? item.expenses.length : '',
            idx === 0 ? item.approvedSpend.toFixed(2) : '',
            idx === 0 ? item.pendingSpend.toFixed(2) : '',
            exp.title,
            exp.category,
            exp.amount.toFixed(2),
            exp.status,
            exp.date
          ]);
        });
      }
    });

    // Escape commas/quotes in cell values
    const escape = (val) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map(row => row.map(escape).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Employee_Spend_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Employee Spend Report</h3>
          <p className="text-slate-400 text-xs mt-1">
            Comprehensive audit report listing employee profiles, contact details, and their associated spending limits and claims.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:border-indigo-500/30 rounded-xl text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer self-start md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Export Report (.CSV)
        </button>
      </div>

      {/* Spend Stat Cards */}
      <div className="flex xl:grid xl:grid-cols-4 gap-4 overflow-x-auto xl:overflow-visible pb-3 xl:pb-0 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Total Approved Spend */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl min-w-[220px] xl:min-w-0 flex items-center justify-between gap-3 shrink-0 xl:shrink hover:border-indigo-500/20 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">Total Approved Spend</span>
            <span className="text-2xl font-bold text-slate-100 block mt-1.5">₹{totalApprovedCompanySpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Pending Audit */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl min-w-[220px] xl:min-w-0 flex items-center justify-between gap-3 shrink-0 xl:shrink hover:border-indigo-500/20 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">Pending Disbursements</span>
            <span className="text-2xl font-bold text-slate-100 block mt-1.5">₹{totalPendingCompanySpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-300 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Spend Per Employee */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl min-w-[220px] xl:min-w-0 flex items-center justify-between gap-3 shrink-0 xl:shrink hover:border-indigo-500/20 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">Average Spend / Employee</span>
            <span className="text-2xl font-bold text-slate-100 block mt-1.5">₹{averageSpendPerEmployee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-300 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Claims Audited */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/10 shadow-xl min-w-[220px] xl:min-w-0 flex items-center justify-between gap-3 shrink-0 xl:shrink hover:border-indigo-500/20 transition-all duration-300">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">Total Expenses Submitted</span>
            <span className="text-2xl font-bold text-slate-100 block mt-1.5">{totalActiveClaimsCount} Claims</span>
          </div>
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-300 shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Spend Directory */}
      <div className="bg-slate-900/80 rounded-3xl border border-white/10 shadow-2xl p-6">

        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Employee Spend Directory</h4>
            <p className="text-xs text-slate-500 mt-1">Audit employee profiles, phone/email contact, and claim distributions.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="employee-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID, or email..."
                className="w-full sm:w-64 bg-slate-950/40 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-slate-600"
              />
            </div>

            {/* Department Filter */}
            <div className="relative flex items-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 mr-2" />
              <select
                id="dept-filter"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-slate-900 text-slate-300">{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-white/5">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Name & Department</th>
                <th className="px-4 py-3">Email & Phone</th>
                <th className="px-4 py-3 text-center">Submitted</th>
                <th className="px-4 py-3 text-right">Pending (₹)</th>
                <th className="px-4 py-3 text-right">Total Reimbursed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredReportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No employees matching the search query or department filter.
                  </td>
                </tr>
              ) : (
                filteredReportData.map(item => {
                  const isExpanded = expandedEmployeeId === item.user.id;
                  return (
                    <React.Fragment key={item.user.id}>
                      {/* Parent Row */}
                      <tr
                        onClick={() => toggleRow(item.user.id)}
                        className={`hover:bg-white/[0.02] cursor-pointer transition-colors border-l-2 ${isExpanded ? 'bg-indigo-500/5 border-indigo-500' : 'border-transparent'
                          }`}
                      >
                        <td className="px-4 py-4 text-center">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </td>

                        {/* Employee ID */}
                        <td className="px-4 py-4 font-mono font-medium text-slate-400">
                          {item.empId}
                        </td>

                        {/* Name & Dept */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-200">{item.user.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{item.user.department || 'General'}</span>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 text-[11px]">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              {item.user.email}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              {item.phone}
                            </span>
                          </div>
                        </td>

                        {/* Submitted Claims Count */}
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-white/5">
                            {item.totalClaimsCount} Claims
                          </span>
                        </td>

                        {/* Pending Spend */}
                        <td className="px-4 py-4 text-right font-semibold text-amber-400">
                          {item.pendingSpend > 0 ? `₹${item.pendingSpend.toFixed(2)}` : '—'}
                        </td>

                        {/* Reimbursed Spend */}
                        <td className="px-4 py-4 text-right font-bold text-slate-100">
                          ₹{item.approvedSpend.toFixed(2)}
                        </td>
                      </tr>

                      {/* Expandable Details Child Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/40">
                          <td colSpan={7} className="px-6 py-4 border-b border-white/5">
                            <div className="flex flex-col gap-4 animate-slide-in">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                                  Expense Entries Breakdown ({item.expenses.length} Total)
                                </span>
                              </div>

                              {item.expenses.length === 0 ? (
                                <p className="text-xs text-slate-500 italic py-2">No expenses registered for this employee.</p>
                              ) : (
                                <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-900/40">
                                  <table className="w-full text-left text-xs">
                                    <thead>
                                      <tr className="bg-slate-950/20 text-slate-400 text-[9px] uppercase tracking-wider font-bold border-b border-white/5">
                                        <th className="px-4 py-2.5">Date</th>
                                        <th className="px-4 py-2.5">Title</th>
                                        <th className="px-4 py-2.5">Category</th>
                                        <th className="px-4 py-2.5">Status</th>
                                        <th className="px-4 py-2.5 text-right">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-300">
                                      {item.expenses.map(exp => (
                                        <tr key={exp.id} className="hover:bg-white/[0.02]">
                                          <td className="px-4 py-2 text-slate-500 font-mono text-[10px]">{exp.date}</td>
                                          <td className="px-4 py-2 font-medium text-slate-200">{exp.title}</td>
                                          <td className="px-4 py-2">
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-800 text-slate-300 border border-white/5">
                                              {exp.category}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${exp.status === 'Paid' || exp.status === 'Approved'
                                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                              : exp.status === 'Pending'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                              }`}>
                                              {exp.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-right font-bold text-slate-100">₹{exp.amount.toFixed(2)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
