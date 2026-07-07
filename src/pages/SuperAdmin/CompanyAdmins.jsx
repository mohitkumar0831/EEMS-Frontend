import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { Users, Mail, Building, ShieldAlert } from 'lucide-react';
import { TENANT_ENDPOINTS } from '../../constants/apiConstants';

export const CompanyAdmins = () => {
  const { currentUser } = useAppState();
  const [adminsList, setAdminsList] = useState([]);

  useEffect(() => {
    const fetchCompanyAdmins = async () => {
      try {
        const response = await fetch(TENANT_ENDPOINTS.GET_COMPANY_ADMINS, {
          headers: {
            'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined
          }
        });
        const data = await response.json();
        if (data.success) {
          setAdminsList(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch company admins:', error);
      }
    };
    fetchCompanyAdmins();
  }, [currentUser]);

  return (
    <div className="flex flex-col gap-6">
      {/* Overview stats info */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Users className="w-4.5 h-4.5 text-indigo-400" />
          Company Administrators Directory
        </h3>
        <p className="text-slate-400 text-xs mt-1">Tenant admins responsible for workspace setup, workflow mapping, and corporate policies.</p>
      </div>

      {/* Directory Cards/Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Corporate Email</th>
                <th className="px-6 py-4">Assigned Tenant Company</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {adminsList.map((admin) => {
                return (
                  <tr key={admin.id} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4 font-semibold text-slate-200">{admin.name}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {admin.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{admin.department || 'Administration'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase text-[9px] tracking-wide">
                        {admin.role}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
