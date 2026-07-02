import React, { useState } from 'react';
import {
  User,
  Users,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Check,
  ChevronDown
} from 'lucide-react';

// Simple labeled input
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-400 font-medium">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all';

const selectCls =
  'w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer';

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl">
    <span className="text-xs text-slate-300">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  </div>
);

export const WorkflowsTab = ({
  approvalLevels,
  handleLevelLimitChange,
  submissionSettings,
  setSubmissionSettings,
  managerSettings,
  setManagerSettings,
  financeSettings,
  setFinanceSettings,
  auditorSettings,
  setAuditorSettings,
  handleSaveSettings
}) => {
  const [activeStage, setActiveStage] = useState('employee');

  const stages = [
    { id: 'employee', label: 'Submission', role: 'Employee', icon: User },
    { id: 'manager', label: 'Approval', role: 'Manager', icon: Users },
    { id: 'finance', label: 'Disbursement', role: 'Finance Team', icon: Briefcase },
    { id: 'auditor', label: 'Auditing', role: 'Auditor', icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-slate-100">Expense Workflow</h3>
        <p className="text-slate-500 text-xs mt-1">
          Configure the approval pipeline for your company's expense claims.
        </p>
      </div>

      {/* Pipeline stepper */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <div key={stage.id} className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex-1 flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all text-left ${isActive
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{stage.role}</span>
                    <span className="text-xs font-bold truncate">{stage.label}</span>
                  </div>
                </button>
                {idx < 3 && (
                  <ArrowRight className="w-4 h-4 text-slate-700 hidden md:block shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">

        {/* Stage label */}
        <div className="pb-3 border-b border-white/5">
          <h4 className="text-sm font-bold text-slate-200">
            {stages.find(s => s.id === activeStage)?.role} — {stages.find(s => s.id === activeStage)?.label} Settings
          </h4>
        </div>

        {/* ── Employee: Submission ── */}
        {activeStage === 'employee' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Receipt Required Above (₹)">
              <input
                type="number"
                value={submissionSettings.receiptRequiredLimit}
                onChange={e => setSubmissionSettings(prev => ({ ...prev, receiptRequiredLimit: parseInt(e.target.value) || 0 }))}
                className={inputCls}
              />
            </Field>
            <Field label="Submission Window (Days)">
              <input
                type="number"
                value={submissionSettings.submissionWindow}
                onChange={e => setSubmissionSettings(prev => ({ ...prev, submissionWindow: parseInt(e.target.value) || 0 }))}
                className={inputCls}
              />
            </Field>
            <Field label="Monthly Expense Cap (₹)">
              <input
                type="number"
                value={submissionSettings.monthlyExpenseCap}
                onChange={e => setSubmissionSettings(prev => ({ ...prev, monthlyExpenseCap: parseInt(e.target.value) || 0 }))}
                className={inputCls}
              />
            </Field>
            <div className="flex items-end">
              <Toggle
                label="Allow Mileage Claims"
                checked={submissionSettings.allowMileage}
                onChange={v => setSubmissionSettings(prev => ({ ...prev, allowMileage: v }))}
              />
            </div>
          </div>
        )}

        {/* ── Manager: Approval ── */}
        {activeStage === 'manager' && (
          <div className="flex flex-col gap-4">
            {/* Approval Levels */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Approval Thresholds</span>
              {approvalLevels.map((lvl, idx) => (
                <div key={lvl.level} className="flex items-center justify-between p-3.5 bg-slate-950/30 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold">
                      L{lvl.level}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{lvl.role}</span>
                      <span className="text-[10px] text-slate-500">{lvl.desc}</span>
                    </div>
                  </div>
                  {lvl.level !== 3 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Limit (₹)</span>
                      <input
                        type="number"
                        value={lvl.limit}
                        onChange={e => handleLevelLimitChange(idx, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-200 w-24 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">Unlimited</span>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Auto-Approve Claims Under (₹)">
                <input
                  type="number"
                  value={managerSettings.autoApproveUnder}
                  onChange={e => setManagerSettings(prev => ({ ...prev, autoApproveUnder: parseInt(e.target.value) || 0 }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Escalation SLA (Days)">
                <input
                  type="number"
                  value={managerSettings.escalationDays}
                  onChange={e => setManagerSettings(prev => ({ ...prev, escalationDays: parseInt(e.target.value) || 0 }))}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── Finance: Disbursement ── */}
        {activeStage === 'finance' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Disbursement Method">
                <select
                  value={financeSettings.disbursementMethod}
                  onChange={e => setFinanceSettings(prev => ({ ...prev, disbursementMethod: e.target.value }))}
                  className={selectCls}
                >
                  <option value="ACH Direct Deposit">ACH Direct Deposit</option>
                  <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                  <option value="Company Payroll Integration">Payroll Integration</option>
                  <option value="Corporate Expense Card">Corporate Card Credits</option>
                </select>
              </Field>
              <Field label="Policy Enforcement">
                <select
                  value={financeSettings.strictPolicyCheck}
                  onChange={e => setFinanceSettings(prev => ({ ...prev, strictPolicyCheck: e.target.value }))}
                  className={selectCls}
                >
                  <option value="Strict">Strict (Block violations)</option>
                  <option value="Standard">Standard (Flag & Review)</option>
                  <option value="Relaxed">Relaxed (Warning only)</option>
                </select>
              </Field>
            </div>
            <Toggle
              label="Auto-Disburse Auto-Approved Claims"
              checked={financeSettings.autoPayment}
              onChange={v => setFinanceSettings(prev => ({ ...prev, autoPayment: v }))}
            />
          </div>
        )}

        {/* ── Auditor: Auditing ── */}
        {activeStage === 'auditor' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={`Audit Sampling Rate (${auditorSettings.auditSamplingRate}%)`}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={auditorSettings.auditSamplingRate}
                  onChange={e => setAuditorSettings(prev => ({ ...prev, auditSamplingRate: parseInt(e.target.value) || 0 }))}
                  className="accent-indigo-500 w-full mt-1"
                />
              </Field>
              <Field label="High-Risk Flag Threshold (₹)">
                <input
                  type="number"
                  value={auditorSettings.highRiskFlagLimit}
                  onChange={e => setAuditorSettings(prev => ({ ...prev, highRiskFlagLimit: parseInt(e.target.value) || 0 }))}
                  className={inputCls}
                />
              </Field>
            </div>
            <Toggle
              label="Alert Admin on Audit Failures"
              checked={auditorSettings.notifyAdminOnViolation}
              onChange={v => setAuditorSettings(prev => ({ ...prev, notifyAdminOnViolation: v }))}
            />
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

    </div>
  );
};
