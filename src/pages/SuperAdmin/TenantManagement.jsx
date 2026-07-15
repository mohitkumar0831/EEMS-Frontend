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
  timeZone: 'UTC',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  language: 'English',
  companyStatus: 'Active'
};

export const TenantManagement = () => {
  const { createTenant, showToast, currentUser } = useAppState();
  const [formData, setFormData] = useState(initialTenantForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tenantsSummary, setTenantsSummary] = useState([]);

  React.useEffect(() => {
    const fetchTenantsSummary = async () => {
      try {
        const res = await fetch(TENANT_ENDPOINTS.GET_ALL, {
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
          timeZone: formData.timeZone,
          currency: formData.currency,
          dateFormat: formData.dateFormat || 'DD/MM/YYYY',
          language: formData.language || 'English'
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

  const handlePauseResume = async (slug, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'Suspended' ? 'pause' : 'resume'} this tenant?`)) return;

    try {
      const response = await fetch(TENANT_ENDPOINTS.UPDATE_STATUS(slug), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (response.ok) {
        showToast(`Tenant ${newStatus === 'Suspended' ? 'paused' : 'resumed'} successfully`, 'success');
        setTenantsSummary(prev => prev.map(t => t.slug === slug ? { ...t, status: data.data.status } : t));
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Update status error:', error);
      showToast('Network error', 'error');
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) return;

    try {
      const response = await fetch(TENANT_ENDPOINTS.DELETE_TENANT(slug), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Tenant deleted successfully', 'success');
        setTenantsSummary(prev => prev.filter(t => t.slug !== slug));
      } else {
        showToast(data.message || 'Failed to delete tenant', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Network error', 'error');
    }
  };

  return (
    <TenantManagementTab
      tenantsSummary={tenantsSummary}
      formData={formData}
      handleFormChange={handleFormChange}
      handleCreateTenant={handleCreateTenant}
      handlePauseResume={handlePauseResume}
      handleDelete={handleDelete}
      isFormOpen={isFormOpen}
      setIsFormOpen={setIsFormOpen}
    />
  );
};
