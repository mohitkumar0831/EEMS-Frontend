export const API_BASE_URL = 'http://localhost:4100/api/v1';
export const NOTIFICATION_SERVICE_URL = 'http://localhost:4500';

export const AUTH_ENDPOINTS = {
  REGISTER_SUPER_ADMIN: `${API_BASE_URL}/auth/register-super-admin`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  TENANT_LOGIN: (slug) => `http://localhost:4000/api/v1/auth/tenant/${slug}/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
};

export const TENANT_API_BASE_URL = 'http://localhost:4200/api/v1';

export const TENANT_ENDPOINTS = {
  REGISTER: `${TENANT_API_BASE_URL}/tenants/register`,
  GET_ALL: `http://localhost:4000/api/v1/tenants`,
};

export const USER_ENDPOINTS = {
  GET_EMPLOYEES: (slug) => `http://localhost:4000/api/v1/users/tenant/${slug}/employees`,
  REGISTER_EMPLOYEE: (slug) => `http://localhost:4000/api/v1/users/tenant/${slug}/employees`,
  ASSIGN_MANAGER: (slug, employeeId) => `http://localhost:4000/api/v1/users/tenant/${slug}/employees/${employeeId}/manager`,
  GET_MANAGER_EMPLOYEES: (slug, managerId) => `http://localhost:4000/api/v1/users/tenant/${slug}/manager/${managerId}/employees`,
};

export const DASHBOARD_ENDPOINTS = {
  SUPER_ADMIN: `http://localhost:4000/api/v1/dashboard/superadmin`,
};

export const EXPENSE_ENDPOINTS = {
  CREATE_EXPENSE: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}`,
  UPLOAD_RECEIPT: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/receipts/upload`,
  GET_EMPLOYEE_EXPENSES: (slug, employeeId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/employee/${employeeId}`,
  GET_MANAGER_EXPENSES: (slug, managerId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/manager/${managerId}`,
  UPDATE_EXPENSE_STATUS: (slug, expenseId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/${expenseId}/status`,
  GET_ALL_EXPENSES: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}`,
  PROCESS_PAYOUT: (slug, expenseId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/${expenseId}/payout`,
  CREATE_RAZORPAY_ORDER: (slug, expenseId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/${expenseId}/create-razorpay-order`,
  VERIFY_RAZORPAY_PAYMENT: (slug, expenseId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/${expenseId}/verify-razorpay-payment`,
  GET_FINANCE_PAYOUTS: (slug, financeId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/finance/${financeId}/payouts`,
  GET_FINANCE_DASHBOARD: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/finance/dashboard`,
  GET_AUDITOR_DASHBOARD: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/auditor/dashboard`,
  GET_ADMIN_DASHBOARD: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/admin/dashboard`,
};
