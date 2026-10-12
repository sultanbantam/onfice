import { WorkspaceData, AIMessage } from './types';

export interface AIResponse {
  message: string;
  isSimulated: boolean;
  suggestedAction?: {
    type: 'create_task' | 'summarize_project' | 'schedule_meeting' | 'draft_doc';
    payload: any;
    label: string;
  };
}

export async function processAIChat(
  prompt: string,
  workspace: WorkspaceData,
  history: AIMessage[] = []
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  // Build minimal workspace context to protect privacy and respect tokens
  const contextSummary = {
    organizationName: workspace.organization.name,
    totalProjects: workspace.projects.length,
    activeProjects: workspace.projects.filter(p => p.status === 'active').map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      targetDate: p.targetDate,
    })),
    totalTasks: workspace.tasks.length,
    pendingTasksCount: workspace.tasks.filter(t => t.status !== 'done').length,
    urgentTasks: workspace.tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').map(t => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate,
    })),
    activeRooms: workspace.rooms.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      occupantsCount: r.activeUserIds.length,
    })),
    upcomingMeetings: workspace.meetings.slice(0, 3).map(m => ({
      id: m.id,
      title: m.title,
      startTime: m.startTime,
    })),
  };

  // If Gemini API key is configured, call Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const systemInstruction = `Kamu adalah Onfice AI Assistant, asisten virtual office cerdas untuk workspace "${workspace.organization.name}".
Gunakan bahasa Indonesia yang profesional, ramah, dan ringkas.
Bantu pengguna mengelola tugas, membuat draf dokumen/pesan, merangkum proyek, dan menjawab agenda rapat.
Jika pengguna meminta membuat tugas, sertakan saran aksi terstruktur.
Konteks ruang kerja saat ini: ${JSON.stringify(contextSummary)}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nPermintaan pengguna: ${prompt}` }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          // Detect if prompt is task creation request
          let suggestedAction = undefined;
          const lower = prompt.toLowerCase();
          if (lower.includes('buat') && (lower.includes('tugas') || lower.includes('task'))) {
            suggestedAction = {
              type: 'create_task' as const,
              payload: {
                title: prompt.replace(/buat(kan)?\s+(tugas|task)\s*:?/i, '').trim() || 'Tugas Baru dari AI',
                projectId: workspace.projects[0]?.id || 'proj-1',
                priority: 'medium',
                status: 'todo',
              },
              label: 'Buat Tugas Baru Sekarang',
            };
          }

          return {
            message: text,
            isSimulated: false,
            suggestedAction,
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local contextual reasoning:', e);
    }
  }

  // Fallback: Intelligent Context-Aware Workspace Reasoning
  // Analyzes real workspace data without hallucinations
  const lowerPrompt = prompt.toLowerCase();

  // 1. Task creation request
  if (lowerPrompt.includes('buat') && (lowerPrompt.includes('tugas') || lowerPrompt.includes('task'))) {
    const rawTitle = prompt.replace(/buat(kan)?\s+(tugas|task)\s*:?/i, '').trim() || 'Tugas Baru dari Asisten AI';
    const activeProject = workspace.projects.find(p => p.status === 'active') || workspace.projects[0];

    return {
      message: `Saya telah menyusun draf tugas untuk Anda berdasarkan instruksi:\n\n📌 **Judul:** ${rawTitle}\n📁 **Proyek Terkait:** ${activeProject?.name}\n⚡ **Prioritas:** Medium\n\nSilakan tinjau dan klik tombol konfirmasi di bawah untuk memasukkan tugas ini langsung ke sistem.`,
      isSimulated: true,
      suggestedAction: {
        type: 'create_task',
        payload: {
          title: rawTitle,
          description: `Dibuat via Onfice AI Assistant atas permintaan pengguna: "${prompt}"`,
          projectId: activeProject?.id,
          priority: 'medium',
          status: 'todo',
        },
        label: `Tambahkan "${rawTitle.slice(0, 30)}..." ke Task Board`,
      },
    };
  }

  // 2. Project summary request
  if (lowerPrompt.includes('proyek') || lowerPrompt.includes('project') || lowerPrompt.includes('ringkas') || lowerPrompt.includes('status')) {
    const projectList = workspace.projects
      .map(p => {
        const pTasks = workspace.tasks.filter(t => t.projectId === p.id);
        const doneTasks = pTasks.filter(t => t.status === 'done').length;
        return `• **${p.name}** (${p.status.toUpperCase()}): ${doneTasks}/${pTasks.length} tugas selesai. Target: ${p.targetDate || 'TBA'}`;
      })
      .join('\n');

    return {
      message: `Berikut adalah ringkasan status proyek aktif di workspace **${workspace.organization.name}**:\n\n${projectList}\n\nAda yang ingin saya bantu detailkan atau buatkan rencana tindak lanjut?`,
      isSimulated: true,
    };
  }

  // 3. Room & presence inquiry
  if (lowerPrompt.includes('ruang') || lowerPrompt.includes('room') || lowerPrompt.includes('siapa') || lowerPrompt.includes('online')) {
    const presenceList = workspace.rooms
      .map(r => {
        const names = r.activeUserIds.map(uid => workspace.members.find(m => m.id === uid)?.name).filter(Boolean);
        return `• **${r.name}**: ${names.length > 0 ? names.join(', ') : 'Kosong'}`;
      })
      .join('\n');

    return {
      message: `Status kehadiran di Ruang Virtual saat ini:\n\n${presenceList}\n\nAnda dapat langsung bergabung ke ruangan mana pun melalui tab **Office Rooms**.`,
      isSimulated: true,
    };
  }

  // 4. Meeting / agenda inquiry
  if (lowerPrompt.includes('rapat') || lowerPrompt.includes('meeting') || lowerPrompt.includes('agenda')) {
    if (workspace.meetings.length === 0) {
      return {
        message: 'Tidak ada agenda rapat terjadwal untuk saat ini. Anda dapat menjadwalkan rapat baru kapan saja dari tab Agenda.',
        isSimulated: true,
      };
    }
    const meetList = workspace.meetings
      .map(m => {
        const timeStr = new Date(m.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return `• **${m.title}** (${timeStr}) — Host: ${workspace.members.find(u => u.id === m.hostId)?.name || 'Team'}`;
      })
      .join('\n');

    return {
      message: `Agenda rapat berikutnya di workspace:\n\n${meetList}\n\nLink video call sudah tersemat di kartu rapat masing-masing.`,
      isSimulated: true,
    };
  }

  // 5. Default helpful assistant response
  return {
    message: `Halo! Saya asisten Onfice untuk **${workspace.organization.name}**.\n\nSaya dapat membantu Anda dengan:\n1. 📋 **Membuat tugas:** Coba ketik *"Buatkan tugas review audit keamanan"*.\n2. 📊 **Ringkasan proyek:** Coba ketik *"Bagaimana progres proyek saat ini?"*.\n3. 🏢 **Status kehadiran:** Tanyakan *"Siapa yang sedang di ruang kerja?"*.\n4. 📅 **Agenda rapat:** Tanyakan *"Apa agenda rapat hari ini?"*.\n\n*Catatan: Konfigurasi \`GEMINI_API_KEY\` di file \`.env.local\` untuk mengaktifkan model LLM generatif penuh.*`,
    isSimulated: true,
  };
}
