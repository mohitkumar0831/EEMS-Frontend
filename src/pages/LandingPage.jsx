import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Users,
  CreditCard,
  ClipboardCheck,
  Lock,
  Globe,
  Star,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Building2,
  FileText,
  Bell,
  Play,
  ArrowRightLeft,
  FileSpreadsheet,
  Check,
  Flag,
  CornerDownRight,
  Cpu
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Interactive Sandbox state
  const [activeSandboxRole, setActiveSandboxRole] = useState('Employee');

  // Interactive Live Pipeline Simulator state
  const [pipeStage, setPipeStage] = useState(0); // 0: Idle, 1: Submitted, 2: Approved, 3: Settled, 4: Audited
  const [pipeLogs, setPipeLogs] = useState([
    { text: 'System ready. Click "Simulate Claim Lifecycle" to begin.', type: 'info' }
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addLog = (text, type = 'info') => {
    setPipeLogs(prev => [...prev, { text, type }]);
  };

  const handleNextPipeStage = () => {
    if (pipeStage === 0) {
      setPipeStage(1);
      setPipeLogs([]);
      addLog('🚀 Employee filed a claim: "Client Lunch" for ₹4,200', 'action');
      addLog('🔍 Compliance engine: Receipt verification PASSED.', 'success');
      addLog('⏳ Status: PENDING_MANAGER_APPROVAL', 'status');
    } else if (pipeStage === 1) {
      setPipeStage(2);
      addLog('✅ Manager (Level 1) approved claim ID: EXP-924', 'action');
      addLog('💬 Manager Comment: "Valid client project alignment."', 'comment');
      addLog('⏳ Status: PENDING_FINANCE_SETTLEMENT', 'status');
    } else if (pipeStage === 2) {
      setPipeStage(3);
      addLog('💳 Finance Team selected payment route: ACH Direct Deposit', 'action');
      addLog('🖨️ Payout slip generated: SLIP-2026-924. Status set to PAID', 'success');
      addLog('⏳ Status: PENDING_COMPLIANCE_AUDIT', 'status');
    } else if (pipeStage === 3) {
      setPipeStage(4);
      addLog('🛡️ Compliance Auditor reviewed chain of custody', 'action');
      addLog('✨ Verdict: AUDITED & CLEARED. Verified signatures match.', 'success');
      addLog('🎉 Lifecycle Complete.', 'status');
    } else {
      setPipeStage(0);
      setPipeLogs([{ text: 'System ready. Click "Simulate Claim Lifecycle" to begin.', type: 'info' }]);
    }
  };

  // Mock Sandbox screens content
  const sandboxScreens = {
    Employee: {
      title: "Employee Portal Sandbox",
      subtitle: "Simplify filing and track reimbursement status",
      stats: [
        { label: "Total Filed", val: "₹12,450" },
        { label: "Approved Spend", val: "₹8,900" },
        { label: "Active Claims", val: "3 Claims" }
      ],
      element: (
        <div className="flex flex-col gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-350">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="font-bold text-slate-200">New Expense Claim Form</span>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">DRAFT</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 block">Title</span>
                <span className="text-slate-200 font-semibold">Tokyo Flight Tickets</span>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 block">Amount</span>
                <span className="text-slate-200 font-semibold">₹42,500</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] text-slate-500 block">Routing Approver</span>
              <span className="text-slate-200 font-semibold">Sarah Connor (Engineering Manager)</span>
            </div>
          </div>
          <button className="bg-cyan-500 text-slate-950 font-bold text-xs py-2 rounded-xl mt-1 flex items-center justify-center gap-1.5 cursor-default">
            <Zap className="w-3.5 h-3.5" /> Submit to Manager
          </button>
        </div>
      )
    },
    Manager: {
      title: "Manager Approval Workspace",
      subtitle: "One-click approval queues with audit note comments",
      stats: [
        { label: "Awaiting Review", val: "5 Claims" },
        { label: "Approved Today", val: "₹18,500" },
        { label: "SLA Deadline", val: "24 Hours" }
      ],
      element: (
        <div className="flex flex-col gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-350">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="font-bold text-slate-200">Pending Claim (EXP-844)</span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">UNDER REVIEW</span>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between"><span className="text-slate-500">Employee:</span><span className="text-slate-300">Priya Mehta</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Category:</span><span className="text-slate-300">Equipment</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Amount:</span><span className="text-teal-400 font-bold">₹12,800</span></div>
          </div>
          <textarea placeholder="Add a comment for the employee..." className="bg-slate-950 border border-slate-900 rounded-xl p-2 text-[10px] resize-none h-12 text-slate-200 placeholder-slate-600 focus:outline-none" readOnly value="Verified. Laptop adapter replacement request approved." />
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button className="border border-white/5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-default"><X className="w-3 h-3" /> Decline</button>
            <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-default"><Check className="w-3 h-3 text-slate-950" /> Approve</button>
          </div>
        </div>
      )
    },
    Finance: {
      title: "Finance Settlement Center",
      subtitle: "Multi-channel settlement engines and instant slips",
      stats: [
        { label: "Disbursed", val: "₹1,42,800" },
        { label: "Pending Payout", val: "₹24,500" },
        { label: "Gateway Status", val: "Active" }
      ],
      element: (
        <div className="flex flex-col gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-350">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="font-bold text-slate-200">Reimbursement Settlement</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">APPROVED</span>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-white/5 flex flex-col gap-1.5">
            <div className="flex justify-between"><span className="text-slate-500">Method:</span><span className="text-slate-300 font-semibold">ACH Direct Deposit</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Beneficiary:</span><span className="text-slate-300">John Smith</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Net Transfer:</span><span className="text-teal-400 font-extrabold">₹3,400</span></div>
          </div>
          <button className="bg-cyan-500 text-slate-950 font-bold text-xs py-2 rounded-xl mt-1 flex items-center justify-center gap-1.5 cursor-default">
            <CreditCard className="w-3.5 h-3.5" /> Disburse &amp; Print Slip
          </button>
        </div>
      )
    },
    Auditor: {
      title: "Compliance Audit Console",
      subtitle: "Review chain of custody timeline and issue compliance clearance",
      stats: [
        { label: "Audited Ledger", val: "94%" },
        { label: "Flagged Risks", val: "2 Alerts" },
        { label: "Workspace Health", val: "Optimal" }
      ],
      element: (
        <div className="flex flex-col gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs text-slate-350">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="font-bold text-slate-200">Chain of Custody Ledger</span>
            <span className="text-[10px] text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded-full">AUDIT_PENDING</span>
          </div>
          <div className="flex flex-col gap-2 pl-3 border-l border-slate-900 py-1 text-[9px]">
            <div className="flex flex-col gap-0.5"><span className="text-slate-200 font-bold">1. File Created</span><span className="text-slate-500">Priya Mehta on 14/06/2026</span></div>
            <div className="flex flex-col gap-0.5"><span className="text-slate-200 font-bold">2. Manager Approved</span><span className="text-slate-500">L1 Sarah Connor with comments</span></div>
            <div className="flex flex-col gap-0.5"><span className="text-slate-200 font-bold">3. Finance Paid</span><span className="text-slate-500">Disbursed via ACH bank wire</span></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button className="border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-default"><Flag className="w-3 h-3" /> Flag Irregularity</button>
            <button className="bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl flex items-center justify-center gap-1 cursor-default"><Shield className="w-3 h-3 text-slate-950" /> Clear &amp; File</button>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans overflow-x-hidden relative">

      {/* Decorative High-Tech Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[120px]" />
      </div>

      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Expense<span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Flow</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <a href="#sandbox" className="hover:text-cyan-400 transition-colors">Sandbox Preview</a>
              <a href="#simulator" className="hover:text-cyan-400 transition-colors">Flow Simulator</a>
              <a href="#compliance" className="hover:text-cyan-400 transition-colors">Compliance</a>
              <a href="#integration" className="hover:text-cyan-400 transition-colors">Integrations</a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white border border-white/5 hover:border-white/10 rounded-xl transition-all">Sign In</Link>
              {/* <Link to="/register" className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl shadow-lg shadow-cyan-500/10 transition-all">Register Company</Link> */}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-white/5 px-4 py-4 flex flex-col gap-3">
            <a href="#sandbox" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-350 py-1.5">Sandbox Preview</a>
            <a href="#simulator" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-350 py-1.5">Flow Simulator</a>
            <a href="#compliance" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-350 py-1.5">Compliance</a>
            <a href="#integration" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-350 py-1.5">Integrations</a>
            <div className="flex gap-3 pt-2 border-t border-white/5">
              <Link to="/login" className="flex-1 text-center py-2 text-xs font-bold border border-white/5 rounded-xl text-slate-300">Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-xl">Register</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Headline */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" /> Next-Gen Spend Automation
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-100">
              Automate expense flows with absolute{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                transparency
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Design custom approval pipelines, verify compliance logs with a dedicated auditor dashboard, and process instant reimbursements in Indian Rupee (₹).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all text-xs">
                Get Started Free
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-xs bg-slate-900/30">
                Explore Demo Roles
              </Link>
            </div>

            {/* Quick statistics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 w-full mt-4">
              <div>
                <span className="text-xl font-extrabold text-slate-100">6 Roles</span>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">RBAC Guards</p>
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-100">₹ INR</span>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Localised Ledger</p>
              </div>
              <div>
                <span className="text-xl font-extrabold text-slate-100">5 Stages</span>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Audit Pipeline</p>
              </div>
            </div>
          </div>

          {/* Right Column: Code/UI Mockup */}
          <div className="lg:col-span-6 w-full">
            <div className="relative bg-slate-950/80 border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-600 font-mono tracking-wider">production_dashboard_preview.sh</span>
                <div className="w-4 h-4 rounded bg-slate-900 border border-white/5 flex items-center justify-center"><ChevronDown className="w-3 h-3 text-slate-500" /></div>
              </div>

              {/* Main content - Dynamic role preview screen */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Workspace Sandbox</span>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{activeSandboxRole} Dashboard</span>
                </div>

                {/* Simulated workspace stats */}
                <div className="grid grid-cols-3 gap-2">
                  {sandboxScreens[activeSandboxRole].stats.map((s, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-2.5 rounded-xl border border-white/5 text-center">
                      <span className="text-[9px] text-slate-500 block truncate">{s.label}</span>
                      <span className="text-xs font-extrabold text-slate-200 block mt-0.5">{s.val}</span>
                    </div>
                  ))}
                </div>

                {/* Dashboard window render */}
                {sandboxScreens[activeSandboxRole].element}
              </div>

              {/* Footer Switcher */}
              <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-white/5 mt-2 justify-between">
                {Object.keys(sandboxScreens).map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveSandboxRole(role)}
                    className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${activeSandboxRole === role
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-extrabold'
                      : 'text-slate-500 hover:text-slate-350'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Interactive Workflow Pipeline Simulator ── */}
      <section id="simulator" className="py-24 px-4 border-y border-white/5 bg-slate-950/30">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Play className="w-3.5 h-3.5" /> Interactive Demo Sandbox
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">Live Transaction Flow Engine</h2>
            <p className="text-slate-500 text-xs max-w-md">
              Trace how a single claim travels from employee creation to auditor review in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Visual Steps Map */}
            <div className="md:col-span-7 bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="flex flex-col gap-5">
                {[
                  { stage: 1, label: 'Employee Submission', desc: 'Filing expense with receipts & manager assignment' },
                  { stage: 2, label: 'Manager Review', desc: 'Multi-level approval verification and optional audit trails' },
                  { stage: 3, label: 'Finance Disbursement', desc: 'Disbursement routing selection and payment slip generation' },
                  { stage: 4, label: 'Auditor Oversight', desc: 'Workspace audits, transaction ledger locks, and validation status' }
                ].map(step => {
                  const isActive = pipeStage >= step.stage;
                  const isCurrent = pipeStage === step.stage;
                  return (
                    <div key={step.stage} className="flex gap-4 relative">
                      {step.stage < 4 && (
                        <div className={`absolute left-[17px] top-9 bottom-[-16px] w-[2px] transition-colors duration-300 ${pipeStage > step.stage ? 'bg-cyan-500' : 'bg-slate-900'}`} />
                      )}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 z-10 ${isCurrent
                        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 animate-pulse'
                        : isActive
                          ? 'bg-slate-900 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-950 text-slate-650 border border-slate-900'
                        }`}>
                        {step.stage}
                      </div>
                      <div className="flex flex-col pt-0.5">
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-slate-100' : 'text-slate-500'}`}>{step.label}</span>
                        <span className={`text-[10px] mt-0.5 transition-colors ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start mt-8 pt-4 border-t border-slate-900">
                <button
                  onClick={handleNextPipeStage}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  {pipeStage === 0
                    ? 'Start Flow Simulation'
                    : pipeStage === 4
                      ? 'Reset Sandbox Engine'
                      : 'Trigger Next Phase approval'}
                </button>
              </div>
            </div>

            {/* Simulated Live Console Log */}
            <div className="md:col-span-5 bg-slate-950 border border-white/5 p-5 rounded-3xl flex flex-col shadow-2xl font-mono text-[10px] min-h-[300px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-900 text-slate-550">
                <span className="uppercase font-bold tracking-wider">Transaction Kernel Logs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex-grow flex flex-col gap-2.5 overflow-y-auto mt-4 pr-1 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                {pipeLogs.map((log, idx) => {
                  const cls = log.type === 'action' ? 'text-cyan-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'status' ? 'text-violet-400' : log.type === 'comment' ? 'text-amber-400 italic' : 'text-slate-500';
                  return (
                    <div key={idx} className="flex gap-1.5 items-start leading-relaxed">
                      <span className="text-slate-700 shrink-0">&gt;</span>
                      <p className={cls}>{log.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Strengths — Features (3-column) ── */}
      <section id="compliance" className="py-24 px-4 max-w-7xl mx-auto flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Shield className="w-3.5 h-3.5" /> Compliance Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Security &amp; Policy Enforcement</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Compliance Oversight", desc: "Random sampling thresholds, auto-flagging of claims exceeding preset limits, and validation parameters set directly by Company Admin.", icon: Shield },
            { title: "Chain of Custody Traces", desc: "No database edit goes untracked. Every claim contains a serialised array logging every action, actor, message, and timestamp.", icon: FileSpreadsheet },
            { title: "Real-time Verification", desc: "Instantly check user roles and permissions on every action. Multi-tenant code architecture ensures data isolation.", icon: Lock }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 hover:border-white/10 hover:bg-slate-900/60 transition-all shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Integrations ── */}
      <section id="integration" className="py-24 px-4 border-t border-white/5 bg-slate-950/20">
        <div className="max-w-4xl mx-auto flex flex-col gap-10 text-center items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Building2 className="w-3.5 h-3.5" /> Integration Ready
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fits into your existing enterprise stack</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
            Export transaction logs to your bookkeeping systems with native CSV outputs. Direct bank integrations support automated payouts upon finance team clearance.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4">
            <div className="border border-white/5 bg-slate-900/20 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-350">SAP Concur</div>
            <div className="border border-white/5 bg-slate-900/20 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-350">Tally Integration</div>
            <div className="border border-white/5 bg-slate-900/20 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-350">Oracle NetSuite</div>
            <div className="border border-white/5 bg-slate-900/20 px-4 py-3 rounded-2xl text-xs font-semibold text-slate-350">QuickBooks Online</div>
          </div>
        </div>
      </section>

      {/* ── CTA / Getting Started ── */}
      <section className="py-28 px-4 text-center flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-transparent blur-3xl" />
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">Ready to automate your expense ledger?</h2>
        <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
          Create a corporate tenant workspace and onboard your employees in less than 5 minutes.
        </p>
        <div className="flex gap-3 mt-2">
          <Link to="/register" className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 cursor-pointer">Register Workspace</Link>
          <Link to="/login" className="px-5 py-3 border border-white/5 hover:border-white/10 text-slate-300 font-bold text-xs rounded-xl transition-all bg-slate-900/30">Sign In</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 bg-slate-950/80 px-4 py-12 text-xs text-slate-650">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-slate-200 text-sm">
              Expense<span className="text-cyan-400">Flow</span>
            </span>
          </div>
          <span>© 2026 ExpenseFlow Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-cyan-500" /> Enterprise-grade security protocol</span>
        </div>
      </footer>

    </div>
  );
};
