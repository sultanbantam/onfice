'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  DoorOpen,
  Bot,
  FileText,
  CalendarDays,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, WorkspaceOrganization } from '@/lib/types';

export type NavTab = 'home' | 'people' | 'projects' | 'rooms' | 'ai' | 'documents' | 'meetings';

interface AppSidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  organization: WorkspaceOrganization;
  currentUser: UserProfile;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onSelectTab,
  organization,
  currentUser,
}) => {
  const mainNavItems = [
    { id: 'home' as NavTab, label: 'Home', icon: LayoutDashboard, badge: null },
    { id: 'people' as NavTab, label: 'People', icon: Users, badge: null },
    { id: 'projects' as NavTab, label: 'Projects & Tasks', icon: FolderKanban, badge: null },
    { id: 'rooms' as NavTab, label: 'Office Rooms', icon: DoorOpen, badge: 'Live 2D' },
    { id: 'ai' as NavTab, label: 'AI Assistant', icon: Bot, badge: 'Copilot' },
  ];

  const secondaryNavItems = [
    { id: 'documents' as NavTab, label: 'Documents', icon: FileText },
    { id: 'meetings' as NavTab, label: 'Meetings & Agenda', icon: CalendarDays },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none transition-all">
      {/* Workspace Brand / Org Selector */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate tracking-tight">
              {organization.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                {organization.plan} Workspace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation (5 primary areas) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Workspace
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Contextual Modules */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Resources & Agenda
          </div>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Security & RLS Status indicator */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tenant Isolation Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          RLS policy & disk persistence terproteksi per organisasi.
        </p>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-semibold text-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                currentUser.status === 'online'
                  ? 'bg-emerald-400'
                  : currentUser.status === 'busy'
                  ? 'bg-rose-400'
                  : currentUser.status === 'in_meeting'
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{currentUser.title}</div>
          </div>
          <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
            {currentUser.role}
          </div>
        </div>
      </div>
    </aside>
  );
};
