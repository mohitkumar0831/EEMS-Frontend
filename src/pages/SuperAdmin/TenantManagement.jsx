import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { TenantManagementTab } from './TenantManagementTab';

const initialTenantForm = {
  companyName: '',
  companyCode: '',
  industry: '',
  companyRegistrationNumber: '',
  gstNumber: '',
  companyWebsite: '',
  companyEmail: '',
  companyPhone: '',
  employeeCapacity: '',
  branchCapacity: '',
  storageLimit: '',
  monthlyExpenseLimit: '',
  subscriptionPlan: 'Basic',
  planStartDate: '',
  planExpiryDate: '',
  billingCycle: 'Monthly',
  subscriptionStatus: 'Trial',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  temporaryPassword: '',
  timeZone: '',
  currency: 'USD',
  dateFormat: 'DD/MM/YYYY',
  language: 'English',
  financialYearStart: '',
  companyStatus: 'Active',
  emailVerified: 'No',
  tenantId: '',
  createdDate: ''
};

export const TenantManagement = () => {
  const { tenants, users, createTenant } = useAppState();
  const [formData, setFormData] = useState(initialTenantForm);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTenant = (e) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.companyCode.trim() || !formData.companyEmail.trim()) {
      return;
    }

    const success = createTenant(formData);
    if (success) {
      setFormData(initialTenantForm);
      setIsFormOpen(false);
    }
  };

  return (
    <TenantManagementTab
      tenants={tenants}
      users={users}
      formData={formData}
      handleFormChange={handleFormChange}
      handleCreateTenant={handleCreateTenant}
      isFormOpen={isFormOpen}
      setIsFormOpen={setIsFormOpen}
    />
  );
};
