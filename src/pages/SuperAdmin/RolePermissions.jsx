import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { ShieldAlert, CheckSquare, Square, Save, RefreshCw } from 'lucide-react';

export const RolePermissions = () => {
  const { showToast } = useAppState();
  const [matrix, setMatrix] = useState({
    SuperAdmin: { provision: true, editTiers: true, modifyGlobal: true, viewReports: true, viewLogs: true },
    CompanyAdmin: { provision: false, editTiers: false, modifyGlobal: false, viewReports: true, viewLogs: false },
    Manager: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
    FinanceTeam: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
    Employee: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
    Auditor: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: true }
  });

  const handleToggle = (role, permission) => {
    if (role === 'SuperAdmin') {
      showToast('SuperAdmin root permissions cannot be revoked!', 'warning');
      return;
    }
    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
  };

  const handleSave = () => {
    showToast('Role permissions security matrix updated successfully!', 'success');
  };

  const handleReset = () => {
    setMatrix({
      SuperAdmin: { provision: true, editTiers: true, modifyGlobal: true, viewReports: true, viewLogs: true },
      CompanyAdmin: { provision: false, editTiers: false, modifyGlobal: false, viewReports: true, viewLogs: false },
      Manager: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
      FinanceTeam: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
      Employee: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: false },
      Auditor: { provision: false, editTiers: false, modifyGlobal: false, viewReports: false, viewLogs: true }
    });
    showToast('Permission matrix reverted to default definitions.', 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Overview header */}
      <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-indigo-400" />
            Platform Role Access Control Matrix
          </h3>
          <p className="text-slate-400 text-xs mt-1">Configure global capabilities and function gates for corporate workspace roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            Save Matrix Changes
          </button>
        </div>
      </div>

      {/* Permissions Matrix grid */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-950/10">
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4 text-center">Tenant Provisioning</th>
                <th className="px-6 py-4 text-center">Subscription Editing</th>
                <th className="px-6 py-4 text-center">Global Config</th>
                <th className="px-6 py-4 text-center">View System Reports</th>
                <th className="px-6 py-4 text-center">Platform Audit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {Object.entries(matrix).map(([role, perms]) => (
                <tr key={role} className="transition-all hover:bg-white/[0.01]">
                  <td className="px-6 py-4 font-semibold text-slate-200 capitalize">
                    {role.replace(/([A-Z])/g, ' ₹1').trim()}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <button type="button" onClick={() => handleToggle(role, 'provision')} className="mx-auto text-slate-400 hover:text-slate-200 cursor-pointer">
                      {perms.provision ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 mx-auto text-slate-600" />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button type="button" onClick={() => handleToggle(role, 'editTiers')} className="mx-auto text-slate-400 hover:text-slate-200 cursor-pointer">
                      {perms.editTiers ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 mx-auto text-slate-600" />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button type="button" onClick={() => handleToggle(role, 'modifyGlobal')} className="mx-auto text-slate-400 hover:text-slate-200 cursor-pointer">
                      {perms.modifyGlobal ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 mx-auto text-slate-600" />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button type="button" onClick={() => handleToggle(role, 'viewReports')} className="mx-auto text-slate-400 hover:text-slate-200 cursor-pointer">
                      {perms.viewReports ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 mx-auto text-slate-600" />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button type="button" onClick={() => handleToggle(role, 'viewLogs')} className="mx-auto text-slate-400 hover:text-slate-200 cursor-pointer">
                      {perms.viewLogs ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 mx-auto text-slate-600" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
