import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppState } from '../../context/StateContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import {
  Globe,
  Building,
  Users,
  Settings,
  FileText,
  ShieldCheck,
  Activity,
  Bell,
  Sliders,
  ScrollText
} from 'lucide-react';

export const SuperAdmin = () => {
  const { currentUser } = useAppState();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Globe, path: 'overview' },
    {
      id: 'tenant-management',
      label: 'Tenant Management',
      icon: Building,
      subItems: [
        { id: 'companies', label: 'Companies', path: 'tenants/companies' },
        { id: 'plans', label: 'Subscription Plans', path: 'tenants/plans' },
        // { id: 'status', label: 'Tenant Status', path: 'tenants/status' }
      ]
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      subItems: [
        // { id: 'super-admins', label: 'Super Admins', path: 'users/superadmins' },
        { id: 'company-admins', label: 'Company Admins', path: 'users/companyadmins' }
      ]
    },
    // { id: 'roles', label: 'Role & Permission', icon: ShieldCheck, path: 'roles' },
    // { id: 'policies', label: 'Global Policies', icon: Settings, path: 'policies' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText, path: 'reports' },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText, path: 'auditlogs' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: 'notifications' },
    { id: 'settings', label: 'Settings', icon: Sliders, path: 'settings' }
  ];

  if (!currentUser) return null;

  return (
    <DashboardLayout menuItems={menuItems}>
      <Outlet />
    </DashboardLayout>
  );
};
