import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
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
  FileText
} from 'lucide-react';

export const Overview = () => {
  const navigate = useNavigate();
  const { currentUser, expenses, travelRequests, users } = useAppState();

  const companyExpenses = expenses.filter(e => e.tenantId === currentUser?.tenantId);
  const companyTravel = travelRequests.filter(t => t.tenantId === currentUser?.tenantId);
  const companyUsers = users.filter(u => u.tenantId === currentUser?.tenantId);
  
  // Filter for team members in the same department (excluding the manager themselves)
  const teamMembers = companyUsers.filter(u => u.department === currentUser?.department && u.role === 'Employee');
  const teamMemberIds = teamMembers.map(m => m.id);
  
  // Pending approvals
  const pendingExpenses = companyExpenses.filter(e => teamMemberIds.includes(e.employeeId) && (e.status === 'Pending' || e.status === 'Under Review'));
  const pendingTravel = companyTravel.filter(t => teamMemberIds.includes(t.employeeId) && t.status === 'Pending');
  
  // Budget utilization (Approved & Paid claims)
  const budgetUtilized = companyExpenses
    .filter(e => teamMemberIds.includes(e.employeeId) && (e.status === 'Approved' || e.status === 'Paid'))
    .reduce((sum, e) => sum + e.amount, 0);

  // Category wise department spend breakdown
  const categorySpend = companyExpenses
    .filter(e => teamMemberIds.includes(e.employeeId) && (e.status === 'Approved' || e.status === 'Paid'))
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

  const totalSpent = Object.values(categorySpend).reduce((sum, val) => sum + val, 0) || 1; // Avoid divide by zero

  const categoryDetails = Object.entries(categorySpend).map(([cat, amount]) => {
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
            <span className="text-3xl font-extrabold text-slate-100">{pendingExpenses.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Travel */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Travel Plans</span>
            <span className="text-3xl font-extrabold text-slate-100">{pendingTravel.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        {/* Department Staff */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department Staff</span>
            <span className="text-3xl font-extrabold text-slate-100">{teamMembers.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Approved Spend</span>
            <span className="text-3xl font-extrabold text-slate-100">₹{budgetUtilized.toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Interactive Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (2/3 width on desktop): Approval Queues */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Expenses Queue Card */}
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Immediate Expense Queue</h4>
                <p className="text-xs text-slate-500 mt-1">Pending claims submitted by your department employees.</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard/manager/expenses')}
                className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Go to Review Board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {pendingExpenses.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
                <p className="text-slate-500 text-xs">Hurray! No pending expense claims to approve.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingExpenses.map(exp => (
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
                      <span className="text-[10px] text-slate-500">By {exp.employeeName} • {exp.category} • {exp.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                      <button
                        onClick={() => navigate('/dashboard/manager/expenses')}
                        className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Requests Queue Card */}
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Travel Authorization Queue</h4>
                <p className="text-xs text-slate-500 mt-1">Pending travel plans requiring manager approval.</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard/manager/travel')}
                className="text-[10px] font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Go to Travel Board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {pendingTravel.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/10">
                <p className="text-slate-500 text-xs">No pending travel plans to authorize.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingTravel.map(travel => (
                  <div key={travel.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-slate-950/20 hover:border-slate-800 transition-colors">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate">{travel.purpose}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        By {travel.employeeName} • <MapPin className="w-3 h-3 text-slate-600 inline shrink-0" /> {travel.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-100">₹{travel.estimatedCost?.toFixed(2)}</span>
                      <button
                        onClick={() => navigate('/dashboard/manager/travel')}
                        className="p-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/10 cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Spend analysis & Staff overview */}
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Department Spend Breakdown */}
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

          {/* Card 2: Team Roster Overview */}
          <div className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="border-b border-white/5 pb-3">
              <h4 className="text-sm font-bold text-slate-200">Department Roster</h4>
              <p className="text-xs text-slate-500 mt-1">Direct reports in {currentUser?.department || 'Department'}.</p>
            </div>

            {teamMembers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No direct reports found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-white/5 rounded-2xl hover:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-200 truncate">{member.name}</span>
                        <span className="text-[10px] text-slate-500 truncate mt-0.5">{member.email}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-lg shrink-0 uppercase tracking-wider">
                      Staff
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
