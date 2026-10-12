'use client';

import React from 'react';
import {
  X,
  DoorOpen,
  Users,
  Shield,
  FolderKanban,
  Calendar,
  LogOut,
  LogIn,
  CheckCircle2,
} from 'lucide-react';
import { OfficeRoom, UserProfile, Project, Meeting } from '@/lib/types';

interface RoomDetailModalProps {
  room: OfficeRoom | null;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  currentUser: UserProfile;
  members: UserProfile[];
  projects: Project[];
  meetings: Meeting[];
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onJoinRoom,
  onLeaveRoom,
  currentUser,
  members,
  projects,
  meetings,
}) => {
  if (!room) return null;

  const isCurrentRoom = currentUser.currentRoomId === room.id;
  const occupants = room.activeUserIds
    .map((uid) => members.find((m) => m.id === uid))
    .filter(Boolean) as UserProfile[];

  const linkedProject = projects.find((p) => p.id === room.associatedProjectId);
  const linkedMeetings = meetings.filter((m) => m.roomId === room.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
                {room.isPrivate && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                    Private ({room.allowedRole})
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Tipe: {room.type} • Kapasitas: {room.capacity} orang
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Tujuan Ruangan
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {room.description}
          </p>
        </div>

        {/* Occupants list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Anggota di Ruangan Ini ({occupants.length}/{room.capacity})
            </h4>
          </div>
          {occupants.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              Saat ini ruangan kosong. Anda dapat menjadi orang pertama yang masuk.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {occupants.map((occ) => (
                <div
                  key={occ.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {occ.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate">{occ.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{occ.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context linkage */}
        {linkedProject && (
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-950 flex items-center gap-2.5">
            <FolderKanban className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-semibold">Proyek Terkait:</span> {linkedProject.name}
            </div>
          </div>
        )}

        {linkedMeetings.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Rapat di Ruang Ini:</span>
            </div>
            {linkedMeetings.map((m) => (
              <div key={m.id} className="text-slate-600 pl-5">
                • {m.title} (
                {new Date(m.startTime).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                )
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Tutup
          </button>
          {isCurrentRoom ? (
            <button
              onClick={() => {
                onLeaveRoom();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Tinggalkan Ruangan</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onJoinRoom(room.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk ke Ruangan Ini</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
