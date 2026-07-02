import React, { useState } from 'react';
import { WorkflowsTab } from './WorkflowsTab';
import { useAppState } from '../../context/StateContext';

export const Workflows = () => {
  const { showToast, addAuditLog, currentUser } = useAppState();

  const [approvalLevels, setApprovalLevels] = useState([
    { level: 1, role: 'Manager', limit: 500, desc: 'Requires manager approval for claims under ₹500' },
    { level: 2, role: 'Finance Team', limit: 2000, desc: 'Requires finance verification for claims up to ₹2000' },
    { level: 3, role: 'Company Admin / Executive', limit: 999999, desc: 'Requires executive sign-off for claims above ₹2000' }
  ]);

  const [submissionSettings, setSubmissionSettings] = useState({
    receiptRequiredLimit: 50,
    submissionWindow: 30,
    monthlyExpenseCap: 5000,
    allowMileage: true,
  });

  const [managerSettings, setManagerSettings] = useState({
    autoApproveUnder: 25,
    escalationDays: 5,
  });

  const [financeSettings, setFinanceSettings] = useState({
    disbursementMethod: 'ACH Direct Deposit',
    strictPolicyCheck: 'Standard',
    autoPayment: false,
  });

  const [auditorSettings, setAuditorSettings] = useState({
    auditSamplingRate: 15,
    highRiskFlagLimit: 1000,
    notifyAdminOnViolation: true,
  });

  const handleLevelLimitChange = (index, value) => {
    setApprovalLevels(prev => prev.map((l, i) => {
      if (i === index) {
        const limitVal = value === '' ? '' : parseFloat(value);
        let desc = '';
        if (l.level === 1) {
          desc = `Requires manager approval for claims under ₹${limitVal}`;
        } else if (l.level === 2) {
          desc = `Requires finance verification for claims up to ₹${limitVal}`;
        } else {
          desc = `Requires executive sign-off for claims above the finance limit`;
        }
        return { ...l, limit: limitVal, desc };
      }
      return l;
    }));
  };

  const handleSaveSettings = () => {
    showToast('Workflow architecture updated successfully!', 'success');
    addAuditLog('Workflow Updated', 'Updated global expense approval and audit thresholds', currentUser?.tenantId);
  };

  return (
    <WorkflowsTab 
      approvalLevels={approvalLevels} 
      handleLevelLimitChange={handleLevelLimitChange}
      submissionSettings={submissionSettings}
      setSubmissionSettings={setSubmissionSettings}
      managerSettings={managerSettings}
      setManagerSettings={setManagerSettings}
      financeSettings={financeSettings}
      setFinanceSettings={setFinanceSettings}
      auditorSettings={auditorSettings}
      setAuditorSettings={setAuditorSettings}
      handleSaveSettings={handleSaveSettings}
    />
  );
};
