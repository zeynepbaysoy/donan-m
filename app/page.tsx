'use client';

import React, { useState } from 'react';
import { InternalHardwareSection } from '@/components/InternalHardwareSection';
import { ExternalHardwareSection } from '@/components/ExternalHardwareSection';
import { QuizSection, QuizResults } from '@/components/QuizSection';
import { ReportSection } from '@/components/ReportSection';
import { AudioToggle } from '@/components/AudioToggle';
import { useAuth } from '@/lib/auth-context';
import { 
  Cpu, 
  Monitor, 
  Gamepad2, 
  Award, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  School,
  LogIn,
  LogOut,
  User as UserIcon,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'ic' | 'dis' | 'oyun' | 'rapor'>('ic');
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const { user, loading, openAuthModal, logout } = useAuth();

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setActiveTab('rapor');
  };

  const handleRestartQuiz = () => {
    setActiveTab('oyun');
  };

  const handleTabClick = (tab: 'ic' | 'dis' | 'oyun' | 'rapor') => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setActiveTab(tab);
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
              onClick={() => handleTabClick('ic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'ic' && user
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              1. İç Donanım
              {!user && <Lock className="w-3 h-3 text-slate-500 ml-0.5" />}
            </button>
            <button
              onClick={() => handleTabClick('dis')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dis' && user
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Monitor className="w-4 h-4" />
              2. Dış Donanım
              {!user && <Lock className="w-3 h-3 text-slate-500 ml-0.5" />}
            </button>
            <button
              onClick={() => handleTabClick('oyun')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'oyun' && user
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              3. Oyun & Montaj
              {!user && <Lock className="w-3 h-3 text-slate-500 ml-0.5" />}
            </button>
            <button
              onClick={() => handleTabClick('rapor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'rapor' && user
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              4. Rapor & Karne
              {!user && <Lock className="w-3 h-3 text-slate-500 ml-0.5" />}
            </button>
          </nav>

          {/* Sağ Alan: Ses + Giriş / Kullanıcı */}
          <div className="flex items-center gap-3">
            <AudioToggle />

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user.username}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Çıkış Yap"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kayıt Ol</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobil Sekme Menüsü */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-2 scrollbar-none bg-slate-950">
          <button
            onClick={() => handleTabClick('ic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ic' && user
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            İç Donanım
          </button>
          <button
            onClick={() => handleTabClick('dis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dis' && user
                ? 'bg-purple-500 text-white'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Dış Donanım
          </button>
          <button
            onClick={() => handleTabClick('oyun')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'oyun' && user
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Oyun & Test
          </button>
          <button
            onClick={() => handleTabClick('rapor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'rapor' && user
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
        {/* Kullanıcı Giriş Yapmamışsa Karşılama ve Kilit Ekranı */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-3xl mx-auto">
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold mb-6 shadow-inner">
              <Sparkles className="w-4 h-4" />
              <span>MEB Bilişim Teknolojileri Eğitici Simülasyonu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Bilgisayar Donanımlarını Keşfet,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Montaj Yap ve Öğren!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mb-8 leading-relaxed">
              İç ve dış donanım birimlerini 3 boyutlu etkileşimle incelemek, montaj simülasyonunu tamamlamak ve yapay zeka destekli pedagojik karnenizi kaydetmek için lütfen giriş yapın.
            </p>

            {/* Giriş & Kayıt Butonları */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-14">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yaparak Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ücretsiz Kayıt Ol</span>
              </button>
            </div>

            {/* Özellik Kartları (Kilitli Önizleme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
              <div 
                onClick={() => openAuthModal('login')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                  İç Donanım <Lock className="w-3.5 h-3.5 text-slate-500" />
                </h3>
                <p className="text-xs text-slate-400">İşlemci, RAM, Anakart ve PSU birimlerinin detaylı görsel anlatımı.</p>
              </div>

              <div 
                onClick={() => openAuthModal('login')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                  Dış Donanım <Lock className="w-3.5 h-3.5 text-slate-500" />
                </h3>
                <p className="text-xs text-slate-400">Giriş, Çıkış ve Depolama çevre birimlerinin interaktif incelemesi.</p>
              </div>

              <div 
                onClick={() => openAuthModal('login')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                  Montaj & Test <Lock className="w-3.5 h-3.5 text-slate-500" />
                </h3>
                <p className="text-xs text-slate-400">Sürükle-bırak montaj oyunu ve MEB müfredatı test soruları.</p>
              </div>

              <div 
                onClick={() => openAuthModal('login')}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                  AI Karne & Rapor <Lock className="w-3.5 h-3.5 text-slate-500" />
                </h3>
                <p className="text-xs text-slate-400">Gemini yapay zekası ile kişiselleştirilmiş öğrenci gelişim karnesi.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Kullanıcı Giriş Yaptığında Görüntülenen İçerik */
          <>
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
          </>
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
            <span>Öğrenci Gizliliği Korunur</span>
            <span>•</span>
            <span>Postgres Veritabanı & Güvenli Oturum</span>
            <span>•</span>
            <span>Gemini Destekli Pedagojik Değerlendirme</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
