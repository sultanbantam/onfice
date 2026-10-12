import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processAIChat } from '@/lib/ai-adapter';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, prompt, payload, history } = body;

    // Direct execution of confirmed action
    if (action === 'execute') {
      if (!payload || !payload.type) {
        return NextResponse.json({ success: false, error: 'Payload aksi tidak valid' }, { status: 400 });
      }

      if (payload.type === 'create_task') {
        const taskData = payload.data;
        const task = db.createTask({
          title: taskData.title,
          description: taskData.description || 'Dibuat secara otomatis melalui Onfice AI Assistant',
          projectId: taskData.projectId || 'proj-1',
          priority: taskData.priority || 'medium',
          status: taskData.status || 'todo',
          assigneeId: taskData.assigneeId,
        });

        return NextResponse.json({
          success: true,
          executed: true,
          message: `Berhasil membuat tugas baru: "${task.title}".`,
          task,
        });
      }

      return NextResponse.json({ success: false, error: 'Jenis aksi tidak didukung' }, { status: 400 });
    }

    // Regular conversation & reasoning
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: 'Prompt pertanyaan wajib diisi' }, { status: 400 });
    }

    const workspace = db.getWorkspace();
    const response = await processAIChat(prompt.trim(), workspace, history || []);

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
