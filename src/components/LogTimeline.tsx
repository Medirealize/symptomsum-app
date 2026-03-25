'use client';

import { Trash2 } from 'lucide-react';
import { SYMPTOM_LABELS, MOOD_OPTIONS, APPETITE_OPTIONS, TIME_RANGE_OPTIONS, SEVERITY_OPTIONS } from '@/lib/constants';
import type { SymptomLog } from '@/lib/types';
import { sortLogsByOnsetOldestFirst } from '@/lib/summary';

function timeRangeLabel(v: string): string {
  return TIME_RANGE_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

function symptomDisplay(log: SymptomLog): string {
  if (log.type === 'fever' && log.value) return `発熱 ${log.value}℃`;
  if (log.type === 'mood' && log.mood) {
    const m = MOOD_OPTIONS.find((o) => o.value === log.mood);
    return m ? `機嫌 ${m.emoji}` : '機嫌';
  }
  if (log.type === 'appetite' && log.appetite) {
    const a = APPETITE_OPTIONS.find((o) => o.value === log.appetite);
    return a ? `食欲 ${a.label}` : '食欲';
  }
  return SYMPTOM_LABELS[log.type] ?? '症状';
}

function severityLabel(severity: string): string {
  return SEVERITY_OPTIONS.find((s) => s.id === severity)?.label ?? severity;
}

interface LogTimelineProps {
  logs: SymptomLog[];
  onDelete?: (id: string) => void;
}

export default function LogTimeline({ logs, onDelete }: LogTimelineProps) {
  const sorted = sortLogsByOnsetOldestFirst(logs);

  if (sorted.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p>まだ記録がありません</p>
        <p className="text-sm mt-1">下の「記録する」で症状を追加してください</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 pb-4">
      {sorted.map((log) => (
        <li
          key={log.id}
          className={`rounded-xl p-4 border ${
            log.severity === 'high'
              ? 'bg-red-50 border-red-200'
              : log.severity === 'mid'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-medium text-slate-900">{symptomDisplay(log)}</p>
              <p className="text-sm text-slate-500 mt-0.5">{timeRangeLabel(log.timeRange)}</p>
            </div>
            <div className="flex flex-shrink-0 items-start gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  log.severity === 'high'
                    ? 'bg-red-200 text-red-800'
                    : log.severity === 'mid'
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-blue-200 text-blue-800'
                }`}
              >
                {severityLabel(log.severity)}
              </span>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(log.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-red-600 transition-colors"
                  aria-label="この症状を削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
