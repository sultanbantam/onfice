import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  // Reading req.url ensures Next.js compiler treats route as dynamic
  const _url = new URL(req.url);
  try {
    const data = db.getWorkspace();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
