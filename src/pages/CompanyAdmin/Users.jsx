import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { UsersTab } from './UsersTab';

export const Users = () => {
  const { currentUser, registerUser, users, showToast } = useAppState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Staff');
  const [reportingManager, setReportingManager] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expenseLimit, setExpenseLimit] = useState('');
  const [expenseApprover, setExpenseApprover] = useState('');
  const [travelApprovalRequired, setTravelApprovalRequired] = useState(false);
  const [status, setStatus] = useState('Active');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);

  const tenantUsers = users.filter(u => u.tenantId === currentUser?.tenantId);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmployeeId('');
    setEmail('');
    setPhone('');
    setProfilePhoto('');
    setRole('Employee');
    setDepartment('Engineering');
    setDesignation('Staff');
    setReportingManager('');
    setJoiningDate('');
    setEmploymentType('Full Time');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setExpenseLimit('');
    setExpenseApprover('');
    setTravelApprovalRequired(false);
    setStatus('Active');
    setForcePasswordChange(false);
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !employeeId.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const res = registerUser(
      fullName,
      email,
      password,
      role,
      currentUser.tenantId,
      department,
      username,
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
      forcePasswordChange
    );

    if (res.success) {
      resetForm();
    }
  };

  return (
    <UsersTab
      tenantUsers={tenantUsers}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      employeeId={employeeId}
      setEmployeeId={setEmployeeId}
      email={email}
      setEmail={setEmail}
      phone={phone}
      setPhone={setPhone}
      profilePhoto={profilePhoto}
      setProfilePhoto={setProfilePhoto}
      role={role}
      setRole={setRole}
      department={department}
      setDepartment={setDepartment}
      designation={designation}
      setDesignation={setDesignation}
      reportingManager={reportingManager}
      setReportingManager={setReportingManager}
      joiningDate={joiningDate}
      setJoiningDate={setJoiningDate}
      employmentType={employmentType}
      setEmploymentType={setEmploymentType}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      expenseLimit={expenseLimit}
      setExpenseLimit={setExpenseLimit}
      expenseApprover={expenseApprover}
      setExpenseApprover={setExpenseApprover}
      travelApprovalRequired={travelApprovalRequired}
      setTravelApprovalRequired={setTravelApprovalRequired}
      status={status}
      setStatus={setStatus}
      forcePasswordChange={forcePasswordChange}
      setForcePasswordChange={setForcePasswordChange}
      handleRegisterUser={handleRegisterUser}
      resetForm={resetForm}
    />
  );
};
