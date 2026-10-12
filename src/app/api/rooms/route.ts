import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, rooms: data.rooms });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, roomId } = body;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID wajib diberikan' }, { status: 400 });
    }

    const room = db.joinRoom(userId, roomId || null);
    const updatedWorkspace = db.getWorkspace();
    return NextResponse.json({
      success: true,
      activeRoom: room,
      rooms: updatedWorkspace.rooms,
      currentUser: updatedWorkspace.currentUser,
      members: updatedWorkspace.members,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
