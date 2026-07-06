import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import {
  User,
  Mail,
  Building2,
  Shield,
  Briefcase,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Key,
  Clock,
  Activity
} from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, color = 'text-indigo-400' }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg bg-slate-950/50 border border-white/5 flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
    <span className="text-xs font-semibold text-slate-200">{value || '—'}</span>
  </div>
);

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, tenants } = useAppState();

  const [realTenantName, setRealTenantName] = useState('Loading...');

  useEffect(() => {
    const fetchTenantName = async () => {
      if (currentUser?.tenantSlug && currentUser.tenantSlug !== 'platform') {
        try {
          const res = await fetch(`http://localhost:4000/api/v1/tenants/${currentUser.tenantSlug}`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
          });
          const data = await res.json();
          if (data.success && data.data) {
            setRealTenantName(data.data.companyName);
          } else {
            setRealTenantName('Unknown Company');
          }
        } catch (error) {
          console.error('Error fetching tenant name:', error);
          setRealTenantName('Unknown Company');
        }
      } else if (currentUser?.tenantId === 'platform' || currentUser?.role === 'SuperAdmin') {
        setRealTenantName('Platform Owner');
      } else {
        const name = tenants.find(t => t.id === currentUser?.tenantId)?.name || 'Unknown Company';
        setRealTenantName(name);
      }
    };
    fetchTenantName();
  }, [currentUser?.tenantSlug, currentUser?.tenantId, currentUser?.token, currentUser?.role, tenants]);

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  const roleColors = {
    SuperAdmin:    'from-rose-500 to-pink-600',
    CompanyAdmin:  'from-indigo-500 to-purple-600',
    Manager:       'from-emerald-500 to-teal-600',
    Employee:      'from-amber-500 to-orange-500',
    'Finance Team':'from-sky-500 to-blue-600',
    Auditor:       'from-violet-500 to-purple-600',
  };
  const gradClass = roleColors[currentUser?.role] || 'from-indigo-500 to-purple-600';

  const recentActivity = [
    { action: 'Logged In',        time: 'Just now',  icon: Activity },
    { action: 'Dashboard Viewed', time: '2m ago',    icon: Clock    },
    { action: 'Session Started',  time: '5m ago',    icon: Key      },
  ];

  if (!currentUser) return null;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header Card */}
      <div className="bg-slate-900/70 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover gradient */}
        <div className={`h-28 bg-gradient-to-r ${gradClass} opacity-20`} />

        <div className="px-8 pb-8 -mt-14 flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${gradClass} flex items-center justify-center font-extrabold text-3xl text-white shadow-2xl border-4 border-slate-900 shrink-0`}>
            {initials}
          </div>

          <div className="flex flex-col gap-1 flex-grow min-w-0 pt-2 sm:pt-0">
            <h2 className="text-xl font-extrabold text-slate-100">{currentUser.name}</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{currentUser.role}</span>
            <span className="text-[11px] text-slate-500">{realTenantName}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Account Information */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-1 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Account Information
          </h3>
          <InfoRow icon={User}      label="Full Name"   value={currentUser.name} />
          <InfoRow icon={Mail}      label="Email"       value={currentUser.email} color="text-sky-400" />
          <InfoRow icon={Shield}    label="Role"        value={currentUser.role}  color="text-violet-400" />
          <InfoRow icon={Building2} label="Company"     value={realTenantName}        color="text-emerald-400" />
          <InfoRow icon={Briefcase} label="Department"  value={currentUser.department || 'N/A'} color="text-amber-400" />
        </div>

        {/* Security */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-1 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            Security & Access
          </h3>
          <InfoRow icon={Activity}  label="Access Level"   value={currentUser.role}              color="text-violet-400" />
          <InfoRow icon={Lock}      label="Account Status" value="Active"                        color="text-emerald-400" />
          <InfoRow icon={Clock}     label="Member Since"   value="January 2026"                  color="text-sky-400" />
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          Recent Activity
        </h3>
        <div className="flex flex-col gap-3">
          {recentActivity.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-950/50 border border-white/5 flex items-center justify-center text-violet-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-slate-300 font-medium">{item.action}</span>
                </div>
                <span className="text-[10px] text-slate-600">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
