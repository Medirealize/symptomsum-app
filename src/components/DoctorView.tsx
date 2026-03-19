'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DoctorViewProps {
  patientName: string;
  allergy: string;
  chiefComplaint1: string;
  chiefComplaint2: string | null;
  summary: string;
  onClose: () => void;
}

export default function DoctorView({
  patientName,
  allergy,
  chiefComplaint1,
  chiefComplaint2,
  summary,
  onClose,
}: DoctorViewProps) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as Navigator & { wakeLock: { request: (t: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen');
        } catch {
          // 非対応 or 許可されない
        }
      }
    };
    requestWakeLock();
    return () => {
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 「戻る」で前画面に戻れるように履歴を1つ積む
    if (!window.history.state?.doctorView) {
      window.history.pushState({ ...(window.history.state ?? {}), doctorView: true }, '');
    }

    const onPopState = () => {
      onClose();
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [onClose]);

  const allergyText = allergy && allergy.trim() !== '' && allergy.trim() !== 'なし' ? 'あり' : 'なし';

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-6 flex flex-col max-w-md mx-auto">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined' && window.history.state?.doctorView) {
            window.history.back();
            return;
          }
          onClose();
        }}
        className="self-end flex items-center gap-1 text-blue-600 font-bold mb-4"
        aria-label="閉じる"
      >
        <X className="w-5 h-5" />
        戻る
      </button>

      <header className="border-b-4 border-black pb-4 mb-6">
        <h2 className="text-3xl font-black mb-1">診察メモ</h2>
        <div className="flex flex-wrap gap-2 items-center text-xl font-bold">
          <span>{patientName}</span>
          <span className="text-slate-800 bg-slate-100 px-2 py-1 rounded font-bold">
            アレルギー歴：{allergyText}
          </span>
        </div>
      </header>

      <section className="mb-8">
        <h3 className="text-lg bg-black text-white px-2 py-1 inline-block mb-2">主訴</h3>
        <div className="text-2xl md:text-3xl font-black leading-tight">
          1. {chiefComplaint1}
          <br />
          <span className="text-xl text-slate-500 font-normal">
            2. {chiefComplaint2 ?? '（なし）'}
          </span>
        </div>
      </section>

      <section className="mb-8 bg-slate-100 p-4 rounded-xl">
        <h3 className="text-lg font-bold border-b border-slate-300 mb-2">経過の要約</h3>
        <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-slate-900">
          {summary}
        </div>
      </section>

      <footer className="mt-auto pt-10 text-center text-slate-400 text-sm">
        ※このメモは患者本人の記録をAIが整理したものです。
      </footer>
    </div>
  );
}
