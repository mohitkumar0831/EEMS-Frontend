import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { TenantManagementTab } from './TenantManagementTab';
import { TENANT_ENDPOINTS } from '../../constants/apiConstants';

const initialTenantForm = {
  companyName: '',
  companyCode: '',
  industry: 'Technology',
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
  country: 'United States',
  postalCode: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  temporaryPassword: '',
  timeZone: 'UTC',
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
  const { createTenant, showToast, currentUser } = useAppState();
  const [formData, setFormData] = useState(initialTenantForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tenantsSummary, setTenantsSummary] = useState([]);

  React.useEffect(() => {
    const fetchTenantsSummary = async () => {
      try {
        const res = await fetch(`${TENANT_ENDPOINTS.GET_ALL}/summary`, {
          headers: {
            'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined
          }
        });
        const data = await res.json();
        if (data.success) {
          setTenantsSummary(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tenants summary:', error);
      }
    };
    fetchTenantsSummary();
  }, [currentUser]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.companyCode.trim() || !formData.companyEmail.trim() || !formData.adminName.trim() || !formData.adminEmail.trim()) {
      showToast('Required fields are missing (Company Name, Code, Email, Admin Name, Admin Email)', 'error');
      return;
    }

    try {
      const payload = {
        companyName: formData.companyName,
        companyCode: formData.companyCode,
        industryType: formData.industry || 'Technology',
        registrationNumber: formData.companyRegistrationNumber || undefined,
        gstNumber: formData.gstNumber || undefined,
        website: formData.companyWebsite || undefined,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone || undefined,

        employeeCapacity: Number(formData.employeeCapacity) || 0,
        branchCapacity: Number(formData.branchCapacity) || 0,
        storageLimitGb: Number(formData.storageLimit) || 0,
        monthlyExpenseLimit: Number(formData.monthlyExpenseLimit) || 0,

        subscriptionPlan: formData.subscriptionPlan,
        planStartDate: formData.planStartDate ? new Date(formData.planStartDate).toISOString() : new Date().toISOString(),
        planExpiryDate: formData.planExpiryDate ? new Date(formData.planExpiryDate).toISOString() : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        billingCycle: formData.billingCycle,
        subscriptionStatus: formData.subscriptionStatus,

        address: {
          line1: formData.addressLine1 || undefined,
          line2: formData.addressLine2 || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          country: formData.country || undefined,
          postalCode: formData.postalCode || undefined
        },

        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone || undefined,

        config: {
          timeZone: formData.timeZone || 'UTC',
          currency: formData.currency || 'USD',
          dateFormat: formData.dateFormat || 'DD/MM/YYYY',
          language: formData.language || 'English',
          financialYearStart: formData.financialYearStart || undefined
        }
      };

      const response = await fetch(TENANT_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you have a token stored in currentUser or localStorage, attach it here
          'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Tenant registered successfully!', 'success');
        setFormData(initialTenantForm);
        setIsFormOpen(false);
        // Optionally update the local context or trigger a refresh
        createTenant(formData);
      } else {
        console.error('Validation/Registration failed:', data);
        const errorMsg = data.details ? JSON.stringify(data.details) : (data.error || data.message || 'Tenant registration failed');
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Network error, please try again.', 'error');
    }
  };

  return (
    <TenantManagementTab
      tenantsSummary={tenantsSummary}
      formData={formData}
      handleFormChange={handleFormChange}
      handleCreateTenant={handleCreateTenant}
      isFormOpen={isFormOpen}
      setIsFormOpen={setIsFormOpen}
    />
  );
};
