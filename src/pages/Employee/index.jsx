import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { LayoutDashboard, FileSpreadsheet, PlaneTakeoff, Wallet, BookOpen } from 'lucide-react';

export const Employee = () => {
  const menuItems = [
    { id: 'overview',         label: 'My Dashboard',       icon: LayoutDashboard, path: 'overview' },
    { id: 'file-claim',       label: 'File Expense Claim', icon: FileSpreadsheet, path: 'file-claim' },
    // { id: 'travel-req', label: 'Travel Request', icon: PlaneTakeoff, path: 'travel' },
    { id: 'reimbursements',   label: 'My Reimbursements',  icon: Wallet,          path: 'reimbursements' },
    { id: 'policy',           label: 'Expense Policy',     icon: BookOpen,        path: 'policy' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
