import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { USER_ENDPOINTS } from '../../constants/apiConstants';
import { User } from 'lucide-react';
import { PageSkeleton } from '../../components/PageSkeleton';

export const Team = () => {
  const { currentUser, showToast } = useAppState();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(USER_ENDPOINTS.GET_MANAGER_EMPLOYEES(currentUser.tenantSlug, currentUser.id), {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setTeamMembers(data.data);
        } else {
          showToast(data.message || 'Failed to fetch team members', 'error');
        }
      } catch (error) {
        console.error('Error fetching team:', error);
        showToast('Error loading team', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.tenantSlug && currentUser?.id) {
      fetchTeam();
    }
  }, [currentUser]);

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-slate-200">My Team Members</h3>
        <span className="text-[10px] text-indigo-400 font-bold uppercase mt-1 block">Employees Reporting to You</span>
      </div>
      
      {loading ? (
        <PageSkeleton />
      ) : teamMembers.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">No employees are currently assigned to you.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department Space</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {teamMembers.map(member => (
                <tr key={member._id} className="hover:bg-white/[0.01] transition-all text-slate-300">
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span>{member.firstName} {member.lastName}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{member.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{member.email}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {member.department}
                    <div className="text-[10px] text-slate-500 mt-0.5">{member.designation}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 capitalize">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
