export type UserRole = 'owner' | 'admin' | 'member' | 'guest';

export type AvailabilityStatus = 'online' | 'busy' | 'in_meeting' | 'away' | 'offline';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  title: string;
  role: UserRole;
  status: AvailabilityStatus;
  currentRoomId?: string | null;
  joinedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  leadId: string;
  memberIds: string[];
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type RoomType = 'lobby' | 'focus' | 'meeting' | 'project' | 'private';

export interface OfficeRoom {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  capacity: number;
  activeUserIds: string[];
  associatedProjectId?: string;
  isPrivate?: boolean;
  allowedRole?: UserRole;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  projectId?: string;
  uploaderId: string;
  url: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  roomId?: string;
  meetLink?: string;
  hostId: string;
  attendeeIds: string[];
  projectId?: string;
  createdAt: string;
}

export interface WorkspaceOrganization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface WorkspaceData {
  organization: WorkspaceOrganization;
  currentUser: UserProfile;
  members: UserProfile[];
  projects: Project[];
  tasks: Task[];
  rooms: OfficeRoom[];
  documents: DocumentItem[];
  meetings: Meeting[];
  activityLogs: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: 'project' | 'task' | 'room' | 'document' | 'meeting' | 'member';
  targetTitle: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_task' | 'summarize_project' | 'schedule_meeting' | 'draft_doc';
    payload: any;
    label: string;
  };
}
