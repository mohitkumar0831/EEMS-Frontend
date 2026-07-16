import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, UserCheck, Briefcase, Building2, Tags, Settings, ShieldCheck, Layers, FileText, Bell, ClipboardList, DollarSign, MapPin, CreditCard } from 'lucide-react';

export const CompanyAdmin = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Layers, path: 'overview' },
    { id: 'employees', label: 'Users', icon: Users, path: 'employees' },
    { id: 'roaster', label: 'Roaster', icon: UserCheck, path: 'roaster' },
    // { id: 'finance-team', label: 'Finance Team', icon: Briefcase, path: 'finance-team' },
    // { id: 'departments', label: 'Departments', icon: Building2, path: 'departments' },
    // { id: 'expense-categories', label: 'Expense Categories', icon: Tags, path: 'expense-categories' },
    { id: 'policies', label: 'Company Policies', icon: Settings, path: 'policies' },
    // { id: 'workflows', label: 'Approval Workflow', icon: ShieldCheck, path: 'workflows' },
    { id: 'expenses', label: 'Expense Approval', icon: DollarSign, path: 'expenses' },
    // { id: 'travel-requests', label: 'Travel Requests', icon: MapPin, path: 'travel-requests' },
    // { id: 'reimbursements', label: 'Reimbursements', icon: ClipboardList, path: 'reimbursements' },
    { id: 'billing', label: 'Billing & Subscription', icon: CreditCard, path: 'billing' },
    { id: 'reports', label: 'Reports', icon: FileText, path: 'reports' },
    // { id: 'notifications', label: 'Notifications', icon: Bell, path: 'notifications' }
  ];

  if (!currentUser) return null;

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
