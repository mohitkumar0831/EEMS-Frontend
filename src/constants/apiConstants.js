// --- LOCAL DEVELOPMENT ---
// export const API_BASE_URL = 'http://localhost:4000/api/v1';
// export const NOTIFICATION_SERVICE_URL = 'http://localhost:4500';

// --- DEPLOYED / PRODUCTION ---
// Uncomment the lines below (and comment the local ones above) when deploying
export const API_BASE_URL = 'http://103.192.198.240:9002/api/v1';
export const NOTIFICATION_SERVICE_URL = 'http://103.192.198.240:4500';

export const AUTH_ENDPOINTS = {
  REGISTER_SUPER_ADMIN: `${API_BASE_URL}/auth/register-super-admin`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  TENANT_LOGIN: (slug) => `${API_BASE_URL}/auth/tenant/${slug}/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  TENANT_FORGOT_PASSWORD: (slug) => `${API_BASE_URL}/auth/tenant/${slug}/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  GET_COMPANY_ADMIN: (slug) => `${API_BASE_URL}/auth/tenant/${slug}/company-admin`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/notifications`,
  GET_UNREAD: `${API_BASE_URL}/notifications/unread`,
  MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_BASE_URL}/notifications/read-all`,
  DELETE: (id) => `${API_BASE_URL}/notifications/${id}`,
};

export const REPORTS_ENDPOINTS = {
  GET_SPENDING: (slug) => `${API_BASE_URL}/reports/tenant/${slug}/spending`,
};

export const TENANT_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/tenants/register`,
  GET_ALL: `${API_BASE_URL}/tenants/summary`,
  UPDATE_STATUS: (slug) => `${API_BASE_URL}/tenants/${slug}/status`,
  DELETE_TENANT: (slug) => `${API_BASE_URL}/tenants/${slug}`,
  GET_COMPANY_ADMINS: `${API_BASE_URL}/tenants/company-admins`,
};

export const USER_ENDPOINTS = {
  GET_EMPLOYEES: (slug) => `${API_BASE_URL}/users/tenant/${slug}/employees`,
  REGISTER_EMPLOYEE: (slug) => `${API_BASE_URL}/users/tenant/${slug}/employees`,
  ASSIGN_MANAGER: (slug, employeeId) => `${API_BASE_URL}/users/tenant/${slug}/employees/${employeeId}/manager`,
  GET_MANAGER_EMPLOYEES: (slug, managerId) => `${API_BASE_URL}/users/tenant/${slug}/manager/${managerId}/employees`,
};

export const DASHBOARD_ENDPOINTS = {
  SUPER_ADMIN: `${API_BASE_URL}/dashboard/superadmin`,
  SUPER_ADMIN_REPORTS: `${API_BASE_URL}/tenants/dashboard/stats`,
};

export const EXPENSE_ENDPOINTS = {
  CREATE_EXPENSE: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}`,
  UPLOAD_RECEIPT: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/receipts/upload`,
  GET_EMPLOYEE_EXPENSES: (slug, employeeId) => `${API_BASE_URL}/expenses/tenant/${slug}/employee/${employeeId}`,
  GET_EMPLOYEE_REIMBURSEMENT_SUMMARY: (slug, employeeId) => `${API_BASE_URL}/expenses/tenant/${slug}/employee/${employeeId}/reimbursements/summary`,
  GET_MANAGER_EXPENSES: (slug, managerId) => `${API_BASE_URL}/expenses/tenant/${slug}/manager/${managerId}`,
  UPDATE_EXPENSE_STATUS: (slug, expenseId) => `${API_BASE_URL}/expenses/tenant/${slug}/${expenseId}/status`,
  GET_ALL_EXPENSES: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}`,
  PROCESS_PAYOUT: (slug, expenseId) => `${API_BASE_URL}/expenses/tenant/${slug}/${expenseId}/payout`,
  CREATE_RAZORPAY_ORDER: (slug, expenseId) => `${API_BASE_URL}/expenses/tenant/${slug}/${expenseId}/create-razorpay-order`,
  VERIFY_RAZORPAY_PAYMENT: (slug, expenseId) => `${API_BASE_URL}/expenses/tenant/${slug}/${expenseId}/verify-razorpay-payment`,
  GET_FINANCE_PAYOUTS: (slug, financeId) => `${API_BASE_URL}/expenses/tenant/${slug}/finance/${financeId}/payouts`,
  GET_FINANCE_DASHBOARD: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/finance/dashboard`,
  GET_AUDITOR_DASHBOARD: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/auditor/dashboard`,
  GET_ADMIN_DASHBOARD: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/admin/dashboard`,
  GET_MANAGER_DASHBOARD: (slug, managerId) => `${API_BASE_URL}/expenses/tenant/${slug}/manager/${managerId}/dashboard`,
  GET_EMPLOYEE_DASHBOARD: (slug, employeeId) => `${API_BASE_URL}/expenses/tenant/${slug}/employee/${employeeId}/dashboard`,
};

export const BILLING_ENDPOINTS = {
  // Plans
  GET_PLANS: `${API_BASE_URL}/billing/plans`,
  CREATE_PLAN: `${API_BASE_URL}/billing/plans`,
  UPDATE_PLAN: (planId) => `${API_BASE_URL}/billing/plans/${planId}`,
  DELETE_PLAN: (planId) => `${API_BASE_URL}/billing/plans/${planId}`,

  // Subscriptions
  CREATE_SUBSCRIPTION: `${API_BASE_URL}/billing/subscriptions`,
  GET_ALL_SUBSCRIPTIONS: `${API_BASE_URL}/billing/subscriptions`,
  GET_BILLING_STATS: `${API_BASE_URL}/billing/subscriptions/stats`,
  GET_SUBSCRIPTION: (tenantId) => `${API_BASE_URL}/billing/subscriptions/${tenantId}`,
  UPGRADE_PLAN: (subId) => `${API_BASE_URL}/billing/subscriptions/${subId}/upgrade`,
  OVERRIDE_SUBSCRIPTION: (subId) => `${API_BASE_URL}/billing/subscriptions/${subId}/override`,

  // Payments
  CREATE_ORDER: `${API_BASE_URL}/billing/payments/create-order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/billing/payments/verify`,
  GET_ALL_PAYMENTS: `${API_BASE_URL}/billing/payments`,
  GET_MONTHLY_VOLUME: (year) => `${API_BASE_URL}/billing/payments/monthly-volume?year=${year}`,
  GET_PAYMENT_HISTORY: (tenantId) => `${API_BASE_URL}/billing/payments/tenant/${tenantId}`,

  // Invoices
  GET_INVOICES: (tenantId) => `${API_BASE_URL}/billing/invoices/tenant/${tenantId}`,
  DOWNLOAD_INVOICE: (invoiceId) => `${API_BASE_URL}/billing/invoices/${invoiceId}/download`,
};

export const AUDIT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/audit/logs`,
};

export const POLICY_ENDPOINTS = {
  GET_ALL: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/policies`,
  CREATE_OR_UPDATE: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/policies`,
  UPDATE_BY_ID: (slug, id) => `${API_BASE_URL}/expenses/tenant/${slug}/policies/${id}`,
};

