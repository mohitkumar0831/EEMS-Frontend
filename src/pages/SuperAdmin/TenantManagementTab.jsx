import React from 'react';
import { Plus, Building2, CheckCircle2, XCircle } from 'lucide-react';

const FormField = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false, options = [], readOnly = false, disabled = false }) => {
  const [isTouched, setIsTouched] = React.useState(false);

  const handleBlur = () => setIsTouched(true);
  const handleChange = (e) => {
    setIsTouched(true);
    if (onChange) onChange(e);
  };

  const getValidationState = () => {
    if (!isTouched && !value) return null; // Don't validate untouched empty fields

    if (!value) {
      return required ? 'invalid' : null;
    }

    if (type === 'email') {
      // only take .in, .com, .org
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org)$/i;
      return emailRegex.test(value) ? 'valid' : 'invalid';
    }

    if (type === 'tel' || name.toLowerCase().includes('phone')) {
      // exactly 10 digits (allowing optional whitespace/dashes for UX, but strict 10 digits requested: ^\d{10}$)
      const phoneRegex = /^\d{10}$/;
      // if it has plus sign or spaces, let's strip them to check if it's 10 digits? Or strict 10 digits? User said "only take 10 digit"
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length === 10 ? 'valid' : 'invalid';
    }

    if (name === 'postalCode') {
      // exactly 6 digits
      const postalRegex = /^\d{6}$/;
      return postalRegex.test(value) ? 'valid' : 'invalid';
    }

    if (name === 'gstNumber') {
      // GST as per govt rules
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
      return gstRegex.test(value) ? 'valid' : 'invalid';
    }

    if (name === 'city' || name.toLowerCase().includes('name')) {
      // only alphabets and spaces
      // Except companyName which might have numbers, so apply only to adminName and city
      if (name === 'adminName' || name === 'city') {
        const alphaRegex = /^[a-zA-Z\s]+$/;
        return alphaRegex.test(value) ? 'valid' : 'invalid';
      }
    }

    if (type === 'number') {
      return !isNaN(value) && Number(value) > 0 ? 'valid' : 'invalid';
    }

    if (type === 'url') {
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return 'valid';
      } catch {
        return 'invalid';
      }
    }

    return String(value).trim().length > 0 ? 'valid' : 'invalid';
  };

  const validationState = getValidationState();
  const inputClassName = `w-full rounded-xl border bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:ring-1 pr-10 ${validationState === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20' :
    validationState === 'invalid' ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' :
      'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
    }`;

  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="font-medium text-slate-200">
        {label}
        {required ? <span className="ml-1 text-rose-400">*</span> : null}
      </span>
      <div className="relative">
        {type === 'select' ? (
          <select name={name} value={value} onChange={handleChange} onBlur={handleBlur} className={inputClassName} disabled={disabled}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea name={name} value={value} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder} className={`${inputClassName} min-h-24`} readOnly={readOnly} disabled={disabled} />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={inputClassName}
            required={required}
            readOnly={readOnly}
            disabled={disabled}
          />
        )}
        {validationState === 'valid' && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />}
        {validationState === 'invalid' && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500 pointer-events-none" />}
      </div>
    </label>
  );
};

export const TenantManagementTab = ({ tenantsSummary = [], formData, handleFormChange, handleCreateTenant, isFormOpen, setIsFormOpen }) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200">Company Provisioning</h3>
            <p className="text-sm text-slate-400">Create a new tenant company and its provisioning details in one place.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {isFormOpen ? 'Close Form' : 'Add Company'}
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleCreateTenant} className="mt-6 flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" />
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Basic Company Information</h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Company Name" name="companyName" value={formData.companyName} onChange={handleFormChange} placeholder="Acme Corp" required />
                <FormField label="Company Code" name="companyCode" value={formData.companyCode} onChange={handleFormChange} placeholder="ACM001" required />
                <FormField label="Industry Type" name="industry" value={formData.industry} onChange={handleFormChange} type="select" options={[{ value: '', label: 'Select industry' }, { value: 'Technology', label: 'Technology' }, { value: 'Finance', label: 'Finance' }, { value: 'Healthcare', label: 'Healthcare' }, { value: 'Retail', label: 'Retail' }, { value: 'Manufacturing', label: 'Manufacturing' }, { value: 'Education', label: 'Education' }, { value: 'Other', label: 'Other' }]} required />
                <FormField label="Company Registration Number" name="companyRegistrationNumber" value={formData.companyRegistrationNumber} onChange={handleFormChange} placeholder="REG-001234" />
                <FormField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleFormChange} placeholder="GST-123456" />
                <FormField label="Company Website" name="companyWebsite" value={formData.companyWebsite} onChange={handleFormChange} type="url" placeholder="https://example.com" />
                <FormField label="Company Email" name="companyEmail" value={formData.companyEmail} onChange={handleFormChange} type="email" placeholder="contact@company.com" required />
                <FormField label="Company Phone" name="companyPhone" value={formData.companyPhone} onChange={handleFormChange} type="tel" placeholder="+1 555 123 4567" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Company Capacity</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Employee Capacity" name="employeeCapacity" value={formData.employeeCapacity} onChange={handleFormChange} type="number" placeholder="500" />
                <FormField label="Branch Capacity" name="branchCapacity" value={formData.branchCapacity} onChange={handleFormChange} type="number" placeholder="10" />
                {/* <FormField label="Storage Limit (GB)" name="storageLimit" value={formData.storageLimit} onChange={handleFormChange} type="number" placeholder="100" />
                <FormField label="Monthly Expense Limit" name="monthlyExpenseLimit" value={formData.monthlyExpenseLimit} onChange={handleFormChange} type="number" placeholder="50000" /> */}
              </div>
              {/* <p className="mt-3 text-sm text-slate-500">Example: Employee Capacity 500, Branch Capacity 10, Storage 100 GB.</p> */}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Subscription Details</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Subscription Plan" name="subscriptionPlan" value={formData.subscriptionPlan} onChange={handleFormChange} type="select" options={[{ value: 'Free', label: 'Free' }, { value: 'Basic', label: 'Basic' }, { value: 'Standard', label: 'Standard' }, { value: 'Enterprise', label: 'Enterprise' }]} />
                <FormField label="Plan Start Date" name="planStartDate" value={formData.planStartDate} onChange={handleFormChange} type="date" />
                <FormField label="Plan Expiry Date" name="planExpiryDate" value={formData.planExpiryDate} onChange={handleFormChange} type="date" />
                <FormField label="Billing Cycle" name="billingCycle" value={formData.billingCycle} onChange={handleFormChange} type="select" options={[{ value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }, { value: 'Yearly', label: 'Yearly' }]} />
                <FormField label="Subscription Status" name="subscriptionStatus" value={formData.subscriptionStatus} onChange={handleFormChange} type="select" options={[{ value: 'Active', label: 'Active' }, { value: 'Expired', label: 'Expired' }, { value: 'Trial', label: 'Trial' }, { value: 'Suspended', label: 'Suspended' }]} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Company Address</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleFormChange} placeholder="123 Main Street" />
                <FormField label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleFormChange} placeholder="Suite 100" />
                <FormField label="City" name="city" value={formData.city} onChange={handleFormChange} placeholder="New York" />
                <FormField label="State" name="state" value={formData.state} onChange={handleFormChange} placeholder="NY" />
                <FormField label="Country" name="country" value={formData.country} onChange={handleFormChange} type="select" options={[{ value: '', label: 'Select country' }, { value: 'United States', label: 'United States' }, { value: 'United Kingdom', label: 'United Kingdom' }, { value: 'Canada', label: 'Canada' }, { value: 'India', label: 'India' }, { value: 'Australia', label: 'Australia' }, { value: 'Other', label: 'Other' }]} />
                <FormField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleFormChange} placeholder="10001" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Admin Details</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Admin Name" name="adminName" value={formData.adminName} onChange={handleFormChange} placeholder="Alex Admin" required />
                <FormField label="Admin Email" name="adminEmail" value={formData.adminEmail} onChange={handleFormChange} type="email" placeholder="admin@company.com" required />
                <FormField label="Admin Phone" name="adminPhone" value={formData.adminPhone} onChange={handleFormChange} type="tel" placeholder="+1 555 987 6543" />
                <FormField label="Temporary Password" name="temporaryPassword" value={formData.temporaryPassword} onChange={handleFormChange} type="password" placeholder="Auto-generated" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">System Configuration</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Time Zone" name="timeZone" value={formData.timeZone} onChange={handleFormChange} type="select" options={[{ value: '', label: 'Select time zone' }, { value: 'UTC', label: 'UTC' }, { value: 'America/New_York', label: 'America/New_York' }, { value: 'Europe/London', label: 'Europe/London' }, { value: 'Asia/Kolkata', label: 'Asia/Kolkata' }]} />
                <FormField label="Currency" name="currency" value={formData.currency} onChange={handleFormChange} type="select" options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'GBP', label: 'GBP' }, { value: 'INR', label: 'INR' }, { value: 'AUD', label: 'AUD' }]} />
                <FormField label="Date Format" name="dateFormat" value={formData.dateFormat} onChange={handleFormChange} type="select" options={[{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} />
                <FormField label="Language" name="language" value={formData.language} onChange={handleFormChange} type="select" options={[{ value: 'English', label: 'English' }, { value: 'French', label: 'French' }, { value: 'German', label: 'German' }, { value: 'Spanish', label: 'Spanish' }]} />
                <FormField label="Financial Year Start" name="financialYearStart" value={formData.financialYearStart} onChange={handleFormChange} type="date" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Status</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Company Status" name="companyStatus" value={formData.companyStatus} onChange={handleFormChange} type="select" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Suspended', label: 'Suspended' }]} />
                <FormField label="Email Verified" name="emailVerified" value={formData.emailVerified} onChange={handleFormChange} type="select" options={[{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
                <FormField label="Tenant ID" name="tenantId" value={formData.tenantId || 'Auto-generated UUID'} onChange={handleFormChange} readOnly />
                <FormField label="Created Date" name="createdDate" value={formData.createdDate || 'Auto-generated'} onChange={handleFormChange} readOnly />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 active:scale-95">
                <Plus className="h-4 w-4" />
                Provision Tenant Space
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
        <div className="border-b border-white/5 px-6 py-4">
          <h3 className="text-base font-bold text-slate-200">Active Tenants Platform Index</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <th className="px-6 py-4">Tenant Name</th>
                <th className="px-6 py-4">Tenant ID</th>
                <th className="px-6 py-4">Provisioned Date</th>
                <th className="px-6 py-4">Users Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {tenantsSummary.map((t) => {
                return (
                  <tr key={t.tenantId} className="transition-all hover:bg-white/[0.01]">
                    <td className="px-6 py-4 font-semibold text-slate-200">{t.companyName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.tenantId}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-slate-300">{t.totalUsersCount} Users</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
