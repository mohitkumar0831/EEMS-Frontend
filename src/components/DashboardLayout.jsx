import React, { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/StateContext';
import { LogOut, Bell, Shield, Menu, X, ChevronDown, ChevronRight, User, Briefcase, Building2 } from 'lucide-react';

export const DashboardLayout = ({ menuItems, children, activeTab: externalActiveTab, setActiveTab }) => {
  const { currentUser, tenants, logout } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const profileRef = useRef(null);
  const currentPath = location.pathname.split('/').pop();

  // Track open/closed state of submenus
  const [openSubmenus, setOpenSubmenus] = useState(() => {
    const initial = {};
    menuItems.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(sub =>
          location.pathname.includes(sub.path)
        );
        if (hasActiveChild) {
          initial[item.id] = true;
        }
      }
    });
    return initial;
  });

  // Auto-expand menu containing current active route
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(sub =>
          location.pathname.includes(sub.path)
        );
        if (hasActiveChild) {
          setOpenSubmenus(prev => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [location.pathname, menuItems]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleSubmenu = (id) => {
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeTab = typeof externalActiveTab !== 'undefined' && externalActiveTab !== null
    ? externalActiveTab
    : menuItems.find(item => item.path === currentPath)?.id || menuItems[0]?.id || '';

  const tenantName = currentUser?.tenantId === 'platform'
    ? 'Platform Owner'
    : (tenants.find(t => t.id === currentUser?.tenantId)?.name || 'Unknown Company');

  const notifications = [
    { id: 1, text: 'New policy violation flagged: Screen Purchase limit exceeded', time: '10m ago' },
    { id: 2, text: 'Expense claim approved by John Approver', time: '2h ago' },
    { id: 3, text: 'Travel authorization request pending review', time: '1d ago' }
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 relative">

      {/* Mobile Sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 flex flex-col transition-transform duration-300 md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Sidebar Header */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              ExpenseFlow
            </span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="p-5 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[170px]">{currentUser?.name}</span>
              <span className="text-[10px] font-extrabold tracking-wider text-purple-400 uppercase truncate max-w-[170px]">{currentUser?.role}</span>
              <span className="text-[9px] text-slate-500 truncate max-w-[170px] mt-0.5">{tenantName}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const useTabNavigation = typeof setActiveTab === 'function';

              // If it's a submenu parent item
              if (item.subItems) {
                const isOpen = !!openSubmenus[item.id];
                const isAnyChildActive = item.subItems.some(sub =>
                  location.pathname.includes(sub.path)
                );

                return (
                  <li key={item.id} className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all cursor-pointer ${isAnyChildActive
                        ? 'text-indigo-400 bg-indigo-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {isOpen && (
                      <ul className="flex flex-col gap-0.5 pl-4 mt-0.5 border-l border-slate-800 ml-6">
                        {item.subItems.map((sub) => (
                          <li key={sub.id}>
                            <NavLink
                              to={sub.path || '#'}
                              relative="path"
                              end
                              className={({ isActive: navActive }) => `w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${navActive
                                ? 'text-indigo-400 bg-indigo-500/5 font-bold'
                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.01]'
                                }`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // Otherwise render flat menu item
              const isActive = item.id === activeTab;
              return (
                <li key={item.id}>
                  {useTabNavigation ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all cursor-pointer ${isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                        }`}>
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path || '#'}
                      relative="path"
                      end
                      className={({ isActive: navActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${navActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                        }`}>
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              const slug = currentUser?.tenantSlug;
              const isTenant = currentUser && currentUser.role !== 'SuperAdmin' && slug;
              logout();
              if (isTenant) {
                navigate(`/${slug}`, { replace: true });
              } else {
                navigate('/login', { replace: true });
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow md:pl-72 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 text-slate-400 hover:text-slate-200 md:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-100 capitalize">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-md shadow-rose-500" />
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 animate-slide-in flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-200">System Notifications</span>
                    <span className="text-[9px] font-bold text-indigo-400 hover:underline cursor-pointer">Mark all read</span>
                  </div>
                  <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="flex flex-col gap-1 p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                        <p className="text-xs text-slate-300 leading-normal">{n.text}</p>
                        <span className="text-[9px] text-slate-500 align-right self-end">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Profile Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(prev => !prev);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">
                  {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ME'}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {/* User identity header */}
                  <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-white/[0.01]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                      {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ME'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">{currentUser?.role}</span>
                      <span className="text-[9px] text-slate-500 truncate">{currentUser?.email}</span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2 flex flex-col gap-0.5">
                    <button
                      onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      View Profile
                    </button>
                    {/* <button
                      onClick={() => { setShowProfileMenu(false); navigate(`${location.pathname}`); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all text-left cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      My Dashboard
                    </button> */}
                  </div>

                  {/* Sign out */}
                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        const slug = currentUser?.tenantSlug;
                        const isTenant = currentUser && currentUser.role !== 'SuperAdmin' && slug;
                        logout();
                        if (isTenant) {
                          navigate(`/${slug}`, { replace: true });
                        } else {
                          navigate('/login', { replace: true });
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Canvas Container */}
        <main className="flex-grow p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
