'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  DoorOpen,
  LogOut,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';
import { UserProfile, OfficeRoom, AvailabilityStatus } from '@/lib/types';

interface AppHeaderProps {
  currentUser: UserProfile;
  currentRoom: OfficeRoom | null;
  onUpdateStatus: (status: AvailabilityStatus) => void;
  onLeaveRoom: () => void;
  onQuickAction: (action: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  currentRoom,
  onUpdateStatus,
  onLeaveRoom,
  onQuickAction,
  searchQuery,
  onSearchChange,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statuses: { id: AvailabilityStatus; label: string; color: string }[] = [
    { id: 'online', label: 'Online & Available', color: 'bg-emerald-500' },
    { id: 'busy', label: 'Busy (Focus Mode)', color: 'bg-rose-500' },
    { id: 'in_meeting', label: 'In Meeting', color: 'bg-amber-500' },
    { id: 'away', label: 'Away', color: 'bg-slate-400' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Workspace Quick Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, proyek, anggota, atau ruang..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right controls: Room Presence, Status Badge, Quick AI */}
      <div className="flex items-center gap-3">
        {/* Virtual Room Presence pill */}
        {currentRoom ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-900 font-medium animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="truncate max-w-[140px]">{currentRoom.name}</span>
            <button
              onClick={onLeaveRoom}
              title="Keluar dari ruangan ini"
              className="ml-1 text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Di luar ruangan</span>
          </div>
        )}

        {/* User Availability Status Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentUser.status === 'online'
                  ? 'bg-emerald-500'
                  : currentUser.status === 'busy'
                  ? 'bg-rose-500'
                  : currentUser.status === 'in_meeting'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="capitalize">{currentUser.status.replace('_', ' ')}</span>
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status Ketersediaan
              </div>
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onUpdateStatus(s.id);
                    setShowStatusMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                    currentUser.status === s.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action button */}
        <button
          onClick={() => onQuickAction('new_task')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-all shadow-indigo-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tugas Baru</span>
        </button>
      </div>
    </header>
  );
};
