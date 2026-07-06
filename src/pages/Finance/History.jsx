import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/StateContext';
import { EXPENSE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/apiConstants';
import { PageSkeleton } from '../../components/PageSkeleton';

export const FinanceHistory = () => {
  const { currentUser, showToast } = useAppState();
  const [paidHistory, setPaidHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debugging logs to verify if it's continuously rendering
  console.log('FinanceHistory Rendered. CurrentUser ID:', currentUser?.id, 'TenantSlug:', currentUser?.tenantSlug);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser?.tenantSlug || !currentUser?.id) return;
      try {
        setLoading(true);
        // Fetch payouts for this specific finance user
        const expRes = await fetch(EXPENSE_ENDPOINTS.GET_FINANCE_PAYOUTS(currentUser.tenantSlug, currentUser.id), {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        
        if (!expRes.ok) {
          throw new Error(`Server returned ${expRes.status}`);
        }
        const expData = await expRes.json();

        // Fetch employees to map names
        const empRes = await fetch(USER_ENDPOINTS.GET_EMPLOYEES(currentUser.tenantSlug), {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        
        if (!empRes.ok) {
          throw new Error(`Server returned ${empRes.status}`);
        }
        const empData = await empRes.json();

        if (expData.success && empData.success) {
          const empMap = {};
          empData.data.forEach(e => {
            empMap[e._id] = e;
          });

          const mapped = expData.data.map(exp => ({
            id: exp._id,
            title: exp.title,
            amount: exp.amount,
            date: new Date(exp.updatedAt).toLocaleDateString(), // Disbursed date
            employeeName: empMap[exp.employeeId] ? `${empMap[exp.employeeId].firstName} ${empMap[exp.employeeId].lastName}` : 'Unknown Employee',
            status: exp.status
          }));
          
          setPaidHistory(mapped);
        } else {
          showToast('Failed to load payout history', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Error loading history', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [currentUser?.id, currentUser?.tenantSlug]);

  if (!currentUser) return null;

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-slate-200">Reimbursement Payout Registry</h3>
      </div>
      {loading ? (
        <PageSkeleton />
      ) : paidHistory.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-sm">No processed payments in the ledger.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Disbursement Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paidHistory.map(exp => (
                <tr key={exp.id} className="hover:bg-white/[0.01] transition-all text-slate-300">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{exp.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{exp.employeeName}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{exp.title}</td>
                  <td className="px-6 py-4 font-extrabold text-emerald-400">₹{exp.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-400">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
