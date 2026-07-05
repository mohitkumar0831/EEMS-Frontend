import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { OverviewTab } from './OverviewTab';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';

export const Overview = () => {
  const { currentUser, showToast } = useAppState();
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.tenantSlug) return;
      setIsLoading(true);
      try {
        const [metricsRes, usersRes] = await Promise.all([
          fetch(EXPENSE_ENDPOINTS.GET_ADMIN_DASHBOARD(currentUser.tenantSlug), {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          }),
          fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
          })
        ]);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setDashboardMetrics(metricsData.data);
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setTenantUsers(usersData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        showToast('Failed to load dashboard metrics', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (isLoading || !dashboardMetrics) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading dashboard metrics...
      </div>
    );
  }

  // Calculate department data by merging employeeSpend with tenantUsers
  const departmentData = {};
  if (dashboardMetrics.employeeSpend) {
    Object.entries(dashboardMetrics.employeeSpend).forEach(([empId, amount]) => {
      const user = tenantUsers.find(u => u.id === empId || u._id === empId) || {};
      const dep = user.department || 'General';
      departmentData[dep] = (departmentData[dep] || 0) + amount;
    });
  }

  const totalEmployees = tenantUsers.filter(u => u.role === 'employee').length;
  const totalManagers = tenantUsers.filter(u => u.role === 'manager').length;

  return (
    <OverviewTab
      dashboardMetrics={dashboardMetrics}
      departmentData={departmentData}
      totalEmployees={totalEmployees}
      totalManagers={totalManagers}
      tenantUsers={tenantUsers}
    />
  );
};
