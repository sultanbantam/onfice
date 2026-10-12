'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  DoorOpen,
  Filter,
  CheckCircle,
  Clock,
  Radio,
} from 'lucide-react';
import { UserProfile, UserRole, OfficeRoom } from '@/lib/types';
import { InviteMemberModal } from './InviteMemberModal';

interface PeopleDirectoryProps {
  members: UserProfile[];
  rooms: OfficeRoom[];
  currentUser: UserProfile;
  onInviteMember: (memberData: { name: string; email: string; title: string; role: UserRole }) => void;
}

export const PeopleDirectory: React.FC<PeopleDirectoryProps> = ({
  members,
  rooms,
  currentUser,
  onInviteMember,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: UserProfile['status']) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Fokus / Busy
          </span>
        );
      case 'in_meeting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Rapat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with Title and Invite Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Direktori Anggota Tim
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lihat ketersediaan, peran akses, dan posisi ruang virtual anggota organisasi.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-sm shadow-indigo-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Anggota</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, jabatan, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 hidden sm:inline">Peran:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Peran ({members.length})</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>

      {/* Members Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const currentRoom = rooms.find((r) => r.id === member.currentRoomId);

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500">{member.title}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    member.role === 'owner'
                      ? 'bg-purple-100 text-purple-700'
                      : member.role === 'admin'
                      ? 'bg-indigo-100 text-indigo-700'
                      : member.role === 'guest'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {member.role}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ketersediaan:</span>
                  {getStatusBadge(member.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ruang Virtual:</span>
                  {currentRoom ? (
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[140px]">{currentRoom.name}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Di luar ruangan</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-[11px] truncate max-w-[170px]">{member.email}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={onInviteMember}
      />
    </div>
  );
};
