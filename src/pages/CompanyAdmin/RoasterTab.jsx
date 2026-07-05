import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { USER_ENDPOINTS } from '../../constants/apiConstants';
import { Users, UserCheck, ShieldCheck, User } from 'lucide-react';

const selectCls =
  'w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all cursor-pointer';

export const RoasterTab = () => {
  const { currentUser, showToast } = useAppState();
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Keep track of assignments locally for optimistic updates
  const [assignments, setAssignments] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (data.success) {
        const users = data.data;
        const emps = users.filter(u => u.role === 'employee');
        const mgrs = users.filter(u => u.role === 'manager');
        setEmployees(emps);
        setManagers(mgrs);

        const initialAssignments = {};
        emps.forEach(emp => {
          if (emp.reportingManager) {
            initialAssignments[emp._id] = emp.reportingManager;
          }
        });
        setAssignments(initialAssignments);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.tenantSlug) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleAssign = async (employeeId, managerId) => {
    const prevManagerId = assignments[employeeId];
    
    // Optimistic update
    setAssignments(prev => ({ ...prev, [employeeId]: managerId }));
    
    try {
      const res = await fetch(USER_ENDPOINTS.ASSIGN_MANAGER(currentUser.tenantSlug, employeeId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ managerId: managerId || null })
      });
      
      const data = await res.json();
      if (data.success) {
        showToast('Manager assigned successfully', 'success');
      } else {
        // Revert on failure
        setAssignments(prev => ({ ...prev, [employeeId]: prevManagerId }));
        showToast(data.message || 'Failed to assign manager', 'error');
      }
    } catch (error) {
      console.error(error);
      setAssignments(prev => ({ ...prev, [employeeId]: prevManagerId }));
      showToast('Error assigning manager', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Title */}
      <div className="px-1">
        <h3 className="text-xl font-bold text-slate-100">Roaster Assignments</h3>
        <p className="text-slate-500 text-xs mt-1">Assign employees to their reporting managers.</p>
      </div>

      <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl w-full">
        {loading ? (
          <div className="text-center text-slate-500 py-10 text-sm">Loading users...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {employees.length === 0 ? (
              <div className="text-center text-slate-500 py-10 text-sm bg-slate-950/20 rounded-2xl border border-white/5">
                No employees found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 px-4 font-bold">Employee</th>
                      <th className="pb-3 px-4 font-bold">Department</th>
                      <th className="pb-3 px-4 font-bold">Reporting Manager</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {employees.map(emp => (
                      <tr key={emp._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-200">{emp.firstName} {emp.lastName}</span>
                              <span className="text-[10px] text-slate-500">{emp.email} • {emp.employeeId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-xs">
                          {emp.department} <br/>
                          <span className="text-[10px] text-slate-500">{emp.designation}</span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={assignments[emp._id] || ''}
                            onChange={(e) => handleAssign(emp._id, e.target.value)}
                            className={selectCls}
                          >
                            <option value="">-- No Manager Assigned --</option>
                            {managers.map(mgr => (
                              <option key={mgr._id} value={mgr._id}>
                                {mgr.firstName} {mgr.lastName} ({mgr.department})
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
