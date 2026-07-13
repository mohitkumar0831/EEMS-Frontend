import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { UsersTab } from './UsersTab';
import { USER_ENDPOINTS, BILLING_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';

const initialFormState = {
  firstName: '',
  lastName: '',
  employeeId: '',
  email: '',
  phone: '',
  profilePhoto: '',
  role: 'Employee',
  department: '',
  designation: '',
  reportingManager: '',
  joiningDate: '',
  employmentType: 'Permanent',
  username: '',
  password: '',
  confirmPassword: '',
  expenseLimit: '',
  expenseApprover: '',
  travelApprovalRequired: false,
  status: 'Active',
  forcePasswordChange: false,
  costCenter: '',
  officeLocation: '',
  panNumber: '',
  bankAccountNumber: '',
  ifscCode: '',
  team: '',
  approvalLimit: '',
  canApproveExpenses: false,
  canRejectExpenses: false,
  financeRole: 'Finance Executive',
  canProcessReimbursement: false,
  canExportReports: false,
  canManageExpenseCategories: false,
  canViewAllExpenses: false,
  auditType: 'Internal',
  canAuditExpenses: false,
  canDownloadReports: false,
  canViewExpenseHistory: false,
  auditRegion: ''
};

export const Users = () => {
  const { currentUser, showToast } = useAppState();
  const [formData, setFormData] = useState(initialFormState);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [planInfo, setPlanInfo] = useState(null); // { planName, userLimit, currentCount }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': currentUser?.token ? `Bearer ${currentUser.token}` : undefined,
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTenantUsers(data.data || []);
        return data.data || [];
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
    return [];
  };

  // Fetch subscription & plan info to enforce user limits
  const fetchPlanInfo = async (employees) => {
    try {
      const tenantId = currentUser?.tenantId;
      if (!tenantId) return;

      // Fetch subscription to get the plan
      const subRes = await fetch(BILLING_ENDPOINTS.GET_SUBSCRIPTION(tenantId), { headers });
      const subData = await subRes.json();

      if (subData.success && subData.data) {
        const subscription = subData.data;
        const planId = subscription.planId?._id || subscription.planId;

        // Fetch all plans to find the current plan's userLimit
        const plansRes = await fetch(BILLING_ENDPOINTS.GET_PLANS, { headers });
        const plansData = await plansRes.json();

        if (plansData.success && plansData.data) {
          const currentPlan = plansData.data.find(p => p._id === planId) || 
                              plansData.data.find(p => p.name === subscription.planName);
          if (currentPlan) {
            setPlanInfo({
              planName: currentPlan.name,
              userLimit: currentPlan.userLimit,
              currentCount: employees.length,
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch plan info:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.tenantSlug) {
      const init = async () => {
        const employees = await fetchEmployees();
        await fetchPlanInfo(employees);
      };
      init();
    }
  }, [currentUser]);

  // Update currentCount whenever tenantUsers changes
  useEffect(() => {
    if (planInfo) {
      setPlanInfo(prev => prev ? { ...prev, currentCount: tenantUsers.length } : null);
    }
  }, [tenantUsers.length]);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleChange = (field, value) => {
    let sanitizedValue = value;
    
    // Strict sanitization for names
    if (field === 'firstName' || field === 'lastName') {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    // Strict sanitization for phone (digits only, max 10)
    if (field === 'phone') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();

    // ── Plan-based user limit check (client-side) ───────────────────────────
    if (planInfo && planInfo.currentCount >= planInfo.userLimit) {
      showToast(
        `User limit reached! Your ${planInfo.planName} plan allows up to ${planInfo.userLimit} users. You currently have ${planInfo.currentCount} users. Please upgrade your plan.`,
        'error'
      );
      return;
    }

    const {
      firstName, lastName, employeeId, email, username, password, confirmPassword, role,
      department, phone, profilePhoto, designation, reportingManager, joiningDate,
      employmentType, expenseLimit, expenseApprover, travelApprovalRequired, status,
      forcePasswordChange, ...extraData
    } = formData;

    if (!firstName.trim() || !lastName.trim() || !employeeId.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      showToast('Name should only contain alphabets.', 'error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in)$/i;
    if (!emailRegex.test(email)) {
      showToast('Email must end with .com, .org, or .in', 'error');
      return;
    }

    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        showToast('Mobile number must be exactly 10 digits.', 'error');
        return;
      }
    }

    if (joiningDate) {
      const selectedDate = new Date(joiningDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        showToast('Joining date cannot be in the future.', 'error');
        return;
      }
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.', 'error');
      return;
    }

    // Map role enum
    const roleMapping = {
      'Employee': 'employee',
      'Manager': 'manager',
      'Finance Team': 'finance',
      'Auditor': 'auditor',
      'SuperAdmin': 'admin'
    };
    const mappedRole = roleMapping[role] || 'employee';

    // Map employmentType
    const employmentTypeMap = {
      'Permanent': 'full-time',
      'Contract': 'contract',
      'Intern': 'intern'
    };

    // Prepare role-specific extra data matching Joi schema
    let profile = {};
    if (mappedRole === 'employee') {
      profile = {
        reportingManager: extraData.reportingManager || undefined,
        expenseLimit: Number(extraData.expenseLimit) || 0,
        costCenter: extraData.costCenter || undefined,
        employmentType: employmentTypeMap[employmentType] || 'full-time',
        officeLocation: extraData.officeLocation || undefined,
        panNumber: extraData.panNumber || undefined,
        bankAccountNumber: extraData.bankAccountNumber || undefined,
        ifscCode: extraData.ifscCode || undefined
      };
    } else if (mappedRole === 'manager') {
      profile = {
        approvalLimit: Number(extraData.approvalLimit) || 0,
      };
    } else if (mappedRole === 'finance') {
      const financeRoleMap = {
        'Finance Executive': 'accountant',
        'Finance Manager': 'controller'
      };
      profile = {
        financeRole: financeRoleMap[extraData.financeRole] || 'accountant',
      };
    } else if (mappedRole === 'auditor') {
      profile = {
        auditType: extraData.auditType ? extraData.auditType.toLowerCase() : 'internal',
        auditRegion: extraData.auditRegion || undefined
      };
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      employeeId: employeeId.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone || undefined,
      department: department.trim(),
      designation: designation.trim(),
      joiningDate: joiningDate ? new Date(joiningDate).toISOString() : undefined,
      status: status.toLowerCase(),
      role: mappedRole,
      profilePhoto: profilePhoto.startsWith('http') ? profilePhoto : undefined,
      profile: Object.keys(profile).length > 0 ? profile : undefined
    };

    setIsLoading(true);
    try {
      const response = await fetch(USER_ENDPOINTS.REGISTER_EMPLOYEE(currentUser.tenantSlug), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        showToast('User created successfully!', 'success');
        resetForm();
        fetchEmployees();
      } else {
        console.error('Validation/Creation failed:', data);
        let errorMsg = data.message || 'User creation failed';
        if (data.errors && Array.isArray(data.errors)) {
          errorMsg = data.errors.map(err => err.message).join(' | ');
        } else if (data.details) {
          errorMsg = JSON.stringify(data.details);
        }
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Create employee error:', err);
      showToast('Network error, please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <UsersTab
      tenantUsers={tenantUsers}
      formData={formData}
      handleChange={handleChange}
      handleRegisterUser={handleRegisterUser}
      resetForm={resetForm}
      planInfo={planInfo}
    />
  );
};
