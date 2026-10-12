'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { WorkspaceData, AIMessage } from '@/lib/types';

interface AIAssistantChatProps {
  workspace: WorkspaceData;
  onRefreshWorkspace: () => void;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  workspace,
  onRefreshWorkspace,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Halo ${workspace.currentUser.name}! Saya asisten Onfice Anda. Saya memahami konteks proyek, tugas, agenda rapat, dan kehadiran anggota di workspace **${workspace.organization.name}**.\n\nApa yang ingin Anda kerjakan atau diskusikan hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  const quickPrompts = [
    'Buatkan tugas review audit keamanan dan skema database',
    'Bagaimana progres proyek aktif saat ini?',
    'Siapa saja anggota tim yang sedang online di ruangan?',
    'Apa agenda rapat berikutnya hari ini?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: AIMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: AIMessage = {
          id: 'msg-' + Date.now() + '-reply',
          sender: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-err-' + Date.now(),
            sender: 'system',
            content: `Maaf, terjadi kesalahan: ${data.error || 'Gagal memproses permintaan'}`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'system',
          content: 'Koneksi ke backend AI gagal. Silakan coba kembali.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (msgId: string, action: NonNullable<AIMessage['suggestedAction']>) => {
    setExecutingActionId(msgId);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute',
          payload: {
            type: action.type,
            data: action.payload,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-conf-' + Date.now(),
            sender: 'system',
            content: `✅ Aksi berhasil dieksekusi: ${data.message}`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        onRefreshWorkspace();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingActionId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Onfice AI Copilot</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Workspace Contextual
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Asisten produktivitas cerdas berbasis konteks ruang kerja Onfice. Membantu menyusun tugas, draf, dan ringkasan.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Isolasi Izin Organisasi Aktif</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const isSystem = m.sender === 'system';

            if (isSystem) {
              return (
                <div key={m.id} className="text-center py-2">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {m.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                  {/* AI Suggested Action Button (Review & Confirm pattern) */}
                  {m.suggestedAction && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                        Tindakan Disarankan (Perlu Konfirmasi Anda):
                      </div>
                      <button
                        onClick={() => handleExecuteAction(m.id, m.suggestedAction!)}
                        disabled={executingActionId === m.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{m.suggestedAction.label}</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[10px] ${
                      isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Onfice AI sedang menyusun jawaban berdasarkan data workspace...
              </span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-5 py-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-50/50">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
            Saran Cepat:
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200/80 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan status proyek, minta draf tugas, atau ketik instruksi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
