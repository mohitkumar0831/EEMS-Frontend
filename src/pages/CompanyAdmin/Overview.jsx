import React from 'react';
import { useAppState } from '../../context/StateContext';
import { OverviewTab } from './OverviewTab';

export const Overview = () => {
  const { currentUser, users, policies, expenses } = useAppState();

  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);
  const tenantExpenses = expenses.filter(exp => exp.tenantId === currentUser?.tenantId);
  const tenantPolicies = policies.filter(p => p.tenantId === currentUser?.tenantId);

  const totalEmployees = tenantUsers.filter(u => u.role === 'Employee').length;
  const totalManagers = tenantUsers.filter(u => u.role === 'Manager').length;
  const pendingClaims = tenantExpenses.filter(e => e.status === 'Pending' || e.status === 'Under Review').length;
  const totalSpend = tenantExpenses.filter(e => e.status === 'Approved' || e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);

  return (
    <OverviewTab
      totalEmployees={totalEmployees}
      totalManagers={totalManagers}
      pendingClaims={pendingClaims}
      totalSpend={totalSpend}
      tenantPolicies={tenantPolicies}
    />
  );
};
