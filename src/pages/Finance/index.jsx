import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { CreditCard, Wallet, AlertTriangle, BarChart2 } from 'lucide-react';

export const Finance = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'overview', label: 'Finance Dashboard', icon: BarChart2, path: 'overview' },
    { id: 'process', label: 'Expense Processing', icon: CreditCard, path: 'process' },
    // { id: 'violations', label: 'Policy Violations', icon: AlertTriangle, path: 'violations' },
    { id: 'history', label: 'Payment History', icon: Wallet, path: 'history' }
  ];

  if (!currentUser) return null;

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
