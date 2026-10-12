'use client';

import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  DoorOpen,
  FolderKanban,
  Users,
  AlertCircle,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { WorkspaceData, Task, Meeting } from '@/lib/types';
import { NavTab } from '../layout/AppSidebar';

interface HomeOverviewProps {
  workspace: WorkspaceData;
  onNavigate: (tab: NavTab) => void;
  onToggleTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onJoinRoom: (roomId: string) => void;
  onOpenNewTask: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  workspace,
  onNavigate,
  onToggleTaskStatus,
  onJoinRoom,
  onOpenNewTask,
}) => {
  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const pendingTasks = workspace.tasks.filter((t) => t.status !== 'done');
  const myTasks = pendingTasks.filter(
    (t) => !t.assigneeId || t.assigneeId === workspace.currentUser.id
  );
  const nextMeeting = workspace.meetings[0];
  const activeProjects = workspace.projects.filter((p) => p.status === 'active');
  const onlineMembers = workspace.members.filter((m) => m.status === 'online');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase font-semibold text-indigo-300 tracking-wider">
              {todayStr}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Selamat datang, {workspace.currentUser.name}
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              Virtual Office Anda siap. Ada {pendingTasks.length} tugas yang berjalan dan{' '}
              {workspace.meetings.length} agenda rapat terjadwal hari ini.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium backdrop-blur-sm transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-300" />
              <span>Tanya AI Assistant</span>
            </button>
            <button
              onClick={onOpenNewTask}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/30 transition-all"
            >
              + Tugas Baru
            </button>
          </div>
        </div>
      </div>

      {/* 4 Answers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Apa yang perlu saya kerjakan hari ini? */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base">
                Tugas yang Perlu Dikerjakan
              </h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Lihat Semua ({workspace.tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myTasks.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
              Semua tugas Anda hari ini telah selesai! 🎉
            </div>
          ) : (
            <div className="space-y-2.5">
              {myTasks.slice(0, 5).map((task) => {
                const project = workspace.projects.find((p) => p.id === task.projectId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() =>
                          onToggleTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')
                        }
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          task.status === 'done'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-indigo-600 bg-white'
                        }`}
                      >
                        {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          {project && <span className="text-indigo-600">{project.name}</span>}
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                          task.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Agenda Rapat Terdekat */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Agenda Terdekat</h3>
            </div>
            <button
              onClick={() => onNavigate('meetings')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Semua
            </button>
          </div>

          {nextMeeting ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/60 space-y-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                  Segera
                </span>
                <h4 className="text-sm font-semibold text-slate-900 mt-2">
                  {nextMeeting.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {nextMeeting.description}
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(nextMeeting.startTime).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(nextMeeting.endTime).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {nextMeeting.meetLink && (
                <a
                  href={nextMeeting.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Video Meeting Room</span>
                </a>
              )}
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
              Tidak ada rapat terjadwal hari ini.
            </div>
          )}

          {/* Quick AI Suggestion Prompt */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigate('ai')}
              className="w-full text-left p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 transition-all flex items-start gap-2.5 text-xs text-indigo-900"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">AI Assistant:</span> Butuh rangkuman proyek atau
                tugas tindak lanjut otomatis? Klik untuk berbicara dengan AI.
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Proyek Aktif & Status Ruang Kantor 2D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Proyek Aktif */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FolderKanban className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base">Proyek Aktif</h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Kelola Proyek
            </button>
          </div>

          <div className="space-y-3">
            {activeProjects.map((proj) => {
              const pTasks = workspace.tasks.filter((t) => t.projectId === proj.id);
              const doneTasks = pTasks.filter((t) => t.status === 'done');
              const progressPct =
                pTasks.length > 0 ? Math.round((doneTasks.length / pTasks.length) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-slate-900">{proj.name}</div>
                    <span className="text-xs font-bold text-slate-600">{progressPct}%</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{proj.description}</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {doneTasks.length} dari {pTasks.length} tugas selesai
                    </span>
                    <span>Target: {proj.targetDate || 'Fleksibel'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Ruang Kantor 2D & Tim Online */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <DoorOpen className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base">
                Ruang Virtual & Tim ({onlineMembers.length} online)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('rooms')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Buka Semua Ruang
            </button>
          </div>

          <div className="space-y-2.5">
            {workspace.rooms.slice(0, 4).map((room) => {
              const occupants = room.activeUserIds
                .map((uid) => workspace.members.find((m) => m.id === uid))
                .filter(Boolean);

              return (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-700 font-semibold text-xs">
                      {room.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{room.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {occupants.length > 0 ? (
                          <span className="text-indigo-600 font-medium">
                            {occupants.map((o) => o?.name).join(', ')}
                          </span>
                        ) : (
                          'Tidak ada orang'
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onJoinRoom(room.id)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Masuk
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
