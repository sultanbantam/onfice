import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, meetings: data.meetings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.startTime || !body.endTime) {
      return NextResponse.json({ success: false, error: 'Judul, waktu mulai, dan waktu selesai wajib diisi' }, { status: 400 });
    }

    const meeting = db.createMeeting({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      startTime: body.startTime,
      endTime: body.endTime,
      roomId: body.roomId || 'room-meeting-1',
      meetLink: body.meetLink || `https://meet.jit.si/onfice-${Math.random().toString(36).substring(2, 8)}`,
      hostId: body.hostId || 'usr-admin-1',
      attendeeIds: body.attendeeIds || ['usr-admin-1'],
      projectId: body.projectId || undefined,
    });

    return NextResponse.json({ success: true, meeting });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Meeting ID wajib diberikan' }, { status: 400 });
    }
    const ok = db.deleteMeeting(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Rapat tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
