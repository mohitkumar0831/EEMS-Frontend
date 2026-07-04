export const API_BASE_URL = 'http://localhost:4100/api/v1';

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
};

export const USER_ENDPOINTS = {
  GET_EMPLOYEES: (slug) => `http://localhost:4000/api/v1/users/tenant/${slug}/employees`,
  REGISTER_EMPLOYEE: (slug) => `http://localhost:4000/api/v1/users/tenant/${slug}/employees`,
};

export const EXPENSE_ENDPOINTS = {
  CREATE_EXPENSE: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}`,
  UPLOAD_RECEIPT: (slug) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/receipts/upload`,
  GET_EMPLOYEE_EXPENSES: (slug, employeeId) => `http://localhost:4000/api/v1/expenses/tenant/${slug}/employee/${employeeId}`,
};
