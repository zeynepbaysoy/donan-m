'use client';

import React, { useState } from 'react';
import { InternalHardwareSection } from '@/components/InternalHardwareSection';
import { ExternalHardwareSection } from '@/components/ExternalHardwareSection';
import { QuizSection, QuizResults } from '@/components/QuizSection';
import { ReportSection } from '@/components/ReportSection';
import { AudioToggle } from '@/components/AudioToggle';
import { 
  Cpu, 
  Monitor, 
  Gamepad2, 
  Award, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  School
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ic' | 'dis' | 'oyun' | 'rapor'>('ic');
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setActiveTab('rapor');
  };

  const handleRestartQuiz = () => {
    setActiveTab('oyun');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Üst Navigasyon Çubuğu */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Başlık */}
          <div 
            onClick={() => setActiveTab('ic')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Donanımsal
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  MEB Müfredatı
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Bilişim Teknolojilerinin Temelleri
              </p>
            </div>
          </div>

          {/* Sekme Butonları (Masaüstü) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab('ic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'ic'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              1. İç Donanım
            </button>
            <button
              onClick={() => setActiveTab('dis')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dis'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Monitor className="w-4 h-4" />
              2. Dış Donanım
            </button>
            <button
              onClick={() => setActiveTab('oyun')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'oyun'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              3. Oyun & Montaj
            </button>
            <button
              onClick={() => setActiveTab('rapor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'rapor'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              4. Rapor & Karne
            </button>
          </nav>

          {/* Ses Kontrolü & Güvenlik Rozeti */}
          <div className="flex items-center gap-3">
            <AudioToggle />
          </div>
        </div>

        {/* Mobil Sekme Menüsü */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-2 scrollbar-none bg-slate-950">
          <button
            onClick={() => setActiveTab('ic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ic'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            İç Donanım
          </button>
          <button
            onClick={() => setActiveTab('dis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dis'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Dış Donanım
          </button>
          <button
            onClick={() => setActiveTab('oyun')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'oyun'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Oyun & Test
          </button>
          <button
            onClick={() => setActiveTab('rapor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'rapor'
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Karne / Rapor
          </button>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'ic' && <InternalHardwareSection />}
        {activeTab === 'dis' && <ExternalHardwareSection />}
        {activeTab === 'oyun' && (
          <QuizSection 
            onComplete={handleQuizComplete} 
            onNavigateToReport={() => setActiveTab('rapor')} 
          />
        )}
        {activeTab === 'rapor' && (
          <ReportSection 
            quizResults={quizResults} 
            onRestartQuiz={handleRestartQuiz} 
          />
        )}
      </main>

      {/* Alt Bilgi (Footer) */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-400" />
            <span>Bilişim Teknolojilerinin Temelleri Dersi Eğitsel Uygulaması</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Öğrenci Gizliliği Korunur (Kişisel Veri İstenmez)</span>
            <span>•</span>
            <span>Gemini Destekli Pedagojik Değerlendirme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
