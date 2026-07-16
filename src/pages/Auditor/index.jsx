import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ShieldCheck, ClipboardList, Activity, ArrowDownToLine, FileSpreadsheet, Wallet, BookOpen } from 'lucide-react';

export const Auditor = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: ShieldCheck, path: 'overview' },
    { id: 'expenses', label: 'Expense Auditing', icon: ClipboardList, path: 'expenses' },
    { id: 'policies', label: 'Company Policies', icon: BookOpen, path: 'policies' },
    { id: 'file-claim', label: 'File Expense Claim', icon: FileSpreadsheet, path: 'file-claim' },
    { id: 'reimbursements', label: 'My Reimbursements', icon: Wallet, path: 'reimbursements' },
    // { id: 'activity', label: 'Activity Logs', icon: Activity, path: 'activity' },
    // { id: 'export', label: 'Export Reports', icon: ArrowDownToLine, path: 'export' }
  ];

  if (!currentUser) return null;

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
