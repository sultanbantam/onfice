import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const data = db.getWorkspace();
  return NextResponse.json({ success: true, documents: data.documents });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.fileName) {
      return NextResponse.json({ success: false, error: 'Judul dan nama file wajib diisi' }, { status: 400 });
    }

    const document = db.createDocument({
      title: body.title.trim(),
      fileName: body.fileName.trim(),
      fileSize: Number(body.fileSize) || 102400,
      fileType: body.fileType || 'application/octet-stream',
      projectId: body.projectId || undefined,
      uploaderId: body.uploaderId || 'usr-admin-1',
      url: body.url || `/docs/${encodeURIComponent(body.fileName)}`,
    });

    return NextResponse.json({ success: true, document });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Document ID wajib diberikan' }, { status: 400 });
    }
    const ok = db.deleteDocument(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
