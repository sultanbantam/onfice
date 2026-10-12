'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit,
  Filter,
  Search,
  User,
  ArrowRight,
} from 'lucide-react';
import {
  Project,
  Task,
  UserProfile,
  TaskStatus,
  TaskPriority,
  ProjectStatus,
} from '@/lib/types';
import { ProjectModal } from './ProjectModal';
import { TaskModal } from './TaskModal';

interface ProjectsManagerProps {
  projects: Project[];
  tasks: Task[];
  members: UserProfile[];
  currentUser: UserProfile;
  onCreateProject: (data: { name: string; description: string; status: ProjectStatus; targetDate?: string }) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onCreateTask: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assigneeId?: string;
    dueDate?: string;
  }) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  tasks,
  members,
  currentUser,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'all');
  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = selectedProjectId === 'all' || t.projectId === selectedProjectId;
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesProject && matchesSearch && matchesPriority;
  });

  const columns: { id: TaskStatus; title: string; color: string; border: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100 text-slate-700', border: 'border-slate-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' },
    { id: 'blocked', title: 'Blocked', color: 'bg-rose-50 text-rose-700', border: 'border-rose-200' },
    { id: 'done', title: 'Done', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">Med</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">Low</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Projects & Task Board
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pantau roadmap inisiatif, status sprint, dan eksekusi tugas tim secara transparan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProject(null);
              setIsProjectModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-medium shadow-xs transition-all"
          >
            + Proyek Baru
          </button>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-xs shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Project selector bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedProjectId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedProjectId === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Proyek ({projects.length})
        </button>
        {projects.map((p) => {
          const isSelected = selectedProjectId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Active Project Details Card (if specific project is selected) */}
      {activeProject && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">{activeProject.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                  {activeProject.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeProject.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingProject(activeProject);
                  setIsProjectModalOpen(true);
                }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs"
                title="Edit Proyek"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Yakin ingin menghapus proyek "${activeProject.name}" dan semua tugas di dalamnya?`)) {
                    onDeleteProject(activeProject.id);
                    setSelectedProjectId('all');
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs"
                title="Hapus Proyek"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and View Mode Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Prioritas:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Semua</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setViewMode('board')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'board' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-3 space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${col.color}`}>
                      {col.title}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{colTasks.length}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    title="Tambah tugas"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {colTasks.map((task) => {
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const taskProj = projects.find((p) => p.id === task.projectId);

                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                setIsTaskModalOpen(true);
                              }}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus tugas "${task.title}"?`)) {
                                  onDeleteTask(task.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                          <div className="flex items-center gap-1.5">
                            {getPriorityBadge(task.priority)}
                            {taskProj && (
                              <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                                {taskProj.name}
                              </span>
                            )}
                          </div>
                          {assignee ? (
                            <div
                              className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold flex items-center justify-center"
                              title={assignee.name}
                            >
                              {assignee.name.slice(0, 1)}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300">Unassigned</span>
                          )}
                        </div>

                        {/* Status switcher pills */}
                        <div className="flex items-center gap-1 pt-1">
                          {(['todo', 'in_progress', 'blocked', 'done'] as TaskStatus[])
                            .filter((st) => st !== task.status)
                            .map((st) => (
                              <button
                                key={st}
                                onClick={() => onUpdateTask(task.id, { status: st })}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 hover:bg-slate-200 border border-slate-200/60 text-slate-500 capitalize transition-colors"
                              >
                                ➔ {st.replace('_', ' ')}
                              </button>
                            ))}
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredTasks.map((task) => {
            const assignee = members.find((m) => m.id === task.assigneeId);
            const taskProj = projects.find((p) => p.id === task.projectId);

            return (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() =>
                      onUpdateTask(task.id, {
                        status: task.status === 'done' ? 'todo' : 'done',
                      })
                    }
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      task.status === 'done'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-600 bg-white'
                    }`}
                  >
                    {task.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{task.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      {taskProj && <span className="text-indigo-600">{taskProj.name}</span>}
                      {assignee && <span>Assigned to {assignee.name}</span>}
                      {task.dueDate && <span>Due: {task.dueDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs capitalize font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {task.status.replace('_', ' ')}
                  </span>
                  {getPriorityBadge(task.priority)}
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus tugas "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={(data) => {
          if (editingProject) {
            onUpdateProject(editingProject.id, data);
          } else {
            onCreateProject(data);
          }
        }}
        initialProject={editingProject}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={(data) => {
          if (editingTask) {
            onUpdateTask(editingTask.id, data);
          } else {
            onCreateTask(data);
          }
        }}
        initialTask={editingTask}
        projects={projects}
        members={members}
      />
    </div>
  );
};
