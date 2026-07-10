import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ClipboardList, Plane, Users, BarChart2, FileSpreadsheet, Wallet } from 'lucide-react';

export const Manager = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart2, path: 'overview' },
    { id: 'expenses', label: 'Expense Approvals', icon: ClipboardList, path: 'expenses' },
    { id: 'file-claim', label: 'File Expense Claim', icon: FileSpreadsheet, path: 'file-claim' },
    { id: 'reimbursements', label: 'My Reimbursements', icon: Wallet, path: 'reimbursements' },
    // { id: 'travel', label: 'Travel Requests', icon: Plane, path: 'travel' },
    { id: 'team', label: 'Team Members', icon: Users, path: 'team' }
  ];

  if (!currentUser) return null;

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
