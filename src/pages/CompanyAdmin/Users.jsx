import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { UsersTab } from './UsersTab';

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
  const { currentUser, registerUser, users, showToast } = useAppState();
  const [formData, setFormData] = useState(initialFormState);

  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();

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

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.', 'error');
      return;
    }

    // Prepare role-specific extra data to save in StateContext
    let roleSpecificData = {};
    if (role === 'Employee') {
      roleSpecificData = {
        costCenter: extraData.costCenter,
        officeLocation: extraData.officeLocation,
        panNumber: extraData.panNumber,
        bankAccountNumber: extraData.bankAccountNumber,
        ifscCode: extraData.ifscCode
      };
    } else if (role === 'Manager') {
      roleSpecificData = {
        team: extraData.team,
        approvalLimit: extraData.approvalLimit,
        canApproveExpenses: extraData.canApproveExpenses,
        canRejectExpenses: extraData.canRejectExpenses
      };
    } else if (role === 'Finance Team') {
      roleSpecificData = {
        financeRole: extraData.financeRole,
        canProcessReimbursement: extraData.canProcessReimbursement,
        canExportReports: extraData.canExportReports,
        canManageExpenseCategories: extraData.canManageExpenseCategories,
        canViewAllExpenses: extraData.canViewAllExpenses
      };
    } else if (role === 'Auditor') {
      roleSpecificData = {
        auditType: extraData.auditType,
        canAuditExpenses: extraData.canAuditExpenses,
        canDownloadReports: extraData.canDownloadReports,
        canViewExpenseHistory: extraData.canViewExpenseHistory,
        auditRegion: extraData.auditRegion
      };
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    // We are going to pass extraData at the end of the argument list for registerUser
    const res = registerUser(
      fullName,
      email,
      password,
      role,
      currentUser.tenantId,
      department,
      username || email.split('@')[0], // if username is empty, fallback to email prefix
      employeeId,
      phone,
      profilePhoto,
      designation,
      reportingManager,
      joiningDate,
      employmentType,
      expenseLimit,
      expenseApprover,
      travelApprovalRequired,
      status,
      forcePasswordChange,
      roleSpecificData
    );

    if (res.success) {
      resetForm();
    }
  };

  return (
    <UsersTab
      tenantUsers={tenantUsers}
      formData={formData}
      handleChange={handleChange}
      handleRegisterUser={handleRegisterUser}
      resetForm={resetForm}
    />
  );
};
