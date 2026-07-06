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
};

export const TENANT_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/tenants/register`,
  GET_ALL: `${API_BASE_URL}/tenants`,
};

export const USER_ENDPOINTS = {
  GET_EMPLOYEES: (slug) => `${API_BASE_URL}/users/tenant/${slug}/employees`,
  REGISTER_EMPLOYEE: (slug) => `${API_BASE_URL}/users/tenant/${slug}/employees`,
  ASSIGN_MANAGER: (slug, employeeId) => `${API_BASE_URL}/users/tenant/${slug}/employees/${employeeId}/manager`,
  GET_MANAGER_EMPLOYEES: (slug, managerId) => `${API_BASE_URL}/users/tenant/${slug}/manager/${managerId}/employees`,
};

export const DASHBOARD_ENDPOINTS = {
  SUPER_ADMIN: `${API_BASE_URL}/dashboard/superadmin`,
};

export const EXPENSE_ENDPOINTS = {
  CREATE_EXPENSE: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}`,
  UPLOAD_RECEIPT: (slug) => `${API_BASE_URL}/expenses/tenant/${slug}/receipts/upload`,
  GET_EMPLOYEE_EXPENSES: (slug, employeeId) => `${API_BASE_URL}/expenses/tenant/${slug}/employee/${employeeId}`,
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
};
