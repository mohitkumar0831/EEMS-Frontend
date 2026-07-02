import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from './context/StateContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/Profile';
import { SuperAdmin } from './pages/SuperAdmin';
import { Overview as SuperAdminOverview } from './pages/SuperAdmin/Overview';
import { TenantManagement as SuperAdminTenantManagement } from './pages/SuperAdmin/TenantManagement';
import { GlobalUsers as SuperAdminGlobalUsers } from './pages/SuperAdmin/GlobalUsers';
import { GlobalPolicies as SuperAdminGlobalPolicies } from './pages/SuperAdmin/GlobalPolicies';
import { PlatformReports as SuperAdminPlatformReports } from './pages/SuperAdmin/PlatformReports';
import { SubscriptionPlans as SuperAdminSubscriptionPlans } from './pages/SuperAdmin/SubscriptionPlans';
import { TenantStatus as SuperAdminTenantStatus } from './pages/SuperAdmin/TenantStatus';
import { SuperAdmins as SuperAdminSuperAdmins } from './pages/SuperAdmin/SuperAdmins';
import { CompanyAdmins as SuperAdminCompanyAdmins } from './pages/SuperAdmin/CompanyAdmins';
import { RolePermissions as SuperAdminRolePermissions } from './pages/SuperAdmin/RolePermissions';
import { AuditLogsPage as SuperAdminAuditLogs } from './pages/SuperAdmin/AuditLogsPage';
import { SystemMonitoring as SuperAdminSystemMonitoring } from './pages/SuperAdmin/SystemMonitoring';
import { NotificationsPage as SuperAdminNotifications } from './pages/SuperAdmin/NotificationsPage';
import { SettingsPage as SuperAdminSettings } from './pages/SuperAdmin/SettingsPage';
import { CompanyAdmin } from './pages/CompanyAdmin';
import { Overview as CompanyAdminOverview } from './pages/CompanyAdmin/Overview';
import { Users as CompanyAdminEmployees } from './pages/CompanyAdmin/Users';
import { Managers as CompanyAdminManagers } from './pages/CompanyAdmin/Managers';
import { FinanceTeam as CompanyAdminFinanceTeam } from './pages/CompanyAdmin/FinanceTeam';
import { Departments as CompanyAdminDepartments } from './pages/CompanyAdmin/Departments';
import { ExpenseCategories as CompanyAdminExpenseCategories } from './pages/CompanyAdmin/ExpenseCategories';
import { Policies as CompanyAdminPolicies } from './pages/CompanyAdmin/Policies';
import { Workflows as CompanyAdminWorkflows } from './pages/CompanyAdmin/Workflows';
import { Expenses as CompanyAdminExpenses } from './pages/CompanyAdmin/Expenses';
import { TravelRequests as CompanyAdminTravelRequests } from './pages/CompanyAdmin/TravelRequests';
import { Reimbursements as CompanyAdminReimbursements } from './pages/CompanyAdmin/Reimbursements';
import { Reports as CompanyAdminReports } from './pages/CompanyAdmin/Reports';
import { Notifications as CompanyAdminNotifications } from './pages/CompanyAdmin/Notifications';
import { Manager } from './pages/Manager';
import { Overview as ManagerOverview } from './pages/Manager/Overview';
import { Expenses as ManagerExpenses } from './pages/Manager/Expenses';
import { Travel as ManagerTravel } from './pages/Manager/Travel';
import { Team as ManagerTeam } from './pages/Manager/Team';
import { Employee } from './pages/Employee';
import { Overview as EmployeeOverview } from './pages/Employee/Overview';
import { FileExpenseClaim } from './pages/Employee/FileExpenseClaim';
import { TravelRequest } from './pages/Employee/TravelRequest';
import { Reimbursements } from './pages/Employee/Reimbursements';
import { EmployeePolicy } from './pages/Employee/Policy';
import { Finance } from './pages/Finance';
import { FinanceOverview } from './pages/Finance/Overview';
import { FinanceProcess } from './pages/Finance/Process';
import { FinanceViolations } from './pages/Finance/Violations';
import { FinanceHistory } from './pages/Finance/History';
import { Auditor } from './pages/Auditor';
import { AuditorOverview } from './pages/Auditor/Overview';
import { AuditorExpenses } from './pages/Auditor/Expenses';
import { AuditorActivity } from './pages/Auditor/Activity';
import { AuditorExportReports } from './pages/Auditor/ExportReports';
import { ToastList } from './components/ToastList';
import './App.css';

function App() {
  const { currentUser } = useAppState();

  const routeMap = {
    SuperAdmin: '/dashboard/superadmin',
    CompanyAdmin: '/dashboard/company-admin',
    Manager: '/dashboard/manager',
    Employee: '/dashboard/employee',
    'Finance Team': '/dashboard/finance',
    Auditor: '/dashboard/auditor'
  };

  const DashboardRoute = ({ element, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to={routeMap[currentUser.role] || '/login'} replace />;
    }
    return element;
  };

  return (
    <Router>
      <ToastList />
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to={routeMap[currentUser.role] || '/login'} replace /> : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={currentUser ? <Navigate to={routeMap[currentUser.role] || '/login'} replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/dashboard/superadmin" element={<DashboardRoute element={<SuperAdmin />} allowedRoles={['SuperAdmin']} />}>
          <Route index element={<SuperAdminOverview />} />
          <Route path="overview" element={<SuperAdminOverview />} />
          <Route path="tenants/companies" element={<SuperAdminTenantManagement />} />
          <Route path="tenants/plans" element={<SuperAdminSubscriptionPlans />} />
          <Route path="tenants/status" element={<SuperAdminTenantStatus />} />
          <Route path="users/superadmins" element={<SuperAdminSuperAdmins />} />
          <Route path="users/companyadmins" element={<SuperAdminCompanyAdmins />} />
          <Route path="roles" element={<SuperAdminRolePermissions />} />
          <Route path="policies" element={<SuperAdminGlobalPolicies />} />
          <Route path="reports" element={<SuperAdminPlatformReports />} />
          <Route path="auditlogs" element={<SuperAdminAuditLogs />} />
          <Route path="monitoring" element={<SuperAdminSystemMonitoring />} />
          <Route path="notifications" element={<SuperAdminNotifications />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>
        <Route path="/dashboard/company-admin" element={<DashboardRoute element={<CompanyAdmin />} allowedRoles={['CompanyAdmin']} />}>
          <Route index element={<CompanyAdminOverview />} />
          <Route path="overview" element={<CompanyAdminOverview />} />
          <Route path="employees" element={<CompanyAdminEmployees />} />
          <Route path="managers" element={<CompanyAdminManagers />} />
          <Route path="finance-team" element={<CompanyAdminFinanceTeam />} />
          <Route path="departments" element={<CompanyAdminDepartments />} />
          <Route path="expense-categories" element={<CompanyAdminExpenseCategories />} />
          <Route path="policies" element={<CompanyAdminPolicies />} />
          <Route path="workflows" element={<CompanyAdminWorkflows />} />
          <Route path="expenses" element={<CompanyAdminExpenses />} />
          <Route path="travel-requests" element={<CompanyAdminTravelRequests />} />
          <Route path="reimbursements" element={<CompanyAdminReimbursements />} />
          <Route path="reports" element={<CompanyAdminReports />} />
          <Route path="notifications" element={<CompanyAdminNotifications />} />
        </Route>
        <Route path="/dashboard/manager" element={<DashboardRoute element={<Manager />} allowedRoles={['Manager']} />}>
          <Route index element={<ManagerOverview />} />
          <Route path="overview" element={<ManagerOverview />} />
          <Route path="expenses" element={<ManagerExpenses />} />
          <Route path="travel" element={<ManagerTravel />} />
          <Route path="team" element={<ManagerTeam />} />
        </Route>
        <Route path="/dashboard/employee" element={<DashboardRoute element={<Employee />} allowedRoles={['Employee']} />}>
          <Route index element={<EmployeeOverview />} />
          <Route path="overview" element={<EmployeeOverview />} />
          <Route path="file-claim" element={<FileExpenseClaim />} />
          <Route path="travel" element={<TravelRequest />} />
          <Route path="reimbursements" element={<Reimbursements />} />
          <Route path="policy"         element={<EmployeePolicy />} />
        </Route>
        <Route path="/dashboard/finance" element={<DashboardRoute element={<Finance />} allowedRoles={['Finance Team']} />}>
          <Route index element={<FinanceOverview />} />
          <Route path="overview" element={<FinanceOverview />} />
          <Route path="process" element={<FinanceProcess />} />
          <Route path="violations" element={<FinanceViolations />} />
          <Route path="history" element={<FinanceHistory />} />
        </Route>
        <Route path="/dashboard/auditor" element={<DashboardRoute element={<Auditor />} allowedRoles={['Auditor']} />}>
          <Route index element={<AuditorOverview />} />
          <Route path="overview" element={<AuditorOverview />} />
          <Route path="expenses" element={<AuditorExpenses />} />
          <Route path="activity" element={<AuditorActivity />} />
          <Route path="export" element={<AuditorExportReports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
