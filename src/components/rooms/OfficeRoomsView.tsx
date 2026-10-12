'use client';

import React, { useState } from 'react';
import {
  DoorOpen,
  Users,
  LogIn,
  LogOut,
  Shield,
  FolderKanban,
  Headphones,
  Coffee,
  Sparkles,
  Info,
} from 'lucide-react';
import { OfficeRoom, UserProfile, Project, Meeting } from '@/lib/types';
import { RoomDetailModal } from './RoomDetailModal';

interface OfficeRoomsViewProps {
  rooms: OfficeRoom[];
  currentUser: UserProfile;
  members: UserProfile[];
  projects: Project[];
  meetings: Meeting[];
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
}

export const OfficeRoomsView: React.FC<OfficeRoomsViewProps> = ({
  rooms,
  currentUser,
  members,
  projects,
  meetings,
  onJoinRoom,
  onLeaveRoom,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<OfficeRoom | null>(null);

  const getRoomIcon = (type: OfficeRoom['type']) => {
    switch (type) {
      case 'focus':
        return <Headphones className="w-5 h-5 text-purple-600" />;
      case 'meeting':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'project':
        return <FolderKanban className="w-5 h-5 text-blue-600" />;
      case 'private':
        return <Shield className="w-5 h-5 text-rose-600" />;
      default:
        return <Coffee className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getRoomAccentBg = (type: OfficeRoom['type']) => {
    switch (type) {
      case 'focus':
        return 'border-purple-200/80 hover:border-purple-300 bg-gradient-to-br from-white via-purple-50/20 to-white';
      case 'meeting':
        return 'border-amber-200/80 hover:border-amber-300 bg-gradient-to-br from-white via-amber-50/20 to-white';
      case 'project':
        return 'border-blue-200/80 hover:border-blue-300 bg-gradient-to-br from-white via-blue-50/20 to-white';
      case 'private':
        return 'border-rose-200/80 hover:border-rose-300 bg-gradient-to-br from-white via-rose-50/20 to-white';
      default:
        return 'border-slate-200/80 hover:border-indigo-300 bg-gradient-to-br from-white via-slate-50 to-white';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Virtual Office Floorplan (2D Rooms)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Berpindah konteks kerja secara intuitif antar ruang lobby, pod fokus hening, dan ruang rapat.
          </p>
        </div>

        {/* Current status banner */}
        {currentUser.currentRoomId ? (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>
              Anda berada di{' '}
              <strong>{rooms.find((r) => r.id === currentUser.currentRoomId)?.name}</strong>
            </span>
            <button
              onClick={onLeaveRoom}
              className="ml-2 text-rose-600 hover:text-rose-700 font-semibold underline"
            >
              Keluar
            </button>
          </div>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs">
            Status: Di luar ruangan (Lobby standby)
          </div>
        )}
      </div>

      {/* 2D Floorplan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const isUserHere = currentUser.currentRoomId === room.id;
          const occupants = room.activeUserIds
            .map((uid) => members.find((m) => m.id === uid))
            .filter(Boolean) as UserProfile[];

          return (
            <div
              key={room.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${getRoomAccentBg(
                room.type
              )} ${isUserHere ? 'ring-2 ring-indigo-600 shadow-md' : ''}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100">
                      {getRoomIcon(room.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{room.name}</h3>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                        {room.type} • Maks {room.capacity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Detail Ruangan"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                {/* 2D Visual Desk / Presence Avatars */}
                <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200/60 min-h-[76px] flex flex-col justify-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Di Dalam Ruangan</span>
                    <span>
                      {occupants.length} / {room.capacity}
                    </span>
                  </div>

                  {occupants.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">Ruangan kosong</div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {occupants.map((occ) => (
                        <div
                          key={occ.id}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs"
                          title={`${occ.name} (${occ.title})`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="font-medium text-slate-800 text-[11px]">
                            {occ.name.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRoom(room)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Lihat Detail
                </button>

                {isUserHere ? (
                  <button
                    onClick={onLeaveRoom}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Ruang</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onJoinRoom(room.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk Ruangan</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onJoinRoom={onJoinRoom}
        onLeaveRoom={onLeaveRoom}
        currentUser={currentUser}
        members={members}
        projects={projects}
        meetings={meetings}
      />
    </div>
  );
};
