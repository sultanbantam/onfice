import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, projects: data.projects });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Nama proyek wajib diisi' }, { status: 400 });
    }

    const project = db.createProject({
      name: body.name.trim(),
      description: body.description?.trim() || '',
      status: body.status || 'planning',
      leadId: body.leadId || 'usr-admin-1',
      memberIds: body.memberIds || ['usr-admin-1'],
      targetDate: body.targetDate || undefined,
    });

    return NextResponse.json({ success: true, project });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Project ID wajib diberikan' }, { status: 400 });
    }
    const updated = db.updateProject(body.id, body.updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Proyek tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Project ID wajib diberikan' }, { status: 400 });
    }
    const ok = db.deleteProject(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Proyek tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
