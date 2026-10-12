'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Video,
  DoorOpen,
  Trash2,
  ExternalLink,
  Users,
  FolderKanban,
} from 'lucide-react';
import { Meeting, OfficeRoom, Project, UserProfile } from '@/lib/types';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

interface MeetingsScheduleProps {
  meetings: Meeting[];
  rooms: OfficeRoom[];
  projects: Project[];
  members: UserProfile[];
  onScheduleMeeting: (data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    roomId?: string;
    meetLink?: string;
    projectId?: string;
  }) => void;
  onCancelMeeting: (id: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export const MeetingsSchedule: React.FC<MeetingsScheduleProps> = ({
  meetings,
  rooms,
  projects,
  members,
  onScheduleMeeting,
  onCancelMeeting,
  onJoinRoom,
}) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Meetings & Agenda Kantor
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Jadwal pertemuan internal, koordinasi sprint, dan tautan langsung ke ruang rapat digital.
          </p>
        </div>
        <button
          onClick={() => setIsScheduleOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-xs shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Rapat</span>
        </button>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meet) => {
          const room = rooms.find((r) => r.id === meet.roomId);
          const project = projects.find((p) => p.id === meet.projectId);
          const host = members.find((m) => m.id === meet.hostId);

          const startDate = new Date(meet.startTime);
          const endDate = new Date(meet.endTime);

          const dateFormatted = startDate.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          const timeFormatted = `${startDate.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })} - ${endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

          return (
            <div
              key={meet.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {dateFormatted}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{timeFormatted}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-1">{meet.title}</h3>
                  {meet.description && (
                    <p className="text-xs text-slate-600 mt-1">{meet.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {room && (
                    <button
                      onClick={() => onJoinRoom(room.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Buka Ruangan Terkait di Kantor 2D"
                    >
                      <DoorOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Masuk {room.name}</span>
                    </button>
                  )}

                  {meet.meetLink && (
                    <a
                      href={meet.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Batalkan rapat "${meet.title}"?`)) {
                        onCancelMeeting(meet.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Batalkan Rapat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  {host && <span>Host: <strong>{host.name}</strong></span>}
                  {project && (
                    <span className="flex items-center gap-1 text-indigo-600">
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span>{project.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {meetings.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
            Tidak ada rapat terjadwal. Klik tombol di atas untuk menjadwalkan rapat.
          </div>
        )}
      </div>

      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSchedule={onScheduleMeeting}
        rooms={rooms}
        projects={projects}
      />
    </div>
  );
};
