import React, { useState } from 'react';
import { Plus, Eye, EyeOff } from 'lucide-react';

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
  formData,
  handleChange,
  handleRegisterUser,
  resetForm
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          
          {/* Role Selection */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Select Role</h4>
            </div>
            <div className="w-full sm:w-1/3">
              <FormField label="System Role *">
                <select value={formData.role} onChange={(e) => handleChange('role', e.target.value)} className={selectCls} required>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Finance Team">Finance Team</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Section 1: Common Fields */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Common Details</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <FormField label="First Name *">
                <input type="text" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} placeholder="John" className={inputCls} required />
              </FormField>
              <FormField label="Last Name *">
                <input type="text" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} placeholder="Doe" className={inputCls} required />
              </FormField>
              <FormField label="Employee ID *">
                <input type="text" value={formData.employeeId} onChange={(e) => handleChange('employeeId', e.target.value)} placeholder="EMP-824" className={inputCls} required />
              </FormField>
              <FormField label="Email *">
                <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="john@company.com" className={inputCls} required />
              </FormField>
              <FormField label="Mobile Number">
                <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
              </FormField>
              <FormField label="Profile Photo File">
                <input type="text" value={formData.profilePhoto} onChange={(e) => handleChange('profilePhoto', e.target.value)} placeholder="avatar.png (optional)" className={inputCls} />
              </FormField>
              <FormField label="Department *">
                <input type="text" value={formData.department} onChange={(e) => handleChange('department', e.target.value)} placeholder="Engineering" className={inputCls} required />
              </FormField>
              <FormField label="Designation *">
                <input type="text" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)} placeholder="Software Engineer" className={inputCls} required />
              </FormField>
              <FormField label="Joining Date">
                <input type="date" value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="Status">
                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className={selectCls}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormField>
              <FormField label="Password *">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
              <FormField label="Confirm Password *">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={inputCls}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 2: Role-Specific Information */}
          <div className="flex flex-col gap-4 w-full">
            <div className="pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">2. Role Specific Details ({formData.role})</h4>
            </div>

            {formData.role === 'Employee' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <FormField label="Reporting Manager">
                  <select value={formData.reportingManager} onChange={(e) => handleChange('reportingManager', e.target.value)} className={selectCls}>
                    <option value="">Select Manager</option>
                    {managers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </FormField>
                <FormField label="Expense Limit (₹)">
                  <input type="number" value={formData.expenseLimit} onChange={(e) => handleChange('expenseLimit', e.target.value)} placeholder="15000" className={inputCls} />
                </FormField>
                <FormField label="Cost Center">
                  <input type="text" value={formData.costCenter} onChange={(e) => handleChange('costCenter', e.target.value)} placeholder="CC-001" className={inputCls} />
                </FormField>
                <FormField label="Employee Type">
                  <select value={formData.employmentType} onChange={(e) => handleChange('employmentType', e.target.value)} className={selectCls}>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </FormField>
                <FormField label="Office Location">
                  <input type="text" value={formData.officeLocation} onChange={(e) => handleChange('officeLocation', e.target.value)} placeholder="Mumbai HQ" className={inputCls} />
                </FormField>
                <FormField label="PAN Number">
                  <input type="text" value={formData.panNumber} onChange={(e) => handleChange('panNumber', e.target.value)} placeholder="ABCDE1234F" className={inputCls} />
                </FormField>
                <FormField label="Bank Account Number">
                  <input type="text" value={formData.bankAccountNumber} onChange={(e) => handleChange('bankAccountNumber', e.target.value)} placeholder="1234567890" className={inputCls} />
                </FormField>
                <FormField label="IFSC Code">
                  <input type="text" value={formData.ifscCode} onChange={(e) => handleChange('ifscCode', e.target.value)} placeholder="HDFC0001234" className={inputCls} />
                </FormField>
              </div>
            )}

            {formData.role === 'Manager' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <FormField label="Team">
                  <input type="text" value={formData.team} onChange={(e) => handleChange('team', e.target.value)} placeholder="Frontend Team" className={inputCls} />
                </FormField>
                <FormField label="Approval Limit (₹)">
                  <input type="number" value={formData.approvalLimit} onChange={(e) => handleChange('approvalLimit', e.target.value)} placeholder="50000" className={inputCls} />
                </FormField>
                <Checkbox label="Can Approve Expenses" checked={formData.canApproveExpenses} onChange={(v) => handleChange('canApproveExpenses', v)} />
                <Checkbox label="Can Reject Expenses" checked={formData.canRejectExpenses} onChange={(v) => handleChange('canRejectExpenses', v)} />
              </div>
            )}

            {formData.role === 'Finance Team' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <FormField label="Finance Role">
                  <select value={formData.financeRole} onChange={(e) => handleChange('financeRole', e.target.value)} className={selectCls}>
                    <option value="Finance Executive">Finance Executive</option>
                    <option value="Finance Manager">Finance Manager</option>
                  </select>
                </FormField>
                <div className="hidden sm:block"></div>
                <Checkbox label="Can Process Reimbursement" checked={formData.canProcessReimbursement} onChange={(v) => handleChange('canProcessReimbursement', v)} />
                <Checkbox label="Can Export Reports" checked={formData.canExportReports} onChange={(v) => handleChange('canExportReports', v)} />
                <Checkbox label="Can Manage Expense Categories" checked={formData.canManageExpenseCategories} onChange={(v) => handleChange('canManageExpenseCategories', v)} />
                <Checkbox label="Can View All Expenses" checked={formData.canViewAllExpenses} onChange={(v) => handleChange('canViewAllExpenses', v)} />
              </div>
            )}

            {formData.role === 'Auditor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <FormField label="Audit Type">
                  <select value={formData.auditType} onChange={(e) => handleChange('auditType', e.target.value)} className={selectCls}>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </FormField>
                <FormField label="Audit Region">
                  <input type="text" value={formData.auditRegion} onChange={(e) => handleChange('auditRegion', e.target.value)} placeholder="APAC" className={inputCls} />
                </FormField>
                <Checkbox label="Can Audit Expenses" checked={formData.canAuditExpenses} onChange={(v) => handleChange('canAuditExpenses', v)} />
                <Checkbox label="Can Download Reports" checked={formData.canDownloadReports} onChange={(v) => handleChange('canDownloadReports', v)} />
                <Checkbox label="Can View Expense History" checked={formData.canViewExpenseHistory} onChange={(v) => handleChange('canViewExpenseHistory', v)} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-white/5 w-full">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-350 bg-slate-950/20 transition-all cursor-pointer text-center w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-350 bg-slate-950/20 transition-all cursor-pointer text-center w-full sm:w-auto"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer text-center w-full sm:w-auto"
            >
              Register User
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
            <div key={r.id} className={`rounded-2xl p-4 border transition-all ${formData.role === r.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
              <span className={`text-xs font-bold ${formData.role === r.id ? 'text-cyan-400' : 'text-slate-250'}`}>{r.title}</span>
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

