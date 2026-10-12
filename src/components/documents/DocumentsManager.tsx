'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Search,
  FolderKanban,
  FileCheck,
  ShieldAlert,
  File,
} from 'lucide-react';
import { DocumentItem, Project, UserProfile } from '@/lib/types';
import { UploadDocumentModal } from './UploadDocumentModal';

interface DocumentsManagerProps {
  documents: DocumentItem[];
  projects: Project[];
  members: UserProfile[];
  onUploadDocument: (data: {
    title: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    projectId?: string;
  }) => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  documents,
  projects,
  members,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || d.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Documents & Knowledge Base
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Arsip dokumen, berkas proyek, dan referensi internal tersimpan dengan kontrol akses privat.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-xs shadow-indigo-600/20 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Dokumen</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama dokumen atau berkas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 hidden sm:inline">Proyek:</span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none"
          >
            <option value="all">Semua Dokumen ({documents.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredDocs.map((doc) => {
          const uploader = members.find((m) => m.id === doc.uploaderId);
          const project = projects.find((p) => p.id === doc.projectId);

          return (
            <div
              key={doc.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="font-mono text-slate-600 text-[11px] truncate max-w-[180px]">
                      {doc.fileName}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    {project && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{project.name}</span>
                      </>
                    )}
                    {uploader && (
                      <>
                        <span>•</span>
                        <span>Oleh {uploader.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={doc.url}
                  download={doc.fileName}
                  onClick={(e) => {
                    // For mock documents, alert user that download link is ready
                    if (!doc.url.startsWith('http')) {
                      e.preventDefault();
                      alert(`Mengunduh file: ${doc.fileName} (${formatFileSize(doc.fileSize)})`);
                    }
                  }}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1.5 transition-colors"
                  title="Unduh Berkas"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <button
                  onClick={() => {
                    if (confirm(`Yakin ingin menghapus dokumen "${doc.title}"?`)) {
                      onDeleteDocument(doc.id);
                    }
                  }}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs transition-colors"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            Belum ada dokumen yang sesuai dengan kriteria filter.
          </div>
        )}
      </div>

      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onUploadDocument}
        projects={projects}
      />
    </div>
  );
};
