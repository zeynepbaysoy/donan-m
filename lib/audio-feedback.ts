'use client';

// Web Audio API ile müzikal akorlar ve Web Speech API ile Türkçe öğretmen seslendirmesi

class AudioFeedbackController {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('donanimsal_audio_muted');
      this.isMuted = saved === 'true';
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('donanimsal_audio_muted', String(muted));
      if (muted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Motive edici zafer / doğru cevap melodisi (Web Audio API)
   */
  public playSuccessSound(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz) arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // AudioContext hatası durumunda sessizce devam et
    }
  }

  /**
   * Yönlendirici / 1. Yanlış için rehberlik çanı (Web Audio API)
   */
  public playHintSound(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // A4 (440Hz) -> E4 (329Hz) yumuşak iki ton
      const tones = [
        { f: 440, t: 0 },
        { f: 554.37, t: 0.12 }
      ];

      tones.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(0.18, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.35);
      });
    } catch {
      // Sessizce devam et
    }
  }

  /**
   * 2. Yanlış için yumuşak kapanış sesi
   */
  public playSoftAlertSound(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Sessizce devam et
    }
  }

  /**
   * Türkçe sesli öğretmen dönütü (Web Speech API)
   */
  public speak(text: string, priority: boolean = false): void {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (priority) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05; // Doğal ve dinamik hız
      utterance.pitch = 1.05; // Samimi ve motive edici perde

      // Türkçe ses arama
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.startsWith('tr'));
      if (trVoice) {
        utterance.voice = trVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Tarayıcı izin kısıtlamasında sessizce geç
    }
  }

  /**
   * Doğru cevap verildiğinde hem melodi hem rastgele motive edici Türkçe dönüt
   */
  public triggerMotivatingSuccess(customMessage?: string): void {
    this.playSuccessSound();
    const motivasyonlar = [
      'Tebrikler! Harika bir seçim yaptın!',
      'Bravo! Tam bir donanım uzmanı gibi çözdün!',
      'Süper! Doğru cevap, hız kesmeden devam!',
      'Çok doğru! Bu donanım birimini çok iyi kavramışsın!',
      'Harika gidiyorsun! Sistem montajında emin adımlarla ilerliyorsun!'
    ];
    const secilen = customMessage || motivasyonlar[Math.floor(Math.random() * motivasyonlar.length)];
    this.speak(secilen);
  }

  /**
   * İlk yanlışta yönlendirici ve teşvik edici Türkçe dönüt (2. şans hatırlatması)
   */
  public triggerGuidingHint(hintText?: string): void {
    this.playHintSound();
    const yonlendirmeler = [
      'Tekrar dene! Bir deneme hakkın daha var, ipucuna dikkat et.',
      'Yaklaştın! Bir kez daha seçim yapma hakkın var, parçanın görevini düşün.',
      'Pes etme! 2. deneme hakkını dikkatlice kullan, başarabilirsin!',
      'İpuçlarına göz at ve tekrar dene, sistem seni bekliyor!'
    ];
    const genelMesaj = yonlendirmeler[Math.floor(Math.random() * yonlendirmeler.length)];
    const okunacak = hintText ? `${genelMesaj} İpucu: ${hintText}` : genelMesaj;
    this.speak(okunacak);
  }

  /**
   * İkinci yanlışta çözüm yönlendirmesi
   */
  public triggerSecondMiss(solutionExplanation: string): void {
    this.playSoftAlertSound();
    this.speak(`Önemli değil! Şimdi doğru cevaba ve açıklamasına bakalım: ${solutionExplanation}`);
  }
}

export const audioFeedback = new AudioFeedbackController();
