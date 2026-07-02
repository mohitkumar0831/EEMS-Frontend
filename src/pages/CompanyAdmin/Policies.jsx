import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { PoliciesTab } from './PoliciesTab';

export const Policies = () => {
  const { currentUser, policies, addCompanyPolicy, updateCompanyPolicy } = useAppState();
  const [newCategory, setNewCategory] = useState('Meals');
  const [newLimit, setNewLimit] = useState('');
  const [newRule, setNewRule] = useState('');

  const tenantPolicies = policies.filter(p => p.tenantId === currentUser?.tenantId);

  const handleAddPolicy = (e) => {
    e.preventDefault();
    if (!newLimit || !newRule.trim()) return;
    addCompanyPolicy(newCategory, newLimit, newRule);
    setNewLimit('');
    setNewRule('');
  };

  return (
    <PoliciesTab
      tenantPolicies={tenantPolicies}
      newCategory={newCategory}
      setNewCategory={setNewCategory}
      newLimit={newLimit}
      setNewLimit={setNewLimit}
      newRule={newRule}
      setNewRule={setNewRule}
      handleAddPolicy={handleAddPolicy}
      updateCompanyPolicy={updateCompanyPolicy}
    />
  );
};
