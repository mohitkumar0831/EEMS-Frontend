import React from 'react';
import { useAppState } from '../../context/StateContext';
import { OverviewTab } from './OverviewTab';

export const Overview = () => {
  const { tenants, users, policies, expenses, travelRequests, auditLogs } = useAppState();

  return (
    <OverviewTab
      tenants={tenants}
      users={users}
      policies={policies}
      expenses={expenses}
      travelRequests={travelRequests}
      auditLogs={auditLogs}
    />
  );
};
