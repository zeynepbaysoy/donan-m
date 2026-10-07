'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioFeedback } from '@/lib/audio-feedback';

export function AudioToggle() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return audioFeedback.getMuted();
    }
    return false;
  });

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    audioFeedback.setMuted(next);
    if (!next) {
      audioFeedback.playSuccessSound();
    }
  };

  return (
    <button
      onClick={toggle}
      title={muted ? 'Sesleri Aç' : 'Sesleri Kapat (Sessiz Mod)'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
        muted
          ? 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 shadow-sm shadow-cyan-500/20'
      }`}
    >
      {muted ? (
        <>
          <VolumeX className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Sessiz</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Sesli Dönüt Açık</span>
        </>
      )}
    </button>
  );
}
