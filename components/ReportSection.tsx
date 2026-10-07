'use client';

import React, { useState, useEffect } from 'react';
import { QuizResults } from '@/components/QuizSection';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  RotateCcw, 
  BookOpen, 
  Wrench, 
  HeartHandshake, 
  Loader2,
  FileText,
  Gamepad2,
  ChevronRight
} from 'lucide-react';

interface ReportSectionProps {
  quizResults: QuizResults | null;
  onRestartQuiz: () => void;
}

interface TeacherReportData {
  unvan: string;
  ogretmenMektubu: string;
  gucluYonler: string[];
  gelisimAlanlari: string[];
  pratikTavsiyeler: string[];
  ikinciSansDegerlendirmesi: string;
  rozetAdi: string;
  rozetAciklamasi: string;
}

export function ReportSection({ quizResults, onRestartQuiz }: ReportSectionProps) {
  const [reportData, setReportData] = useState<TeacherReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  // Örnek / varsayılan sonuçlar (Eğer kullanıcı oyunu bitirmeden önce bu sekmeye tıklarsa)
  const defaultResults: QuizResults = React.useMemo(() => quizResults || {
    totalQuestions: 10,
    firstAttemptCorrect: 8,
    secondAttemptCorrect: 2,
    wrongCount: 0,
    totalScore: 93,
    categoryBreakdown: {
      icDonanim: { total: 4, correct: 4 },
      disDonanim: { total: 3, correct: 3 },
      kasaMontaj: { total: 1, correct: 1 },
      eslestirme: { total: 2, correct: 2 }
    },
    mistakenConcepts: []
  }, [quizResults]);

  const results = quizResults || defaultResults;

  useEffect(() => {
    let isMounted = true;

    fetch('/api/gemini/rapor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    })
      .then(res => {
        if (!res.ok) throw new Error('Rapor verisi alınamadı');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setReportData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Rapor hatası:', err);
        if (isMounted) {
          setError('Öğretmen raporu oluşturulurken bir aksaklık oldu, yerel karne formatı yüklendi.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [results]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Oyun henüz oynanmadıysa bilgilendirme banner'ı */}
      {!quizResults && (
        <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs sm:text-sm text-cyan-200">
              Henüz soru ve montaj oyununu tamamlamadınız. Aşağıda örnek bir başarı karnesi görüntülenmektedir.
            </div>
          </div>
          <button
            onClick={onRestartQuiz}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
          >
            Oyunu Şimdi Oyna
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Rapor Başlık Kartı */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 p-6 md:p-8 backdrop-blur-sm print:bg-white print:text-black print:border-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase print:hidden">
              <Award className="w-3.5 h-3.5" />
              4. Bölüm : Bilişim Teknolojileri Öğretmeni Başarı Karnesi
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight print:text-black">
              Öğrenci Donanım Başarı Raporu
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed print:text-slate-700">
              Bilişim Teknolojilerinin Temelleri dersi kapsamında iç ve dış donanım birimleri, kasa montajı ve eşleştirme etkinliklerindeki yetkinlik değerlendirmeniz.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              Yazdır / PDF Kaydet
            </button>
            <button
              onClick={onRestartQuiz}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Oyna
            </button>
          </div>
        </div>
      </div>

      {/* Sayısal Skor İstatistikleri Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Başarı Puanı */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-1 text-center relative overflow-hidden">
          <div className="text-xs text-slate-400 font-medium">Toplam Başarı Puanı</div>
          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            %{results.totalScore}
          </div>
          <div className="text-[11px] text-slate-500">
            {results.totalScore >= 85 ? 'Pekiyi Derece' : results.totalScore >= 70 ? 'İyi Derece' : 'Geliştirilebilir'}
          </div>
        </div>

        {/* İlk Denemede Doğru */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-1 text-center">
          <div className="text-xs text-emerald-400 font-medium">İlk Denemede Doğru</div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400">
            {results.firstAttemptCorrect}
          </div>
          <div className="text-[11px] text-slate-500">Tam Puan Alınan Sorular</div>
        </div>

        {/* 2. Şansla Kurtarılan */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-1 text-center">
          <div className="text-xs text-amber-400 font-medium">2. Şansla Kurtarılan</div>
          <div className="text-3xl sm:text-4xl font-black text-amber-400">
            {results.secondAttemptCorrect}
          </div>
          <div className="text-[11px] text-slate-500">İpucu ile Çözülenler</div>
        </div>

        {/* Kaçırılan */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-1 text-center">
          <div className="text-xs text-rose-400 font-medium">Tekrar Gereken</div>
          <div className="text-3xl sm:text-4xl font-black text-rose-400">
            {results.wrongCount}
          </div>
          <div className="text-[11px] text-slate-500">Geliştirilecek Kavramlar</div>
        </div>
      </div>

      {/* Yükleniyor Göstergesi */}
      {loading && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-12 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <div className="text-sm font-semibold text-white">
            Bilişim Teknolojileri Öğretmeni Karne Değerlendirmesini Hazırlıyor...
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            İç ve dış donanım yanıtlarınız, kasa montaj sıranız ve 2. deneme başarılarınız analiz ediliyor.
          </p>
        </div>
      )}

      {/* Öğretmen Raporu ve Rozet */}
      {reportData && !loading && (
        <div className="space-y-6">
          {/* Başarı Rozeti ve Unvan Kutusu */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Trophy className="w-12 h-12 text-emerald-400 animate-bounce" />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Kazanılan Başarı Rozeti: {reportData.rozetAdi}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {reportData.unvan}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {reportData.rozetAciklamasi}
              </p>
            </div>
          </div>

          {/* Öğretmen Karne Mektubu */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              <HeartHandshake className="w-4 h-4" />
              Bilişim Teknolojileri Öğretmeni Değerlendirme Mektubu
            </div>
            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {reportData.ogretmenMektubu}
            </div>

            {/* 2. Şans / Hata Ayıklama Yetkinliği Övgüsü */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300">
                  Hata Ayıklama ve 2. Şans Analizi
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {reportData.ikinciSansDegerlendirmesi}
                </p>
              </div>
            </div>
          </div>

          {/* Güçlü Yönler ve Gelişim Alanları Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Güçlü Yönler */}
            <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/30 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Güçlü Olduğun Alanlar
              </div>
              <div className="space-y-2.5">
                {reportData.gucluYonler.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gelişim Alanları */}
            <div className="rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Tekrar Edilmesi Önerilen Konular
              </div>
              <div className="space-y-2.5">
                {reportData.gelisimAlanlari.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs sm:text-sm text-slate-200">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Öğretmenden Pratik Çalışma Tavsiyeleri */}
          <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 md:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              <BookOpen className="w-4 h-4" />
              Gelecek Adımlar ve Pratik Tavsiyeler
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reportData.pratikTavsiyeler.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between gap-2">
                  <div className="text-xs font-bold text-cyan-300">Tavsiye #{idx + 1}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Karne İmzası / Resmi Bilişim Öğretmeni Mührü */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="text-xs text-slate-400">Değerlendiren Kurum & Ders</div>
              <div className="text-sm font-bold text-white">Bilişim Teknolojilerinin Temelleri Alanı</div>
              <div className="text-xs text-slate-500">&quot;Donanımsal&quot; Eğitsel Değerlendirme Sistemi</div>
            </div>
            <div className="sm:text-right">
              <div className="text-xs text-slate-400">Öğretmen Onayı</div>
              <div className="text-sm font-bold text-emerald-400">✓ Onaylandı ve Arşivlendi</div>
              <div className="text-[11px] text-slate-500">{new Date().toLocaleDateString('tr-TR')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
