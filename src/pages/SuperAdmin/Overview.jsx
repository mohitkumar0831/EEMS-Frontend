import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppState } from '../../context/StateContext';
import { OverviewTab } from './OverviewTab';
import { DASHBOARD_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';

export const Overview = () => {
  const { currentUser } = useAppState();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = currentUser?.token;
        const response = await axios.get(DASHBOARD_ENDPOINTS.SUPER_ADMIN, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <div className="flex h-full items-center justify-center p-8 text-red-400">{error}</div>;
  }

  return <OverviewTab stats={stats} />;
};
