import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, members: data.members });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, error: 'Format email tidak valid' }, { status: 400 });
    }

    const member = db.inviteMember({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      title: body.title?.trim() || 'Team Member',
      role: body.role || 'member',
      status: 'offline',
      currentRoomId: null,
    });

    return NextResponse.json({ success: true, member });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, status } = body;
    if (!userId || !status) {
      return NextResponse.json({ success: false, error: 'User ID dan status wajib diberikan' }, { status: 400 });
    }
    const ok = db.updateMemberStatus(userId, status);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Member tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
