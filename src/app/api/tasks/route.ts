import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, tasks: data.tasks });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Judul tugas wajib diisi' }, { status: 400 });
    }

    const task = db.createTask({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      projectId: body.projectId || 'proj-1',
      assigneeId: body.assigneeId || undefined,
      dueDate: body.dueDate || undefined,
    });

    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Task ID wajib diberikan' }, { status: 400 });
    }
    const updated = db.updateTask(body.id, body.updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Tugas tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, task: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID wajib diberikan' }, { status: 400 });
    }
    const ok = db.deleteTask(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Tugas tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
