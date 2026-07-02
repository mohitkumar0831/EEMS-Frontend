import React from 'react';
import { useAppState } from '../../context/StateContext';
import { GlobalUsersTab } from './GlobalUsersTab';

export const GlobalUsers = () => {
  const { users, tenants } = useAppState();

  return <GlobalUsersTab users={users} tenants={tenants} />;
};
