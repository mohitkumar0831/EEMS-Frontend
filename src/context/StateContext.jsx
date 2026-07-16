import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { POLICY_ENDPOINTS } from '../constants/apiConstants';

const StateContext = createContext();

// Pre-seeded database values
const DEFAULT_TENANTS = [
  { id: 'tenant-1', name: 'Acme Corp', createdAt: '2026-01-10T08:00:00Z' },
  { id: 'tenant-2', name: 'Stark Industries', createdAt: '2026-02-15T09:00:00Z' }
];

const DEFAULT_USERS = [
  { id: 'user-sa', name: 'Alex Platform Owner', email: 'superadmin@ems.com', password: 'password', role: 'SuperAdmin', tenantId: 'platform', department: 'Platform Operations' },

  // Acme Corp
  { id: 'user-ca1', name: 'Sarah Connor', email: 'admin@acme.com', password: 'password', role: 'CompanyAdmin', tenantId: 'tenant-1', department: 'Administration' },
  { id: 'user-m1', name: 'John Approver', email: 'manager@acme.com', password: 'password', role: 'Manager', tenantId: 'tenant-1', department: 'Engineering' },
  { id: 'user-m1b', name: 'Jane R&D Manager', email: 'rd-manager@acme.com', password: 'password', role: 'Manager', tenantId: 'tenant-1', department: 'R&D' },
  { id: 'user-e1', name: 'Alice Requester', email: 'employee@acme.com', password: 'password', role: 'Employee', tenantId: 'tenant-1', department: 'Engineering' },
  { id: 'user-f1', name: 'Bob Finance', email: 'finance@acme.com', password: 'password', role: 'Finance Team', tenantId: 'tenant-1', department: 'Finance' },
  { id: 'user-au1', name: 'Diana Auditor', email: 'auditor@acme.com', password: 'password', role: 'Auditor', tenantId: 'tenant-1', department: 'Compliance' },

  // Stark Industries
  { id: 'user-ca2', name: 'Pepper Potts', email: 'admin@stark.com', password: 'password', role: 'CompanyAdmin', tenantId: 'tenant-2', department: 'Executive Office' },
  { id: 'user-m2', name: 'Happy Hogan', email: 'manager@stark.com', password: 'password', role: 'Manager', tenantId: 'tenant-2', department: 'Security' },
  { id: 'user-e2', name: 'Peter Parker', email: 'employee@stark.com', password: 'password', role: 'Employee', tenantId: 'tenant-2', department: 'R&D' }
];

const DEFAULT_POLICIES = [
  { id: 'pol-1', tenantId: 'tenant-1', category: 'Meals', limit: 80, rule: 'Single meal limit' },
  { id: 'pol-2', tenantId: 'tenant-1', category: 'Travel', limit: 1200, rule: 'Flight limit' },
  { id: 'pol-3', tenantId: 'tenant-1', category: 'Equipment', limit: 500, rule: 'IT accessories limit' },
  { id: 'pol-4', tenantId: 'tenant-2', category: 'Meals', limit: 250, rule: 'Premium dining limit' },
  { id: 'pol-5', tenantId: 'tenant-2', category: 'Travel', limit: 5000, rule: 'Private jet cap' }
];

const DEFAULT_EXPENSES = [
  {
    id: 'exp-1',
    tenantId: 'tenant-1',
    employeeId: 'user-e1',
    employeeName: 'Alice Requester',
    employeeEmail: 'employee@acme.com',
    title: 'Client Dinner - Tech Project Kickoff',
    category: 'Meals',
    amount: 95.50,
    date: '2026-06-20',
    description: 'Dinner with client partners discussing project delivery timeline.',
    status: 'Pending',
    receipt: 'receipt_dinner.png',
    comments: [],
    auditTrail: [
      { action: 'Created Claim', user: 'Alice Requester', timestamp: '2026-06-20T14:32:00Z', details: 'Submitted meals claim of ₹95.50' }
    ]
  },
  {
    id: 'exp-2',
    tenantId: 'tenant-1',
    employeeId: 'user-e1',
    employeeName: 'Alice Requester',
    employeeEmail: 'employee@acme.com',
    title: 'Developer Summit Conference Pass',
    category: 'Equipment',
    amount: 450.00,
    date: '2026-06-18',
    description: 'Registration pass for developer summit.',
    status: 'Approved',
    receipt: 'receipt_ticket.pdf',
    comments: [{ author: 'John Approver', text: 'Approved. Essential for R&D training.', timestamp: '2026-06-19T09:12:00Z' }],
    auditTrail: [
      { action: 'Created Claim', user: 'Alice Requester', timestamp: '2026-06-18T10:05:00Z', details: 'Submitted equipment claim of ₹450.00' },
      { action: 'Approved by Manager', user: 'John Approver', timestamp: '2026-06-19T09:12:00Z', details: 'Approved: "Approved. Essential for R&D training."' }
    ]
  },
  {
    id: 'exp-3',
    tenantId: 'tenant-1',
    employeeId: 'user-e1',
    employeeName: 'Alice Requester',
    employeeEmail: 'employee@acme.com',
    title: 'Office Ergonomic Monitor',
    category: 'Equipment',
    amount: 580.00, // Exceeds limit (₹500)
    date: '2026-06-22',
    description: 'Ergonomic 4K screen for coding workstation.',
    status: 'Under Review',
    receipt: 'monitor_invoice.jpg',
    comments: [],
    auditTrail: [
      { action: 'Created Claim', user: 'Alice Requester', timestamp: '2026-06-22T08:44:00Z', details: 'Submitted claim of ₹580.00. Flagged: Exceeds category policy limit of ₹500.00' }
    ]
  }
];

const DEFAULT_TRAVEL = [
  {
    id: 'trv-1',
    tenantId: 'tenant-1',
    employeeId: 'user-e1',
    employeeName: 'Alice Requester',
    purpose: 'Onsite Client Architecture Meeting',
    destination: 'Chicago, IL',
    estimatedCost: 1100.00,
    mileage: 450,
    status: 'Pending',
    comments: [],
    createdAt: '2026-06-21T11:00:00Z'
  }
];

const DEFAULT_LOGS = [
  { id: 'log-1', tenantId: 'platform', action: 'System Initialized', user: 'System', timestamp: '2026-06-23T06:00:00Z', details: 'EMS system databases pre-populated with standard mock environments' }
];

export const StateProvider = ({ children }) => {
  const [tenants, setTenants] = useState(() => JSON.parse(localStorage.getItem('ems_tenants')) || DEFAULT_TENANTS);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('ems_users')) || DEFAULT_USERS);
  const [policies, setPolicies] = useState(() => JSON.parse(localStorage.getItem('ems_policies')) || DEFAULT_POLICIES);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('ems_expenses')) || DEFAULT_EXPENSES);
  const [travelRequests, setTravelRequests] = useState(() => JSON.parse(localStorage.getItem('ems_travel')) || DEFAULT_TRAVEL);
  const [auditLogs, setAuditLogs] = useState(() => JSON.parse(localStorage.getItem('ems_logs')) || DEFAULT_LOGS);

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('ems_current_user')) || null;
  });

  const [toasts, setToasts] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ems_tenants', JSON.stringify(tenants));
  }, [tenants]);
  useEffect(() => {
    localStorage.setItem('ems_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('ems_policies', JSON.stringify(policies));
  }, [policies]);

  const fetchPolicies = useCallback(async () => {
    if (!currentUser || !currentUser.tenantSlug || !currentUser.token) return;
    try {
      const res = await fetch(POLICY_ENDPOINTS.GET_ALL(currentUser.tenantSlug), {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      const json = await res.json();
      if (json.success && json.data) {
        const normalized = json.data.map(p => ({
          ...p,
          id: p._id || p.id,
          tenantId: currentUser.tenantId
        }));
        
        // Deduplicate locally by category to ensure UI is clean
        const unique = [];
        const seen = new Set();
        for (const p of normalized) {
          const catLower = p.category.toLowerCase();
          if (!seen.has(catLower)) {
            seen.add(catLower);
            unique.push(p);
          }
        }
        setPolicies(unique);
      }
    } catch (err) {
      console.error('Error fetching policies from API:', err);
    }
  }, [currentUser?.tenantSlug, currentUser?.token, currentUser?.tenantId]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);
  useEffect(() => {
    localStorage.setItem('ems_expenses', JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem('ems_travel', JSON.stringify(travelRequests));
  }, [travelRequests]);
  useEffect(() => {
    localStorage.setItem('ems_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('ems_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (action, details, tenantId = 'platform') => {
    const newLog = {
      id: 'log-' + Date.now(),
      tenantId: tenantId,
      user: currentUser ? currentUser.name : 'Guest/Anonymous',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (email, password) => {
    const userMatch = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (userMatch) {
      setCurrentUser(userMatch);
      showToast(`${userMatch.name}! Signed in as ${userMatch.role}.`, 'success');

      const userTenant = userMatch.tenantId === 'platform' ? 'Platform' : (tenants.find(t => t.id === userMatch.tenantId)?.name || 'Unknown Company');
      addAuditLog('User Login', `Logged in successfully from ${userTenant}`, userMatch.tenantId);
      return { success: true };
    }
    showToast('Invalid email or password.', 'error');
    return { success: false };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('User Logout', 'Signed out from session', currentUser.tenantId);
      setCurrentUser(null);
      showToast('Logged out successfully.', 'info');
    }
  };

  const registerUser = (
    name,
    email,
    password,
    role,
    tenantId,
    department = 'Engineering',
    username = '',
    employeeId = '',
    phone = '',
    profilePhoto = '',
    designation = '',
    reportingManager = '',
    joiningDate = '',
    employmentType = 'full-time',
    expenseApprover = '',
    travelApprovalRequired = false,
    status = 'Active',
    forcePasswordChange = false,
    extraData = {}
  ) => {
    // Check email uniqueness
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('Email address already registered.', 'error');
      return { success: false };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      username,
      password,
      role,
      tenantId,
      department,
      employeeId,
      phone,
      profilePhoto,
      designation,
      reportingManager,
      joiningDate,
      employmentType,
      expenseApprover,
      travelApprovalRequired,
      status,
      forcePasswordChange,
      ...extraData
    };

    setUsers((prev) => [...prev, newUser]);
    showToast(`Account successfully created for ${name}!`, 'success');
    addAuditLog('User Registered', `New ${role} created: ${name} (${email})`, tenantId);
    return { success: true };
  };

  // Super Admin actions
  const createTenant = (tenantData) => {
    const companyName = typeof tenantData === 'string' ? tenantData : tenantData.companyName;

    if (!companyName || !companyName.trim()) {
      showToast('Company name is required.', 'error');
      return false;
    }

    if (tenants.find(t => t.name.toLowerCase() === companyName.toLowerCase())) {
      showToast('Tenant company name already exists.', 'error');
      return false;
    }

    const tenantId = 'tenant-' + Date.now();
    const newTenant = {
      id: tenantId,
      name: companyName,
      createdAt: new Date().toISOString(),
      companyCode: tenantData.companyCode || '',
      industry: tenantData.industry || '',
      companyRegistrationNumber: tenantData.companyRegistrationNumber || '',
      gstNumber: tenantData.gstNumber || '',
      companyWebsite: tenantData.companyWebsite || '',
      companyEmail: tenantData.companyEmail || '',
      companyPhone: tenantData.companyPhone || '',
      employeeCapacity: tenantData.employeeCapacity || '',
      branchCapacity: tenantData.branchCapacity || '',
      storageLimit: tenantData.storageLimit || '',
      monthlyExpenseLimit: tenantData.monthlyExpenseLimit || '',
      subscriptionPlan: tenantData.subscriptionPlan || 'Basic',
      planStartDate: tenantData.planStartDate || '',
      planExpiryDate: tenantData.planExpiryDate || '',
      billingCycle: tenantData.billingCycle || 'Monthly',
      subscriptionStatus: tenantData.subscriptionStatus || 'Trial',
      addressLine1: tenantData.addressLine1 || '',
      addressLine2: tenantData.addressLine2 || '',
      city: tenantData.city || '',
      state: tenantData.state || '',
      country: tenantData.country || '',
      postalCode: tenantData.postalCode || '',
      adminName: tenantData.adminName || '',
      adminEmail: tenantData.adminEmail || '',
      adminPhone: tenantData.adminPhone || '',
      timeZone: tenantData.timeZone || '',
      currency: tenantData.currency || 'USD',
      dateFormat: tenantData.dateFormat || 'DD/MM/YYYY',
      language: tenantData.language || 'English',
      companyStatus: tenantData.companyStatus || 'Active',
      tenantId,
      createdDate: new Date().toISOString()
    };

    setTenants(prev => [...prev, newTenant]);

    const newPolicies = [
      { id: 'pol-' + Date.now() + '-1', tenantId, category: 'Meals', limit: 100, rule: 'Dining rules' },
      { id: 'pol-' + Date.now() + '-2', tenantId, category: 'Travel', limit: 1500, rule: 'Accommodation/Tickets limit' }
    ];
    setPolicies(prev => [...prev, ...newPolicies]);

    showToast(`Company "${companyName}" created successfully!`, 'success');
    addAuditLog('Tenant Created', `Created new tenant space: ${companyName}`, 'platform');
    return true;
  };

  // Company Admin actions
  const updateCompanyPolicy = async (policyId, limit, rule) => {
    if (!currentUser) return;

    // Fallback for local/mock mode
    if (!currentUser.tenantSlug || !currentUser.token) {
      const updatedPol = {
        id: policyId,
        tenantId: currentUser.tenantId,
        limit: parseFloat(limit),
        rule
      };
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, ...updatedPol } : p));
      showToast('Spending policy limit updated (Local Mode).', 'success');
      addAuditLog('Policy Updated', `Modified spending policy limit to ₹${limit}`, currentUser.tenantId);
      return;
    }

    try {
      const res = await fetch(POLICY_ENDPOINTS.UPDATE_BY_ID(currentUser.tenantSlug, policyId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          limit: parseFloat(limit),
          rule
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const updatedPol = {
          ...json.data,
          id: json.data._id || json.data.id,
          tenantId: currentUser.tenantId
        };
        setPolicies(prev => prev.map(p => p.id === policyId ? updatedPol : p));
        showToast('Spending policy limit updated.', 'success');
        addAuditLog('Policy Updated', `Modified spending policy limit to ₹${limit}`, currentUser.tenantId);
      } else {
        showToast(json.message || 'Failed to update policy', 'error');
      }
    } catch (err) {
      console.error('Failed to update company policy:', err);
      showToast('Error updating policy', 'error');
    }
  };

  const addCompanyPolicy = async (category, limit, rule) => {
    if (!currentUser) return;

    // Fallback for local/mock mode
    if (!currentUser.tenantSlug || !currentUser.token) {
      const newPol = {
        id: 'pol-' + Date.now(),
        tenantId: currentUser.tenantId,
        category,
        limit: parseFloat(limit),
        rule
      };
      setPolicies(prev => {
        const filtered = prev.filter(p => !(p.category.toLowerCase() === category.toLowerCase() && p.tenantId === currentUser.tenantId));
        return [...filtered, newPol];
      });
      showToast('Spending policy saved successfully (Local Mode).', 'success');
      addAuditLog('Policy Created', `Added spending policy for ${category} with cap ₹${limit}`, currentUser.tenantId);
      return;
    }

    try {
      const res = await fetch(POLICY_ENDPOINTS.CREATE_OR_UPDATE(currentUser.tenantSlug), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          category,
          limit: parseFloat(limit),
          rule
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newPol = {
          ...json.data,
          id: json.data._id || json.data.id,
          tenantId: currentUser.tenantId
        };
        setPolicies(prev => {
          const filtered = prev.filter(p => !(p.category.toLowerCase() === category.toLowerCase() && p.tenantId === currentUser.tenantId));
          return [...filtered, newPol];
        });
        showToast('Spending policy saved successfully.', 'success');
        addAuditLog('Policy Created', `Added spending policy for ${category} with cap ₹${limit}`, currentUser.tenantId);
      } else {
        showToast(json.message || 'Failed to save policy', 'error');
      }
    } catch (err) {
      console.error('Failed to add company policy:', err);
      showToast('Error saving policy', 'error');
    }
  };

  // Employee actions
  const submitExpense = (title, category, amount, description, receiptName, assignedManagerId = null) => {
    const numericAmount = parseFloat(amount);

    // Policy Check
    const activePolicy = policies.find(p => p.tenantId === currentUser.tenantId && p.category.toLowerCase() === category.toLowerCase());
    const exceedsPolicy = activePolicy ? numericAmount > activePolicy.limit : false;
    const initialStatus = exceedsPolicy ? 'Under Review' : 'Pending';

    // Find assigned manager name for logs
    const assignedManager = users.find(u => u.id === assignedManagerId);
    const managerName = assignedManager ? assignedManager.name : 'Unassigned';

    const newExpense = {
      id: 'exp-' + Date.now(),
      tenantId: currentUser.tenantId,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeEmail: currentUser.email,
      title,
      category,
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0],
      description,
      status: initialStatus,
      receipt: receiptName || 'receipt_sample.png',
      assignedManagerId: assignedManagerId || null,
      comments: [],
      auditTrail: [
        {
          action: 'Created Claim',
          user: currentUser.name,
          timestamp: new Date().toISOString(),
          details: `Submitted ${category} claim of ₹${numericAmount}. Routed to Manager: ${managerName}. ${exceedsPolicy ? `Flagged: Exceeds category policy limit of ₹${activePolicy.limit.toFixed(2)}.` : ''}`
        }
      ]
    };

    setExpenses(prev => [newExpense, ...prev]);
    showToast(exceedsPolicy ? 'Expense submitted! Flagged for policy review.' : 'Expense claim submitted successfully!', exceedsPolicy ? 'warning' : 'success');
    addAuditLog('Expense Created', `Claim "${title}" (₹${numericAmount}) created. Routed to Manager: ${managerName}. Status: ${initialStatus}`, currentUser.tenantId);
  };

  const submitTravel = (destination, purpose, estimatedCost, mileage) => {
    const newTravel = {
      id: 'trv-' + Date.now(),
      tenantId: currentUser.tenantId,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      purpose,
      destination,
      estimatedCost: parseFloat(estimatedCost),
      mileage: parseInt(mileage) || 0,
      status: 'Pending',
      comments: [],
      createdAt: new Date().toISOString()
    };

    setTravelRequests(prev => [newTravel, ...prev]);
    showToast('Travel request submitted for approval.', 'success');
    addAuditLog('Travel Request Created', `Requested travel to ${destination} (₹${estimatedCost})`, currentUser.tenantId);
  };

  // Manager actions
  const approveExpense = (expenseId, commentText = '') => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        const comment = commentText.trim() ? { author: currentUser.name, text: commentText, timestamp: new Date().toISOString() } : null;
        const updatedComments = comment ? [...exp.comments, comment] : exp.comments;
        return {
          ...exp,
          status: 'Approved',
          comments: updatedComments,
          auditTrail: [
            ...exp.auditTrail,
            {
              action: 'Approved by Manager',
              user: currentUser.name,
              timestamp: new Date().toISOString(),
              details: commentText ? `Approved: "${commentText}"` : 'Approved without comment'
            }
          ]
        };
      }
      return exp;
    }));
    showToast('Expense claim approved.', 'success');
    addAuditLog('Expense Approved', `Manager approved expense ID: ${expenseId}`, currentUser.tenantId);
  };

  const rejectExpense = (expenseId, commentText = '') => {
    if (!commentText.trim()) {
      showToast('A reason for rejection must be provided.', 'error');
      return false;
    }
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        const comment = { author: currentUser.name, text: commentText, timestamp: new Date().toISOString() };
        return {
          ...exp,
          status: 'Rejected',
          comments: [...exp.comments, comment],
          auditTrail: [
            ...exp.auditTrail,
            {
              action: 'Rejected by Manager',
              user: currentUser.name,
              timestamp: new Date().toISOString(),
              details: `Rejected: "${commentText}"`
            }
          ]
        };
      }
      return exp;
    }));
    showToast('Expense claim rejected.', 'error');
    addAuditLog('Expense Rejected', `Manager rejected expense ID: ${expenseId}`, currentUser.tenantId);
    return true;
  };

  const reviewTravelRequest = (requestId, status, commentText) => {
    setTravelRequests(prev => prev.map(tr => {
      if (tr.id === requestId) {
        const comments = commentText.trim()
          ? [...tr.comments, { author: currentUser.name, text: commentText, timestamp: new Date().toISOString() }]
          : tr.comments;
        return { ...tr, status, comments };
      }
      return tr;
    }));

    showToast(`Travel request ${status.toLowerCase()}.`, status === 'Approved' ? 'success' : 'error');
    addAuditLog('Travel Reviewed', `Manager marked travel request ${requestId} as ${status}`, currentUser.tenantId);
  };

  // Auditor actions
  const auditExpense = (expenseId, remarkText) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        return {
          ...exp,
          status: 'Audited',
          auditTrail: [
            ...exp.auditTrail,
            {
              action: 'Audited & Cleared',
              user: currentUser.name,
              timestamp: new Date().toISOString(),
              details: remarkText ? `Auditor remark: "${remarkText}"` : 'Marked as compliant. No discrepancies found.'
            }
          ]
        };
      }
      return exp;
    }));
    showToast('Expense audited and cleared successfully.', 'success');
    addAuditLog('Audit Cleared', `Auditor cleared expense ID: ${expenseId}`, currentUser.tenantId);
  };

  const flagExpense = (expenseId, remarkText) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        return {
          ...exp,
          status: 'Flagged',
          auditTrail: [
            ...exp.auditTrail,
            {
              action: 'Flagged by Auditor',
              user: currentUser.name,
              timestamp: new Date().toISOString(),
              details: remarkText ? `Flag reason: "${remarkText}"` : 'Flagged for compliance review.'
            }
          ]
        };
      }
      return exp;
    }));
    showToast('Expense flagged for compliance review.', 'error');
    addAuditLog('Audit Flagged', `Auditor flagged expense ID: ${expenseId}`, currentUser.tenantId);
  };

  // Finance actions
  const processPayment = (expenseId) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        return {
          ...exp,
          status: 'Paid',
          auditTrail: [
            ...exp.auditTrail,
            {
              action: 'Processed Reimbursement',
              user: currentUser.name,
              timestamp: new Date().toISOString(),
              details: 'Disbursed funds via company payment gateway'
            }
          ]
        };
      }
      return exp;
    }));
    showToast('Payment processed. Expense status set to PAID.', 'success');
    addAuditLog('Reimbursement Paid', `Finance processed reimbursement payment for expense ID: ${expenseId}`, currentUser.tenantId);
  };

  const contextValue = useMemo(() => ({
    tenants,
    users,
    policies,
    expenses,
    travelRequests,
    auditLogs,
    currentUser,
    toasts,
    login,
    logout,
    registerUser,
    createTenant,
    updateCompanyPolicy,
    addCompanyPolicy,
    submitExpense,
    submitTravel,
    approveExpense,
    rejectExpense,
    reviewTravelRequest,
    processPayment,
    auditExpense,
    flagExpense,
    showToast,
    addAuditLog,
    setCurrentUser
  }), [
    tenants, users, policies, expenses, travelRequests, auditLogs,
    currentUser, toasts
  ]);

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
