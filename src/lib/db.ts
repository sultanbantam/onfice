import fs from 'fs';
import path from 'path';
import {
  WorkspaceData,
  Project,
  Task,
  UserProfile,
  OfficeRoom,
  DocumentItem,
  Meeting,
  ActivityLog,
} from './types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'onfice-store.json');

const INITIAL_WORKSPACE: WorkspaceData = {
  organization: {
    id: 'org-onfice-alpha',
    name: 'Onfice Digital HQ',
    slug: 'onfice-hq',
    plan: 'pro',
    createdAt: new Date().toISOString(),
  },
  currentUser: {
    id: 'usr-admin-1',
    name: 'Sultan Bantam',
    email: 'sultan@onfice.dev',
    title: 'Lead Architect & Founder',
    role: 'owner',
    status: 'online',
    currentRoomId: 'room-lobby',
    joinedAt: new Date().toISOString(),
  },
  members: [
    {
      id: 'usr-admin-1',
      name: 'Sultan Bantam',
      email: 'sultan@onfice.dev',
      title: 'Lead Architect & Founder',
      role: 'owner',
      status: 'online',
      currentRoomId: 'room-lobby',
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'usr-sarah',
      name: 'Sarah Nabila',
      email: 'sarah@onfice.dev',
      title: 'Product Designer',
      role: 'admin',
      status: 'busy',
      currentRoomId: 'room-focus-1',
      joinedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: 'usr-dimas',
      name: 'Dimas Prasetyo',
      email: 'dimas@onfice.dev',
      title: 'Senior Frontend Engineer',
      role: 'member',
      status: 'in_meeting',
      currentRoomId: 'room-meeting-1',
      joinedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: 'usr-clara',
      name: 'Clara Wijaya',
      email: 'clara@onfice.dev',
      title: 'Fullstack Developer',
      role: 'member',
      status: 'online',
      currentRoomId: 'room-project-core',
      joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'usr-fauzan',
      name: 'Fauzan Hakim',
      email: 'fauzan@client.partner',
      title: 'Stakeholder Representative',
      role: 'guest',
      status: 'away',
      currentRoomId: null,
      joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Virtual Office Core MVP',
      description: 'Pengembangan arsitektur digital workspace, 2D rooms, task kanban, dan integrasi AI Assistant terpadu.',
      status: 'active',
      leadId: 'usr-admin-1',
      memberIds: ['usr-admin-1', 'usr-sarah', 'usr-dimas', 'usr-clara'],
      targetDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      name: 'WebRTC Audio & Video Rooms',
      description: 'Integrasi live audio presence, screen sharing, dan spatial room audio menggunakan LiveKit.',
      status: 'planning',
      leadId: 'usr-dimas',
      memberIds: ['usr-dimas', 'usr-clara'],
      targetDate: new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj-3',
      name: 'Enterprise Security & Audit Trail',
      description: 'Implementasi isolasi tenant multi-organisasi, audit log terperinci, dan enkripsi dokumen internal.',
      status: 'active',
      leadId: 'usr-admin-1',
      memberIds: ['usr-admin-1', 'usr-fauzan'],
      targetDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: 'task-101',
      title: 'Rancang UI Shell & Navigasi 5 Area Utama',
      description: 'Implementasi sidebar responsif, header workspace, serta view Home, People, Projects, Rooms, AI.',
      status: 'done',
      priority: 'high',
      projectId: 'proj-1',
      assigneeId: 'usr-sarah',
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-102',
      title: 'Implementasi Interactive 2D Office Rooms',
      description: 'Sistem kehadiran real di ruangan (Lobby, Focus Room, Meeting Room, Project Room) dengan aksi Join & Leave.',
      status: 'in_progress',
      priority: 'urgent',
      projectId: 'proj-1',
      assigneeId: 'usr-dimas',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-103',
      title: 'Server-side AI Assistant Provider Adapter',
      description: 'Endpoint aman untuk chat kontekstual, pembuatan tugas otomatis, dan draf ringkasan proyek.',
      status: 'in_progress',
      priority: 'high',
      projectId: 'proj-1',
      assigneeId: 'usr-admin-1',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-104',
      title: 'Validasi skema database PostgreSQL & RLS Policies',
      description: 'Pastikan isolasi data antar organisasi tidak tembus IDOR dan teruji secara ketat.',
      status: 'todo',
      priority: 'high',
      projectId: 'proj-3',
      assigneeId: 'usr-clara',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-105',
      title: 'Setup Standup Meeting & Agenda Sync',
      description: 'Memfasilitasi sync jadwal harian tim dan tautan ruang rapat.',
      status: 'todo',
      priority: 'medium',
      projectId: 'proj-1',
      assigneeId: 'usr-sarah',
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  rooms: [
    {
      id: 'room-lobby',
      name: 'Main Lobby & Welcome Hall',
      type: 'lobby',
      description: 'Ruang resepsionis utama untuk melihat seluruh tim dan aktivitas kantor hari ini.',
      capacity: 50,
      activeUserIds: ['usr-admin-1'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room-focus-1',
      name: 'Deep Work & Focus Pod A',
      type: 'focus',
      description: 'Ruang kerja hening untuk produktivitas tanpa gangguan notifikasi.',
      capacity: 6,
      activeUserIds: ['usr-sarah'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room-meeting-1',
      name: 'Boardroom / Rapat Strategis',
      type: 'meeting',
      description: 'Ruang rapat formal dilengkapi agenda, proyektor dokumen, dan link video call.',
      capacity: 12,
      activeUserIds: ['usr-dimas'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room-project-core',
      name: 'Project Room: Core MVP',
      type: 'project',
      description: 'Ruang kerja kolaboratif khusus tim yang mengerjakan Virtual Office Core.',
      capacity: 10,
      associatedProjectId: 'proj-1',
      activeUserIds: ['usr-clara'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room-private-exec',
      name: 'Executive & Partner Lounge',
      type: 'private',
      description: 'Ruang terbatas khusus Admin dan Owner untuk diskusi manajerial.',
      capacity: 4,
      isPrivate: true,
      allowedRole: 'admin',
      activeUserIds: [],
      createdAt: new Date().toISOString(),
    },
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'Spesifikasi Arsitektur Virtual Office v1.0',
      fileName: 'virtual_office_architecture_spec.pdf',
      fileSize: 2480000,
      fileType: 'application/pdf',
      projectId: 'proj-1',
      uploaderId: 'usr-admin-1',
      url: '/docs/virtual_office_architecture_spec.pdf',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'doc-2',
      title: 'Design Guidelines & Moodboard Figma',
      fileName: 'onfice_design_system_tokens.fig',
      fileSize: 8400000,
      fileType: 'application/octet-stream',
      projectId: 'proj-1',
      uploaderId: 'usr-sarah',
      url: '/docs/onfice_design_system_tokens.fig',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'doc-3',
      title: 'Matriks Risiko Keamanan & RLS PostgreSQL',
      fileName: 'security_audit_matrix.xlsx',
      fileSize: 1250000,
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      projectId: 'proj-3',
      uploaderId: 'usr-clara',
      url: '/docs/security_audit_matrix.xlsx',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  meetings: [
    {
      id: 'meet-1',
      title: 'Daily Standup: Progress MVP & AI Agent',
      description: 'Review blokade harian dan sinkronisasi task aktif seluruh squad.',
      startTime: new Date(Date.now() + 3600000 * 2).toISOString(),
      endTime: new Date(Date.now() + 3600000 * 2.5).toISOString(),
      roomId: 'room-meeting-1',
      meetLink: 'https://meet.jit.si/onfice-standup-daily',
      hostId: 'usr-admin-1',
      attendeeIds: ['usr-admin-1', 'usr-sarah', 'usr-dimas', 'usr-clara'],
      projectId: 'proj-1',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'meet-2',
      title: 'Weekly Roadmap & Architecture Review',
      description: 'Evaluasi integrasi LiveKit dan validasi kesiapan database PostgreSQL.',
      startTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 3).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 2 + 3600000 * 4).toISOString(),
      roomId: 'room-meeting-1',
      meetLink: 'https://meet.jit.si/onfice-weekly-roadmap',
      hostId: 'usr-admin-1',
      attendeeIds: ['usr-admin-1', 'usr-dimas'],
      projectId: 'proj-1',
      createdAt: new Date().toISOString(),
    },
  ],
  activityLogs: [
    {
      id: 'act-1',
      actorId: 'usr-admin-1',
      actorName: 'Sultan Bantam',
      action: 'Membuat proyek baru',
      targetType: 'project',
      targetTitle: 'Virtual Office Core MVP',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'act-2',
      actorId: 'usr-sarah',
      actorName: 'Sarah Nabila',
      action: 'Menyelesaikan tugas',
      targetType: 'task',
      targetTitle: 'Rancang UI Shell & Navigasi 5 Area Utama',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'act-3',
      actorId: 'usr-dimas',
      actorName: 'Dimas Prasetyo',
      action: 'Bergabung ke ruangan',
      targetType: 'room',
      targetTitle: 'Boardroom / Rapat Strategis',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

// In-memory cache + persistent file sync
let memoryCache: WorkspaceData = JSON.parse(JSON.stringify(INITIAL_WORKSPACE));
let storageInitialized = false;

function ensureStorage(): WorkspaceData {
  if (!storageInitialized) {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        memoryCache = JSON.parse(raw);
      } else {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(memoryCache, null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('Notice: Primary file storage fallback, memory cache active:', err);
    }
    storageInitialized = true;
  }
  return memoryCache;
}

function saveStorage(data: WorkspaceData): void {
  memoryCache = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    try {
      const fallbackFile = path.join('/tmp', 'onfice-store.json');
      fs.writeFileSync(fallbackFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Memory cache is maintained
    }
  }
}

export const db = {
  getWorkspace(): WorkspaceData {
    return ensureStorage();
  },

  // Project operations
  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const data = ensureStorage();
    const newProject: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.projects.unshift(newProject);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Membuat proyek baru',
      targetType: 'project',
      targetTitle: newProject.name,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const data = ensureStorage();
    const idx = data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    data.projects[idx] = {
      ...data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveStorage(data);
    return data.projects[idx];
  },

  deleteProject(id: string): boolean {
    const data = ensureStorage();
    const proj = data.projects.find((p) => p.id === id);
    if (!proj) return false;
    data.projects = data.projects.filter((p) => p.id !== id);
    // Also remove associated tasks
    data.tasks = data.tasks.filter((t) => t.projectId !== id);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Menghapus proyek',
      targetType: 'project',
      targetTitle: proj.name,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return true;
  },

  // Task operations
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const data = ensureStorage();
    const newTask: Task = {
      ...task,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.tasks.unshift(newTask);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Membuat tugas baru',
      targetType: 'task',
      targetTitle: newTask.title,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return newTask;
  },

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const data = ensureStorage();
    const idx = data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const oldStatus = data.tasks[idx].status;
    data.tasks[idx] = {
      ...data.tasks[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.status && updates.status !== oldStatus) {
      data.activityLogs.unshift({
        id: 'act-' + Date.now(),
        actorId: data.currentUser.id,
        actorName: data.currentUser.name,
        action: `Mengubah status tugas menjadi "${updates.status}"`,
        targetType: 'task',
        targetTitle: data.tasks[idx].title,
        timestamp: new Date().toISOString(),
      });
    }

    saveStorage(data);
    return data.tasks[idx];
  },

  deleteTask(id: string): boolean {
    const data = ensureStorage();
    const t = data.tasks.find((item) => item.id === id);
    if (!t) return false;
    data.tasks = data.tasks.filter((item) => item.id !== id);
    saveStorage(data);
    return true;
  },

  // Room presence & operations
  joinRoom(userId: string, roomId: string | null): OfficeRoom | null {
    const data = ensureStorage();
    // Remove user from all other rooms
    data.rooms.forEach((r) => {
      r.activeUserIds = r.activeUserIds.filter((uid) => uid !== userId);
    });

    // Update user profile currentRoomId
    const member = data.members.find((m) => m.id === userId);
    if (member) {
      member.currentRoomId = roomId;
    }
    if (data.currentUser.id === userId) {
      data.currentUser.currentRoomId = roomId;
    }

    let targetRoom: OfficeRoom | null = null;
    if (roomId) {
      const room = data.rooms.find((r) => r.id === roomId);
      if (room) {
        if (!room.activeUserIds.includes(userId)) {
          room.activeUserIds.push(userId);
        }
        targetRoom = room;

        data.activityLogs.unshift({
          id: 'act-' + Date.now(),
          actorId: member ? member.id : userId,
          actorName: member ? member.name : 'User',
          action: 'Pindah ke ruang virtual',
          targetType: 'room',
          targetTitle: room.name,
          timestamp: new Date().toISOString(),
        });
      }
    }
    saveStorage(data);
    return targetRoom;
  },

  // Member invitation & profile
  inviteMember(member: Omit<UserProfile, 'id' | 'joinedAt'>): UserProfile {
    const data = ensureStorage();
    const newMember: UserProfile = {
      ...member,
      id: 'usr-' + Date.now(),
      joinedAt: new Date().toISOString(),
    };
    data.members.push(newMember);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Mengundang anggota baru',
      targetType: 'member',
      targetTitle: newMember.name,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return newMember;
  },

  updateMemberStatus(userId: string, status: UserProfile['status']): boolean {
    const data = ensureStorage();
    const m = data.members.find((item) => item.id === userId);
    if (!m) return false;
    m.status = status;
    if (data.currentUser.id === userId) {
      data.currentUser.status = status;
    }
    saveStorage(data);
    return true;
  },

  // Document operations
  createDocument(doc: Omit<DocumentItem, 'id' | 'createdAt'>): DocumentItem {
    const data = ensureStorage();
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    data.documents.unshift(newDoc);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Mengunggah dokumen',
      targetType: 'document',
      targetTitle: newDoc.title,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return newDoc;
  },

  deleteDocument(id: string): boolean {
    const data = ensureStorage();
    const doc = data.documents.find((d) => d.id === id);
    if (!doc) return false;
    data.documents = data.documents.filter((d) => d.id !== id);
    saveStorage(data);
    return true;
  },

  // Meeting operations
  createMeeting(meeting: Omit<Meeting, 'id' | 'createdAt'>): Meeting {
    const data = ensureStorage();
    const newMeet: Meeting = {
      ...meeting,
      id: 'meet-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    data.meetings.unshift(newMeet);
    data.activityLogs.unshift({
      id: 'act-' + Date.now(),
      actorId: data.currentUser.id,
      actorName: data.currentUser.name,
      action: 'Menjadwalkan rapat baru',
      targetType: 'meeting',
      targetTitle: newMeet.title,
      timestamp: new Date().toISOString(),
    });
    saveStorage(data);
    return newMeet;
  },

  deleteMeeting(id: string): boolean {
    const data = ensureStorage();
    const m = data.meetings.find((item) => item.id === id);
    if (!m) return false;
    data.meetings = data.meetings.filter((item) => item.id !== id);
    saveStorage(data);
    return true;
  },
};
