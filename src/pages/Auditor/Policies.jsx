import React from 'react';
import { useAppState } from '../../context/StateContext';
import { PoliciesTab } from '../CompanyAdmin/PoliciesTab';
import { BookOpen } from 'lucide-react';

export const AuditorPolicies = () => {
  const { currentUser, policies } = useAppState();

  const tenantPolicies = (policies || []).filter(p => {
    return p.tenantId === currentUser?.tenantId ||
      (p.tenantId === 'tenant-1' && (currentUser?.tenantId === 'tenant-1' || currentUser?.tenantSlug?.toLowerCase().includes('acme'))) ||
      (p.tenantId === 'tenant-2' && (currentUser?.tenantId === 'tenant-2' || currentUser?.tenantSlug?.toLowerCase().includes('stark')));
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400" />
          Company Spending Policies
        </h3>
        <p className="text-slate-400 text-xs">
          Review the active spending policy limits and guidelines defined by the Company Administrator.
        </p>
      </div>

      <PoliciesTab
        tenantPolicies={tenantPolicies}
        readOnly={true}
      />
    </div>
  );
};
