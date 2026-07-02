import React from 'react';
import { Plus } from 'lucide-react';

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all';

const selectCls =
  'w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all cursor-pointer';

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2.5 p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-950/30 transition-all select-none w-full">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-slate-800 text-indigo-600 bg-slate-950 focus:ring-indigo-500/20 cursor-pointer shrink-0"
    />
    <span className="text-xs text-slate-350">{label}</span>
  </label>
);

export const UsersTab = ({
  tenantUsers = [],
  firstName,
  setFirstName,
  lastName,
  setLastName,
  employeeId,
  setEmployeeId,
  email,
  setEmail,
  phone,
  setPhone,
  profilePhoto,
  setProfilePhoto,
  role,
  setRole,
  department,
  setDepartment,
  designation,
  setDesignation,
  reportingManager,
  setReportingManager,
  joiningDate,
  setJoiningDate,
  employmentType,
  setEmploymentType,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  expenseLimit,
  setExpenseLimit,
  expenseApprover,
  setExpenseApprover,
  travelApprovalRequired,
  setTravelApprovalRequired,
  status,
  setStatus,
  forcePasswordChange,
  setForcePasswordChange,
  handleRegisterUser,
  resetForm
}) => {
  const roleDetails = [
    { id: 'Employee',     title: 'Employee',     desc: 'Can submit expense claims and view personal reimbursements.' },
    { id: 'Manager',      title: 'Manager',      desc: 'Approves team expense claims and reviews reports for direct reports.' },
    { id: 'Finance Team', title: 'Finance Team', desc: 'Processes reimbursements, marks claims as paid, and manages finance workflows.' },
    { id: 'Auditor',      title: 'Auditor',      desc: 'Reviews audit logs and inspects expense records for compliance.' }
  ];

  const managers = tenantUsers.filter(u => u.role === 'Manager');

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* Title */}
      <div className="px-1">
        <h3 className="text-xl font-bold text-slate-100">Add New User</h3>
        <p className="text-slate-500 text-xs mt-1">Onboard staff profiles and configure system access permissions.</p>
      </div>

      <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-4 sm:p-6 shadow-xl w-full">
        <form onSubmit={handleRegisterUser} className="flex flex-col gap-6 w-full">
          
          {/* Section 1: Personal Details */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Personal Information</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <FormField label="First Name *">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Last Name *">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Employee ID *">
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-824"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Email *">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Phone">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Profile Image File">
                <input
                  type="text"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="avatar.png (optional)"
                  className={inputCls}
                />
              </FormField>
            </div>
          </div>

          {/* Section 2: Job & Limit Configuration */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">2. Job Profile &amp; Spend limits</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              <FormField label="System Role *">
                <select value={role} onChange={(e) => setRole(e.target.value)} className={selectCls} required>
                  <option value="Employee">Employee (Filer)</option>
                  <option value="Manager">Manager (L1 Approver)</option>
                  <option value="Finance Team">Finance Team (Processor)</option>
                  <option value="Auditor">Auditor (Reviewer)</option>
                </select>
              </FormField>
              <FormField label="Department *">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Designation *">
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Software Engineer"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Employment Type">
                <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={selectCls}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </FormField>
              <FormField label="Joining Date">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className={inputCls}
                />
              </FormField>
              <FormField label="Monthly Limit Amount (₹)">
                <input
                  type="number"
                  value={expenseLimit}
                  onChange={(e) => setExpenseLimit(e.target.value)}
                  placeholder="e.g. 15000"
                  className={inputCls}
                />
              </FormField>
              <FormField label="Reporting Manager">
                <select value={reportingManager} onChange={(e) => setReportingManager(e.target.value)} className={selectCls}>
                  <option value="">None / Executive</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Primary Expense Approver">
                <select value={expenseApprover} onChange={(e) => setExpenseApprover(e.target.value)} className={selectCls}>
                  <option value="">Auto-Routing</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          {/* Section 3: Credentials & Access Control */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">3. Credentials &amp; Access Controls</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <FormField label="Username *">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe12"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Password *">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  required
                />
              </FormField>
              <FormField label="Confirm Password *">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 w-full">
              <FormField label="Profile Access Status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                  <option value="Active">Active Profile</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormField>
              <div className="flex flex-col justify-end w-full">
                <Checkbox
                  label="Travel Approval Required"
                  checked={travelApprovalRequired}
                  onChange={setTravelApprovalRequired}
                />
              </div>
              <div className="flex flex-col justify-end w-full">
                <Checkbox
                  label="Force password change on login"
                  checked={forcePasswordChange}
                  onChange={setForcePasswordChange}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-white/5 w-full">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-350 bg-slate-950/20 transition-all cursor-pointer text-center w-full sm:w-auto"
            >
              Reset Fields
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer text-center w-full sm:w-auto"
            >
              Create User Profile
            </button>
          </div>

        </form>
      </div>

      {/* Role details grid */}
      <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 w-full">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">System Role Map</h4>
          <p className="text-xs text-slate-500 mt-1">Descriptions for each account level access type.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
          {roleDetails.map(r => (
            <div key={r.id} className={`rounded-2xl p-4 border transition-all ${role === r.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
              <span className={`text-xs font-bold ${role === r.id ? 'text-cyan-400' : 'text-slate-250'}`}>{r.title}</span>
              <p className="text-[11px] text-slate-455 mt-2 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900/60 border border-white/5 rounded-3xl shadow-xl overflow-hidden w-full">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-slate-200">Company Users Directory</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-350 border-collapse min-w-[700px]">
            <thead className="bg-slate-950/30 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Employee</th>
                <th className="px-6 py-4 whitespace-nowrap">Role</th>
                <th className="px-6 py-4 whitespace-nowrap">Department</th>
                <th className="px-6 py-4 whitespace-nowrap">Employee ID</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenantUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 whitespace-nowrap">No users created yet.</td>
                </tr>
              ) : (
                tenantUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-all">
                    <td className="px-6 py-4 font-semibold text-slate-200 whitespace-nowrap">{u.name}</td>
                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">{u.role}</td>
                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">{u.department}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{u.employeeId || '—'}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                        (u.status || 'Active') === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
