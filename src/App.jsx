import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
import { AuditLogs as SuperAdminAuditLogs } from './pages/SuperAdmin/AuditLogs';
import { SystemMonitoring as SuperAdminSystemMonitoring } from './pages/SuperAdmin/SystemMonitoring';
import { NotificationsPage as SuperAdminNotifications } from './pages/SuperAdmin/NotificationsPage';
import { PlatformSettings as SuperAdminSettings } from './pages/SuperAdmin/PlatformSettings';
import { CompanyAdmin } from './pages/CompanyAdmin';
import { Overview as CompanyAdminOverview } from './pages/CompanyAdmin/Overview';
import { Users as CompanyAdminEmployees } from './pages/CompanyAdmin/Users';
import { RoasterTab as CompanyAdminRoaster } from './pages/CompanyAdmin/RoasterTab';
import { Managers as CompanyAdminManagers } from './pages/CompanyAdmin/Managers';
import { FinanceTeam as CompanyAdminFinanceTeam } from './pages/CompanyAdmin/FinanceTeam';
import { Departments as CompanyAdminDepartments } from './pages/CompanyAdmin/Departments';
import { ExpenseCategories as CompanyAdminExpenseCategories } from './pages/CompanyAdmin/ExpenseCategories';
import { Policies as CompanyAdminPolicies } from './pages/CompanyAdmin/Policies';
import { Workflows as CompanyAdminWorkflows } from './pages/CompanyAdmin/Workflows';
import { ExpenseApproval as CompanyAdminExpenseApproval } from './pages/CompanyAdmin/ExpenseApproval';
import { TravelRequests as CompanyAdminTravelRequests } from './pages/CompanyAdmin/TravelRequests';
import { Reimbursements as CompanyAdminReimbursements } from './pages/CompanyAdmin/Reimbursements';
import { Reports as CompanyAdminReports } from './pages/CompanyAdmin/Reports';
import { Notifications as CompanyAdminNotifications } from './pages/CompanyAdmin/Notifications';
import { Billing as CompanyAdminBilling } from './pages/CompanyAdmin/Billing';
import { Manager } from './pages/Manager';
import { Overview as ManagerOverview } from './pages/Manager/Overview';
import { Expenses as ManagerExpenses } from './pages/Manager/Expenses';
import { Travel as ManagerTravel } from './pages/Manager/Travel';
import { Team as ManagerTeam } from './pages/Manager/Team';
import { FileExpenseClaim as ManagerFileExpenseClaim } from './pages/Manager/FileExpenseClaim';
import { Reimbursements as ManagerReimbursements } from './pages/Manager/Reimbursements';
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
import { FileExpenseClaim as FinanceFileExpenseClaim } from './pages/Finance/FileExpenseClaim';
import { Reimbursements as FinanceReimbursements } from './pages/Finance/Reimbursements';
import { Auditor } from './pages/Auditor';
import { AuditorOverview } from './pages/Auditor/Overview';
import { AuditorExpenses } from './pages/Auditor/Expenses';
import { AuditorActivity } from './pages/Auditor/Activity';
import { AuditorExportReports } from './pages/Auditor/ExportReports';
import { FileExpenseClaim as AuditorFileExpenseClaim } from './pages/Auditor/FileExpenseClaim';
import { Reimbursements as AuditorReimbursements } from './pages/Auditor/Reimbursements';
import { AuditorPolicies } from './pages/Auditor/Policies';
import { ToastList } from './components/ToastList';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'white', backgroundColor: '#111' }}>
          <h2>Something went wrong rendering the page.</h2>
          <pre style={{ color: 'red' }}>{this.state.error?.toString()}</pre>
          <pre style={{ color: 'pink' }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { currentUser } = useAppState();

  const getDashboardPath = (role, slug) => {
    if (role === 'SuperAdmin') return '/dashboard/superadmin';
    const rolePaths = {
      CompanyAdmin: 'dashboard/company-admin',
      Manager: 'dashboard/manager',
      Employee: 'dashboard/employee',
      'Finance Team': 'dashboard/finance',
      Auditor: 'dashboard/auditor'
    };
    return slug ? `/${slug}/${rolePaths[role]}` : '/login';
  };

  const DashboardRoute = ({ element, allowedRoles }) => {
    const { slug } = useParams();

    if (!currentUser) {
      return <Navigate to={slug ? `/${slug}` : '/login'} replace />;
    }

    if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to={getDashboardPath(currentUser.role, currentUser.tenantSlug)} replace />;
    }

    // Ensure users cannot access another tenant's dashboard by changing the URL
    if (currentUser.role !== 'SuperAdmin' && currentUser.tenantSlug !== slug) {
      return <Navigate to={getDashboardPath(currentUser.role, currentUser.tenantSlug)} replace />;
    }

    return element;
  };

  return (
    <Router>
      <ErrorBoundary>
        <ToastList />
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to={getDashboardPath(currentUser.role, currentUser.tenantSlug)} replace /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:slug" element={<Login />} />
          <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={currentUser ? <Navigate to={getDashboardPath(currentUser.role, currentUser.tenantSlug)} replace /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/:slug/dashboard"
            element={currentUser ? <Navigate to={getDashboardPath(currentUser.role, currentUser.tenantSlug)} replace /> : <Navigate to="/login" replace />}
          />

          {/* Super Admin Routes (No slug) */}
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

          {/* Tenant Routes (Prefixed with /:slug) */}
          <Route path="/:slug/dashboard/company-admin" element={<DashboardRoute element={<CompanyAdmin />} allowedRoles={['CompanyAdmin']} />}>
            <Route index element={<CompanyAdminOverview />} />
            <Route path="overview" element={<CompanyAdminOverview />} />
            <Route path="employees" element={<CompanyAdminEmployees />} />
            <Route path="roaster" element={<CompanyAdminRoaster />} />
            <Route path="managers" element={<CompanyAdminManagers />} />
            <Route path="finance-team" element={<CompanyAdminFinanceTeam />} />
            <Route path="departments" element={<CompanyAdminDepartments />} />
            <Route path="expense-categories" element={<CompanyAdminExpenseCategories />} />
            <Route path="policies" element={<CompanyAdminPolicies />} />
            <Route path="workflows" element={<CompanyAdminWorkflows />} />
            <Route path="expenses" element={<CompanyAdminExpenseApproval />} />
            <Route path="travel-requests" element={<CompanyAdminTravelRequests />} />
            <Route path="reimbursements" element={<CompanyAdminReimbursements />} />
            <Route path="reports" element={<CompanyAdminReports />} />
            <Route path="billing" element={<CompanyAdminBilling />} />
            <Route path="notifications" element={<CompanyAdminNotifications />} />
          </Route>

          <Route path="/:slug/dashboard/manager" element={<DashboardRoute element={<Manager />} allowedRoles={['Manager']} />}>
            <Route index element={<ManagerOverview />} />
            <Route path="overview" element={<ManagerOverview />} />
            <Route path="expenses" element={<ManagerExpenses />} />
            <Route path="travel" element={<ManagerTravel />} />
            <Route path="team" element={<ManagerTeam />} />
            <Route path="file-claim" element={<ManagerFileExpenseClaim />} />
            <Route path="reimbursements" element={<ManagerReimbursements />} />
          </Route>

          <Route path="/:slug/dashboard/employee" element={<DashboardRoute element={<Employee />} allowedRoles={['Employee']} />}>
            <Route index element={<EmployeeOverview />} />
            <Route path="overview" element={<EmployeeOverview />} />
            <Route path="file-claim" element={<FileExpenseClaim />} />
            <Route path="travel" element={<TravelRequest />} />
            <Route path="reimbursements" element={<Reimbursements />} />
            <Route path="policy" element={<EmployeePolicy />} />
          </Route>

          <Route path="/:slug/dashboard/finance" element={<DashboardRoute element={<Finance />} allowedRoles={['Finance Team']} />}>
            <Route index element={<FinanceOverview />} />
            <Route path="overview" element={<FinanceOverview />} />
            <Route path="process" element={<FinanceProcess />} />
            <Route path="violations" element={<FinanceViolations />} />
            <Route path="history" element={<FinanceHistory />} />
            <Route path="file-claim" element={<FinanceFileExpenseClaim />} />
            <Route path="reimbursements" element={<FinanceReimbursements />} />
          </Route>

          <Route path="/:slug/dashboard/auditor" element={<DashboardRoute element={<Auditor />} allowedRoles={['Auditor']} />}>
            <Route index element={<AuditorOverview />} />
            <Route path="overview" element={<AuditorOverview />} />
            <Route path="expenses" element={<AuditorExpenses />} />
            <Route path="activity" element={<AuditorActivity />} />
            <Route path="export" element={<AuditorExportReports />} />
            <Route path="file-claim" element={<AuditorFileExpenseClaim />} />
            <Route path="reimbursements" element={<AuditorReimbursements />} />
            <Route path="policies" element={<AuditorPolicies />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
