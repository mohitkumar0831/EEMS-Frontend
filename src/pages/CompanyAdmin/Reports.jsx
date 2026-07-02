import React from 'react';
import { useAppState } from '../../context/StateContext';
import { ReportsTab } from './ReportsTab';

export const Reports = () => {
  const { currentUser, users, expenses } = useAppState();

  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);
  const tenantExpenses = expenses.filter(exp => exp.tenantId === currentUser?.tenantId);

  return <ReportsTab tenantUsers={tenantUsers} tenantExpenses={tenantExpenses} />;
};
