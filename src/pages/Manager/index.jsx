import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ClipboardList, Plane, Users, BarChart2 } from 'lucide-react';

export const Manager = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'overview', label: 'Approvals Dashboard', icon: BarChart2, path: 'overview' },
    { id: 'expenses', label: 'Expense Approvals', icon: ClipboardList, path: 'expenses' },
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
