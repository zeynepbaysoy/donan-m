'use client';

import React, { useState } from 'react';
import { 
  OYUN_SORULARI, 
  QuizQuestion, 
  MatchingQuestion, 
  TrueFalseQuestion, 
  FillBlankQuestion, 
  MultipleChoiceQuestion, 
  AssemblyQuestion 
} from '@/lib/quiz-data';
import { HardwareVisual } from '@/components/HardwareVisual';
import { audioFeedback } from '@/lib/audio-feedback';
import { 
  Gamepad2, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Lightbulb, 
  ArrowRight, 
  Trophy, 
  Wrench, 
  Check, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export interface QuizResults {
  totalQuestions: number;
  firstAttemptCorrect: number;
  secondAttemptCorrect: number;
  wrongCount: number;
  totalScore: number;
  categoryBreakdown: {
    icDonanim: { total: number; correct: number };
    disDonanim: { total: number; correct: number };
    kasaMontaj: { total: number; correct: number };
    eslestirme: { total: number; correct: number };
  };
  mistakenConcepts: string[];
}

interface QuizSectionProps {
  onComplete: (results: QuizResults) => void;
  onNavigateToReport?: () => void;
}

export function QuizSection({ onComplete, onNavigateToReport }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAttempt, setUserAttempt] = useState<number>(0); // 0: ilk deneme, 1: ikinci deneme
  const [questionStatus, setQuestionStatus] = useState<'idle' | 'hint_shown' | 'solved_first' | 'solved_second' | 'failed'>('idle');
  
  // İstatistikler
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<number>(0);
  const [secondAttemptCorrect, setSecondAttemptCorrect] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [mistakenConcepts, setMistakenConcepts] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState({
    icDonanim: { total: 0, correct: 0 },
    disDonanim: { total: 0, correct: 0 },
    kasaMontaj: { total: 0, correct: 0 },
    eslestirme: { total: 0, correct: 0 }
  });

  // Çoktan seçmeli ve Boşluk doldurma seçimi
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  // Doğru/Yanlış seçimi
  const [selectedTF, setSelectedTF] = useState<boolean | null>(null);

  // Eşleştirme durumu
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});

  // Kasa Montajı durumu
  const [mountedSlots, setMountedSlots] = useState<Record<string, string>>({}); // slotId -> partId
  const [selectedPartToMount, setSelectedPartToMount] = useState<string | null>(null);

  const currentQ: QuizQuestion = OYUN_SORULARI[currentIndex];
  const isLastQuestion = currentIndex === OYUN_SORULARI.length - 1;

  // Soru tipine göre kategori anahtarı
  const getCategoryKey = (q: QuizQuestion): keyof typeof categoryStats => {
    if (q.type === 'kasa-montaji') return 'kasaMontaj';
    if (q.type === 'eslestirme') return 'eslestirme';
    if (q.category === 'ic') return 'icDonanim';
    return 'disDonanim';
  };

  // Sonraki soruya geçiş
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
      return;
    }
    setCurrentIndex(prev => prev + 1);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setUserAttempt(0);
    setQuestionStatus('idle');
    setSelectedOption(null);
    setDisabledOptions([]);
    setSelectedTF(null);
    setMatchingAnswers({});
    setMountedSlots({});
    setSelectedPartToMount(null);
  };

  const finishQuiz = () => {
    const totalQ = OYUN_SORULARI.length;
    // İlk deneme tam puan (100%), 2. deneme kısmi puan (65%)
    const rawScore = (firstAttemptCorrect * 10) + (secondAttemptCorrect * 6.5);
    const percentage = Math.min(100, Math.round((rawScore / (totalQ * 10)) * 100));

    const results: QuizResults = {
      totalQuestions: totalQ,
      firstAttemptCorrect,
      secondAttemptCorrect,
      wrongCount,
      totalScore: percentage,
      categoryBreakdown: categoryStats,
      mistakenConcepts
    };

    onComplete(results);
  };

  // 1. Çoktan Seçmeli İşlemi
  const handleMultipleChoiceSelect = (optionId: string) => {
    if (questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') return;
    if (disabledOptions.includes(optionId)) return;

    setSelectedOption(optionId);
    const q = currentQ as MultipleChoiceQuestion;
    const cat = getCategoryKey(q);

    if (optionId === q.correctOptionId) {
      if (userAttempt === 0) {
        setFirstAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_first');
        audioFeedback.triggerMotivatingSuccess('Tebrikler! İlk denemede doğru cevabı buldun!');
      } else {
        setSecondAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_second');
        audioFeedback.triggerMotivatingSuccess('Harika! 2. deneme hakkını çok iyi kullandın ve doğruya ulaştın!');
      }
    } else {
      // Yanlış cevap
      if (userAttempt === 0) {
        setUserAttempt(1);
        setDisabledOptions(prev => [...prev, optionId]);
        setQuestionStatus('hint_shown');
        audioFeedback.triggerGuidingHint(q.hint);
      } else {
        // 2. denemede de yanlış
        setWrongCount(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1 }
        }));
        setMistakenConcepts(prev => [...prev, q.conceptKey]);
        setQuestionStatus('failed');
        audioFeedback.triggerSecondMiss(q.explanation);
      }
    }
  };

  // 2. Doğru / Yanlış İşlemi
  const handleTFSelect = (chosen: boolean) => {
    if (questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') return;

    setSelectedTF(chosen);
    const q = currentQ as TrueFalseQuestion;
    const cat = getCategoryKey(q);

    if (chosen === q.isTrue) {
      if (userAttempt === 0) {
        setFirstAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_first');
        audioFeedback.triggerMotivatingSuccess('Harika! Doğru tespit, tam bir donanım uzmanı gibi çözdün!');
      } else {
        setSecondAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_second');
        audioFeedback.triggerMotivatingSuccess('Tebrikler! İkinci şansında doğru kararı verdin!');
      }
    } else {
      if (userAttempt === 0) {
        setUserAttempt(1);
        setQuestionStatus('hint_shown');
        audioFeedback.triggerGuidingHint(q.hint);
      } else {
        setWrongCount(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1 }
        }));
        setMistakenConcepts(prev => [...prev, q.conceptKey]);
        setQuestionStatus('failed');
        audioFeedback.triggerSecondMiss(q.explanation);
      }
    }
  };

  // 3. Boşluk Doldurma İşlemi
  const handleFillSelect = (chosen: string) => {
    if (questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') return;
    if (disabledOptions.includes(chosen)) return;

    setSelectedOption(chosen);
    const q = currentQ as FillBlankQuestion;
    const cat = getCategoryKey(q);

    if (chosen === q.correctAnswer) {
      if (userAttempt === 0) {
        setFirstAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_first');
        audioFeedback.triggerMotivatingSuccess('Bravo! Boşluğu en doğru donanım terimiyle doldurdun!');
      } else {
        setSecondAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_second');
        audioFeedback.triggerMotivatingSuccess('Tebrikler! İpucunu takip ederek doğru cevaba ulaştın!');
      }
    } else {
      if (userAttempt === 0) {
        setUserAttempt(1);
        setDisabledOptions(prev => [...prev, chosen]);
        setQuestionStatus('hint_shown');
        audioFeedback.triggerGuidingHint(q.hint);
      } else {
        setWrongCount(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1 }
        }));
        setMistakenConcepts(prev => [...prev, q.conceptKey]);
        setQuestionStatus('failed');
        audioFeedback.triggerSecondMiss(q.explanation);
      }
    }
  };

  // 4. Eşleştirme Kontrolü
  const handleMatchingDrop = (cardId: string, targetCategory: string) => {
    if (questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') return;
    setMatchingAnswers(prev => ({ ...prev, [cardId]: targetCategory }));
  };

  const evaluateMatching = () => {
    const q = currentQ as MatchingQuestion;
    const cat = getCategoryKey(q);
    const allAnswered = q.cards.every(c => matchingAnswers[c.id]);
    if (!allAnswered) {
      audioFeedback.speak('Lütfen tüm kartları uygun kategorilere yerleştirin.', true);
      return;
    }

    const hasError = q.cards.some(c => matchingAnswers[c.id] !== c.category);

    if (!hasError) {
      if (userAttempt === 0) {
        setFirstAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_first');
        audioFeedback.triggerMotivatingSuccess('Kusursuz! Tüm iç ve dış donanım birimlerini doğru eşleştirdin!');
      } else {
        setSecondAttemptCorrect(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
        }));
        setQuestionStatus('solved_second');
        audioFeedback.triggerMotivatingSuccess('Harika! 2. denemede tüm eşleştirmeleri düzelttin!');
      }
    } else {
      if (userAttempt === 0) {
        setUserAttempt(1);
        setQuestionStatus('hint_shown');
        audioFeedback.triggerGuidingHint(q.hint);
      } else {
        setWrongCount(prev => prev + 1);
        setCategoryStats(prev => ({
          ...prev,
          [cat]: { ...prev[cat], total: prev[cat].total + 1 }
        }));
        setMistakenConcepts(prev => [...prev, q.conceptKey]);
        setQuestionStatus('failed');
        audioFeedback.triggerSecondMiss(q.explanation);
      }
    }
  };

  // 5. Kasa Montajı Kontrolü
  const handleMountPart = (slotId: string) => {
    if (questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') return;
    if (!selectedPartToMount) return;

    const q = currentQ as AssemblyQuestion;
    const targetSlot = q.slots.find(s => s.id === slotId);
    if (!targetSlot) return;

    if (targetSlot.requiredPartId === selectedPartToMount) {
      // Doğru parça takıldı
      setMountedSlots(prev => ({ ...prev, [slotId]: selectedPartToMount }));
      setSelectedPartToMount(null);
      audioFeedback.playSuccessSound();

      // Tüm parçalar bitti mi kontrol et
      const willBeAllMounted = Object.keys({ ...mountedSlots, [slotId]: selectedPartToMount }).length === q.slots.length;
      if (willBeAllMounted) {
        const cat = getCategoryKey(q);
        if (userAttempt === 0) {
          setFirstAttemptCorrect(prev => prev + 1);
          setCategoryStats(prev => ({
            ...prev,
            [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
          }));
          setQuestionStatus('solved_first');
          audioFeedback.triggerMotivatingSuccess('Muhteşem bir montaj! Bilgisayar kasası ve tüm parçalar başarıyla kuruldu ve çalıştırıldı!');
        } else {
          setSecondAttemptCorrect(prev => prev + 1);
          setCategoryStats(prev => ({
            ...prev,
            [cat]: { ...prev[cat], total: prev[cat].total + 1, correct: prev[cat].correct + 1 }
          }));
          setQuestionStatus('solved_second');
          audioFeedback.triggerMotivatingSuccess('Tebrikler! 2. denemede yuvaları doğru eşleştirdin ve montaj tamamlandı!');
        }
      }
    } else {
      // Yanlış yuvaya takılmaya çalışıldı
      if (userAttempt === 0) {
        setUserAttempt(1);
        setQuestionStatus('hint_shown');
        audioFeedback.triggerGuidingHint(targetSlot.hint);
      } else {
        // İkinci yanlış deneme
        audioFeedback.triggerGuidingHint('Yuvanın şekline ve açıklamadaki anakart yoluna dikkat edin.');
      }
    }
  };

  const getQuestionTypeBadge = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'kasa-montaji':
        return { label: 'Sanal Kasa Montajı', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'eslestirme':
        return { label: 'Eşleştirme Oyunu', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'dogru-yanlis':
        return { label: 'Doğru / Yanlış', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'bosluk-doldurma':
        return { label: 'Boşluk Doldurma', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'coktan-secmeli':
        return { label: 'Çoktan Seçmeli', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const badgeInfo = getQuestionTypeBadge(currentQ.type);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Oyun Başlık & Kurallar Barı */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide uppercase">
              <Gamepad2 className="w-3.5 h-3.5" />
              3. Bölüm : Bilişim Teknolojileri Öğretmeni Oyun Alanı
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Donanımsal Soru ve Simülasyon Oyunu
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Kasa montajı, iç/dış eşleştirme, doğru-yanlış ve çoktan seçmeli etkinliklerle bilginizi test edin. Yanıldığınızda 2. deneme hakkınız var!
            </p>
          </div>

          {/* İlerleme ve Skor Rozeti */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-center">
              <div className="text-[11px] text-slate-400 font-medium">Soru</div>
              <div className="text-xl font-black text-white">
                {currentIndex + 1} <span className="text-sm text-slate-500 font-normal">/ {OYUN_SORULARI.length}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[11px] text-emerald-400 font-medium">İlk Deneme</div>
              <div className="text-xl font-black text-emerald-400">{firstAttemptCorrect}</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[11px] text-amber-400 font-medium">2. Şansla</div>
              <div className="text-xl font-black text-amber-400">{secondAttemptCorrect}</div>
            </div>
          </div>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="mt-6 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / OYUN_SORULARI.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Soru Kartı Konteyneri */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
        {/* Üst Bilgi Başlığı */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full border font-bold ${badgeInfo.color}`}>
              {badgeInfo.label}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {currentQ.conceptKey}
            </span>
          </div>

          {/* Kural Hatırlatıcı / Durum */}
          <div className="flex items-center gap-2">
            {userAttempt === 0 && questionStatus === 'idle' && (
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                1. Deneme Hakkı (2 deneme hakkınız var)
              </span>
            )}
            {userAttempt === 1 && questionStatus === 'hint_shown' && (
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 animate-pulse">
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                2. Deneme Hakkınız Aktif!
              </span>
            )}
          </div>
        </div>

        {/* 1. KASA MONTAJI MODU */}
        {currentQ.type === 'kasa-montaji' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                {currentQ.title}
              </h3>
              <p className="text-sm text-slate-300">
                {(currentQ as AssemblyQuestion).instruction}
              </p>
            </div>

            {/* Parça Tepsisi */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                1. Adım: Monte Edilecek Parçayı Seçin
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {(currentQ as AssemblyQuestion).availableParts.map(part => {
                  const isMounted = Object.values(mountedSlots).includes(part.id);
                  const isSelected = selectedPartToMount === part.id;
                  return (
                    <button
                      key={part.id}
                      disabled={isMounted || questionStatus === 'solved_first' || questionStatus === 'solved_second'}
                      onClick={() => setSelectedPartToMount(part.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center text-center gap-2 ${
                        isMounted
                          ? 'opacity-40 bg-slate-900 border-slate-800 cursor-not-allowed'
                          : isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50 scale-105'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <HardwareVisual id={part.id.replace('part-', '') === 'cooler' ? 'sogutma-sistemi' : part.id.replace('part-', '') === 'gpu' ? 'ekran-karti' : part.id.replace('part-', '') === 'psu' ? 'guc-kaynagi' : part.id.replace('part-', '') === 'ssd' ? 'ssd-hdd' : part.id.replace('part-', '') === 'cpu' ? 'islemci' : 'ram'} name={part.name} size="sm" />
                      <div>
                        <div className="text-xs font-bold truncate max-w-[100px]">{part.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{isMounted ? '✓ Takıldı' : 'Hazır'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anakart / Kasa Yuvaları Şeması */}
            <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>2. Adım: Anakart ve Kasa Üzerindeki Doğru Yuvaya Tıklayın</span>
                <span className="text-emerald-400">
                  {Object.keys(mountedSlots).length} / {(currentQ as AssemblyQuestion).slots.length} Parça Takıldı
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(currentQ as AssemblyQuestion).slots.map(slot => {
                  const mountedPartId = mountedSlots[slot.id];
                  const isFilled = !!mountedPartId;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => !isFilled && selectedPartToMount && handleMountPart(slot.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        isFilled
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                          : selectedPartToMount
                            ? 'bg-slate-900/80 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30'
                            : 'bg-slate-900/60 border-slate-800/80 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Yuva #{slot.orderNumber}
                        </span>
                        {isFilled ? (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Monte Edildi
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Boş Yuva</span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-white mb-1">{slot.slotName}</div>
                      <div className="text-xs text-slate-400">{slot.description}</div>

                      {isFilled && (
                        <div className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 pt-2 border-t border-emerald-500/30">
                          <CheckCircle className="w-3.5 h-3.5" /> {slot.requiredPartName} takıldı!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. EŞLEŞTİRME OYUNU MODU */}
        {currentQ.type === 'eslestirme' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                {currentQ.title}
              </h3>
              <p className="text-sm text-slate-300">
                {(currentQ as MatchingQuestion).instruction}
              </p>
            </div>

            <div className="space-y-4">
              {/* Kartlar ve Kategori Seçimleri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(currentQ as MatchingQuestion).cards.map(card => {
                  const currentCategory = matchingAnswers[card.id];
                  const isLocked = questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed';

                  return (
                    <div 
                      key={card.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <HardwareVisual id={card.id.replace('c-', '') === 'cpu' ? 'islemci' : card.id.replace('c-', '') === 'mon' ? 'monitor' : card.id.replace('c-', '') === 'ram' ? 'ram' : card.id.replace('c-', '') === 'key' ? 'klavye' : card.id.replace('c-', '') === 'psu' ? 'guc-kaynagi' : card.id.replace('c-', '') === 'mou' ? 'fare' : card.id.replace('c-', '') === 'tar' ? 'tarayici' : card.id.replace('c-', '') === 'hop' ? 'hoparlor-kulaklik' : card.id.replace('c-', '') === 'mik' ? 'mikrofon-ve-kamera' : 'yazici'} name={card.text} size="sm" />
                        <div>
                          <div className="text-sm font-bold text-white">{card.text}</div>
                          <div className="text-xs text-slate-400">Ait olduğu sınıfı seçin:</div>
                        </div>
                      </div>

                      {/* Seçim Butonları */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                        {currentQ.id === 'eslestirme-1' ? (
                          <>
                            <button
                              disabled={isLocked}
                              onClick={() => handleMatchingDrop(card.id, 'ic')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                                currentCategory === 'ic'
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              İç Donanım
                            </button>
                            <button
                              disabled={isLocked}
                              onClick={() => handleMatchingDrop(card.id, 'dis')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                                currentCategory === 'dis'
                                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              Dış Donanım
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled={isLocked}
                              onClick={() => handleMatchingDrop(card.id, 'giris')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                                currentCategory === 'giris'
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              Giriş (Input)
                            </button>
                            <button
                              disabled={isLocked}
                              onClick={() => handleMatchingDrop(card.id, 'cikis')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                                currentCategory === 'cikis'
                                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              Çıkış (Output)
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {questionStatus === 'idle' || questionStatus === 'hint_shown' ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={evaluateMatching}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20"
                  >
                    Eşleştirmeleri Kontrol Et
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* 3. ÇOKTAN SEÇMELİ MODU */}
        {currentQ.type === 'coktan-secmeli' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                {(currentQ as MultipleChoiceQuestion).question}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentQ as MultipleChoiceQuestion).options.map(opt => {
                const isSelected = selectedOption === opt.id;
                const isDisabled = disabledOptions.includes(opt.id);
                const isCorrect = opt.id === (currentQ as MultipleChoiceQuestion).correctOptionId;
                const isSolved = questionStatus === 'solved_first' || questionStatus === 'solved_second';

                let style = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';
                if (isDisabled) {
                  style = 'bg-rose-950/20 border-rose-500/30 text-rose-300 opacity-60 cursor-not-allowed';
                } else if (isSolved && isCorrect) {
                  style = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50';
                } else if (questionStatus === 'failed' && isCorrect) {
                  style = 'bg-emerald-950/50 border-emerald-500 text-emerald-300';
                } else if (isSelected) {
                  style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isDisabled || isSolved || questionStatus === 'failed'}
                    onClick={() => handleMultipleChoiceSelect(opt.id)}
                    className={`p-4 rounded-2xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-3 ${style}`}
                  >
                    <span>{opt.text}</span>
                    {isDisabled && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {isSolved && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. DOĞRU / YANLIŞ MODU */}
        {currentQ.type === 'dogru-yanlis' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Önerme ve İfade
              </div>
              <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                {(currentQ as TrueFalseQuestion).statement}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed'}
                onClick={() => handleTFSelect(true)}
                className={`py-4 px-6 rounded-2xl border text-center font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  selectedTF === true && (questionStatus === 'solved_first' || questionStatus === 'solved_second')
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                    : selectedTF === true && questionStatus === 'hint_shown'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-slate-200'
                }`}
              >
                <Check className="w-5 h-5 text-emerald-400" />
                DOĞRU
              </button>

              <button
                disabled={questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed'}
                onClick={() => handleTFSelect(false)}
                className={`py-4 px-6 rounded-2xl border text-center font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  selectedTF === false && (questionStatus === 'solved_first' || questionStatus === 'solved_second')
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                    : selectedTF === false && questionStatus === 'hint_shown'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950/70 border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 text-slate-200'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-400" />
                YANLIŞ
              </button>
            </div>
          </div>
        )}

        {/* 5. BOŞLUK DOLDURMA MODU */}
        {currentQ.type === 'bosluk-doldurma' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed">
                {(currentQ as FillBlankQuestion).sentenceBefore}{' '}
                <span className="inline-block px-4 py-1 mx-1 rounded-xl bg-purple-500/20 border border-purple-500 text-purple-300 font-bold">
                  {selectedOption || '________ ? ________'}
                </span>{' '}
                {(currentQ as FillBlankQuestion).sentenceAfter}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(currentQ as FillBlankQuestion).options.map(opt => {
                const isDisabled = disabledOptions.includes(opt);
                const isSolved = questionStatus === 'solved_first' || questionStatus === 'solved_second';
                const isCorrect = opt === (currentQ as FillBlankQuestion).correctAnswer;

                return (
                  <button
                    key={opt}
                    disabled={isDisabled || isSolved || questionStatus === 'failed'}
                    onClick={() => handleFillSelect(opt)}
                    className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                      isDisabled
                        ? 'opacity-40 bg-rose-950/20 border-rose-800 text-rose-300 line-through'
                        : isSolved && isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-purple-500/50 text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* GERİBİLDİRİM VE YÖNLENDİRİCİ DÖNÜT KUTULARI (2. ŞANS KURALI) */}
        {/* ======================================================== */}

        {/* 1. Yanlış Yapıldığında: Yönlendirici İpucu ve 2. Seçim Hakkı */}
        {questionStatus === 'hint_shown' && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 p-4 md:p-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" />
              1. Seçiminde Yanıldın, Ama Pes Etme! 2. Seçim Hakkın Var!
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-200">💡 Bilişim Öğretmeni İpucu:</span> {currentQ.hint}
            </p>
            <div className="text-[11px] text-amber-400 font-medium pt-1">
              Yukarıdaki seçeneklerden tekrar seçim yaparak doğru cevaba ulaşabilirsin.
            </div>
          </div>
        )}

        {/* İlk Denemede Doğru Yapıldığında */}
        {questionStatus === 'solved_first' && (
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/50 p-4 md:p-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Tebrikler! İlk Denemede Kusursuz Doğru Yanıt! (+100 Puan)
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* İkinci Denemede Doğru Yapıldığında */}
        {questionStatus === 'solved_second' && (
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/50 p-4 md:p-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Harika Başarı! 2. Deneme Hakkını Çok İyi Değerlendirdin! (+65 Puan)
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* İki Denemede de Yanlış Yapıldığında: Çözüm Gösterimi */}
        {questionStatus === 'failed' && (
          <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 md:p-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
              <XCircle className="w-4 h-4 text-rose-400" />
              2 Deneme Hakkı Tamamlandı. Çözümü Birlikte İnceleyelim:
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentQ.explanation}
            </p>
            <div className="text-[11px] text-rose-300/80">
              Bu kavram öğrenci değerlendirme raporunda tekrar edilmesi gerekenler listesine eklendi.
            </div>
          </div>
        )}

        {/* İlerleme ve Sonraki Soru Butonu */}
        {(questionStatus === 'solved_first' || questionStatus === 'solved_second' || questionStatus === 'failed') && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Etkinlik tamamlandı, sonraki soruya geçebilirsiniz.
            </div>
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              {isLastQuestion ? (
                <>
                  <Trophy className="w-4 h-4" />
                  Raporu Oluştur ve Gör
                </>
              ) : (
                <>
                  Sonraki Soruya Geç
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Rapor Kısayolu (Önceden Raporu İncelemek İsterse) */}
      {onNavigateToReport && (
        <div className="text-center pt-2">
          <button
            onClick={onNavigateToReport}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Önceki Değerlendirme Raporunu Görüntüle
          </button>
        </div>
      )}
    </div>
  );
}
