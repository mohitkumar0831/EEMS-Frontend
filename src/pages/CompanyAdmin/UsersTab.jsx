import React from 'react';
import { Plus } from 'lucide-react';

export const UsersTab = ({
  tenantUsers,
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
    { id: 'Employee', title: 'Employee', desc: 'Can submit expense claims and view personal reimbursements.' },
    { id: 'Manager', title: 'Manager', desc: 'Approves team expense claims and reviews reports for direct reports.' },
    { id: 'Finance Team', title: 'Finance Team', desc: 'Processes reimbursements, marks claims as paid, and manages finance workflows.' },
    { id: 'Auditor', title: 'Auditor', desc: 'Reviews audit logs and inspects expense records for compliance.' }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-slate-100">Add New User</h2>
        <form onSubmit={handleRegisterUser} className="mt-6 space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <div className="mb-4 border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.18em]">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">First Name *</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Last Name *</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Last name"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Employee ID *</label>
                <input
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="EMP-1234"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Email *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0]?.name || '')}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500/10 file:px-3 file:py-2 file:text-xs file:text-indigo-200"
                />
                {profilePhoto && <p className="text-xs text-slate-500">Selected: {profilePhoto}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <div className="mb-4 border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.18em]">Company Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Finance Team">Finance Team</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Department *</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Department"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Designation *</label>
                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Designation"
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <div className="mb-4 border-b border-white/10 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.18em]">Login Credentials</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Username *</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Password *</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="space-y-3 lg:col-span-2">
                <label className="text-xs text-slate-400 uppercase tracking-[0.18em]">Confirm Password *</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-indigo-500/30 hover:text-indigo-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] active:scale-[0.98]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Role details panel */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200">Role Details</h4>
          <p className="text-xs text-slate-400">Select a role in the form to highlight its description.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roleDetails.map(r => (
            <div key={r.id} className={`rounded-xl p-3 border ${role === r.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/2'}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-100">{r.title}</div>
              </div>
              <div className="text-xs text-slate-400 mt-2">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-base font-bold text-slate-200">Company Users Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenantUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users created yet.</td>
                </tr>
              ) : (
                tenantUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-all">
                    <td className="px-6 py-4 font-semibold text-slate-200">{u.name}</td>
                    <td className="px-6 py-4 text-slate-300">{u.role}</td>
                    <td className="px-6 py-4 text-slate-300">{u.department}</td>
                    <td className="px-6 py-4 text-slate-300">{u.employeeId || '—'}</td>
                    <td className="px-6 py-4 text-slate-300">{u.status || 'Active'}</td>
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
