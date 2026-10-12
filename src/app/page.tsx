'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar, NavTab } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { HomeOverview } from '@/components/home/HomeOverview';
import { PeopleDirectory } from '@/components/people/PeopleDirectory';
import { ProjectsManager } from '@/components/projects/ProjectsManager';
import { OfficeRoomsView } from '@/components/rooms/OfficeRoomsView';
import { AIAssistantChat } from '@/components/ai/AIAssistantChat';
import { DocumentsManager } from '@/components/documents/DocumentsManager';
import { MeetingsSchedule } from '@/components/meetings/MeetingsSchedule';
import { TaskModal } from '@/components/projects/TaskModal';
import {
  WorkspaceData,
  AvailabilityStatus,
  Task,
  Project,
  UserRole,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
} from '@/lib/types';
import { Loader2, RefreshCw } from 'lucide-react';

export default function OnficeApp() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchWorkspace = async () => {
    try {
      const res = await fetch('/api/workspace');
      const data = await res.json();
      if (data.success) {
        setWorkspace(data.data);
      }
    } catch (e) {
      console.error('Failed to load workspace data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  // Handlers for room presence
  const handleJoinRoom = async (roomId: string) => {
    if (!workspace) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: workspace.currentUser.id, roomId }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, rooms: data.rooms, currentUser: data.currentUser, members: data.members } : null));
        showToast(`Bergabung ke ruangan: ${data.activeRoom?.name || 'Lobby'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveRoom = async () => {
    if (!workspace) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: workspace.currentUser.id, roomId: null }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, rooms: data.rooms, currentUser: data.currentUser, members: data.members } : null));
        showToast('Anda telah keluar dari ruangan virtual');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for member status
  const handleUpdateStatus = async (status: AvailabilityStatus) => {
    if (!workspace) return;
    try {
      const res = await fetch('/api/people', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: workspace.currentUser.id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            currentUser: { ...prev.currentUser, status },
            members: prev.members.map((m) => (m.id === prev.currentUser.id ? { ...m, status } : m)),
          };
        });
        showToast(`Status ketersediaan diubah ke ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Member invitation
  const handleInviteMember = async (memberData: { name: string; email: string; title: string; role: UserRole }) => {
    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, members: [...prev.members, data.member] } : null));
        showToast(`Berhasil mengundang ${memberData.name} ke workspace!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Projects CRUD
  const handleCreateProject = async (projData: { name: string; description: string; status: ProjectStatus; targetDate?: string }) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projData),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, projects: [data.project, ...prev.projects] } : null));
        showToast(`Proyek "${data.project.name}" berhasil dibuat!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) =>
          prev ? { ...prev, projects: prev.projects.map((p) => (p.id === id ? data.project : p)) } : null
        );
        showToast('Proyek berhasil diperbarui');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) =>
          prev
            ? {
                ...prev,
                projects: prev.projects.filter((p) => p.id !== id),
                tasks: prev.tasks.filter((t) => t.projectId !== id),
              }
            : null
        );
        showToast('Proyek berhasil dihapus');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Tasks CRUD
  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assigneeId?: string;
    dueDate?: string;
  }) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, tasks: [data.task, ...prev.tasks] } : null));
        showToast(`Tugas "${data.task.title}" tersimpan!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) =>
          prev ? { ...prev, tasks: prev.tasks.map((t) => (t.id === id ? data.task : t)) } : null
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== id) } : null));
        showToast('Tugas dihapus');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Documents CRUD
  const handleUploadDocument = async (docData: {
    title: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    projectId?: string;
  }) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, documents: [data.document, ...prev.documents] } : null));
        showToast(`Dokumen "${data.document.title}" tersimpan!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, documents: prev.documents.filter((d) => d.id !== id) } : null));
        showToast('Dokumen dihapus');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Meetings CRUD
  const handleScheduleMeeting = async (meetData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    roomId?: string;
    meetLink?: string;
    projectId?: string;
  }) => {
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetData),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, meetings: [data.meeting, ...prev.meetings] } : null));
        showToast(`Rapat "${data.meeting.title}" berhasil dijadwalkan!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelMeeting = async (id: string) => {
    try {
      const res = await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setWorkspace((prev) => (prev ? { ...prev, meetings: prev.meetings.filter((m) => m.id !== id) } : null));
        showToast('Rapat dibatalkan');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !workspace) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <h2 className="text-base font-semibold tracking-wide">Memuat Onfice Virtual Office...</h2>
        <p className="text-xs text-slate-400 mt-1">Menginisialisasi workspace dan kontrol keamanan</p>
      </div>
    );
  }

  const currentRoom = workspace.rooms.find((r) => r.id === workspace.currentUser.currentRoomId) || null;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Sidebar Nav */}
      <AppSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        organization={workspace.organization}
        currentUser={workspace.currentUser}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <AppHeader
          currentUser={workspace.currentUser}
          currentRoom={currentRoom}
          onUpdateStatus={handleUpdateStatus}
          onLeaveRoom={handleLeaveRoom}
          onQuickAction={() => setIsQuickTaskOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentTab === 'home' && (
            <HomeOverview
              workspace={workspace}
              onNavigate={setCurrentTab}
              onToggleTaskStatus={(taskId, newStatus) => handleUpdateTask(taskId, { status: newStatus })}
              onJoinRoom={handleJoinRoom}
              onOpenNewTask={() => setIsQuickTaskOpen(true)}
            />
          )}

          {currentTab === 'people' && (
            <PeopleDirectory
              members={workspace.members}
              rooms={workspace.rooms}
              currentUser={workspace.currentUser}
              onInviteMember={handleInviteMember}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsManager
              projects={workspace.projects}
              tasks={workspace.tasks}
              members={workspace.members}
              currentUser={workspace.currentUser}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'rooms' && (
            <OfficeRoomsView
              rooms={workspace.rooms}
              currentUser={workspace.currentUser}
              members={workspace.members}
              projects={workspace.projects}
              meetings={workspace.meetings}
              onJoinRoom={handleJoinRoom}
              onLeaveRoom={handleLeaveRoom}
            />
          )}

          {currentTab === 'ai' && (
            <AIAssistantChat
              workspace={workspace}
              onRefreshWorkspace={fetchWorkspace}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsManager
              documents={workspace.documents}
              projects={workspace.projects}
              members={workspace.members}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingsSchedule
              meetings={workspace.meetings}
              rooms={workspace.rooms}
              projects={workspace.projects}
              members={workspace.members}
              onScheduleMeeting={handleScheduleMeeting}
              onCancelMeeting={handleCancelMeeting}
              onJoinRoom={(roomId) => {
                handleJoinRoom(roomId);
                setCurrentTab('rooms');
              }}
            />
          )}
        </main>
      </div>

      {/* Quick Task Modal */}
      <TaskModal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
        onSave={handleCreateTask}
        projects={workspace.projects}
        members={workspace.members}
      />
    </div>
  );
}
