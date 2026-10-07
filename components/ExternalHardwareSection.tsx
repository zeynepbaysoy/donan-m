'use client';

import React, { useState } from 'react';
import { DIS_DONANIM_BIRIMLERI, HardwareItem } from '@/lib/hardware-data';
import { HardwareVisual } from '@/components/HardwareVisual';
import { audioFeedback } from '@/lib/audio-feedback';
import { 
  Monitor, 
  Search, 
  Volume2, 
  Sparkles, 
  ArrowRightLeft, 
  ArrowRight, 
  ArrowLeft,
  Cable, 
  CheckCircle2, 
  ChevronRight,
  Layers,
  HelpCircle
} from 'lucide-react';

export function ExternalHardwareSection() {
  const [selectedItem, setSelectedItem] = useState<HardwareItem>(DIS_DONANIM_BIRIMLERI[0]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = DIS_DONANIM_BIRIMLERI.filter(item => {
    const matchesFilter = filter === 'all' || item.subCategory === filter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSpeak = (item: HardwareItem) => {
    const text = `${item.name}. ${item.shortDesc} Veri akışı ve görevi: ${item.function} Bağlantı İpucu: ${item.assemblyTip}`;
    audioFeedback.speak(text, true);
  };

  const getDataFlowBadge = (subCat?: string) => {
    if (subCat === 'giris') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
          <ArrowRight className="w-3 h-3 text-emerald-400" />
          Kullanıcı ➔ Bilgisayar (Giriş)
        </span>
      );
    }
    if (subCat === 'cikis') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-medium">
          <ArrowLeft className="w-3 h-3 text-purple-400" />
          Bilgisayar ➔ Kullanıcı (Çıkış)
        </span>
      );
    }
    if (subCat === 'giris-cikis') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30 font-medium">
          <ArrowRightLeft className="w-3 h-3 text-pink-400" />
          Çift Yönlü Veri Akışı (G/Ç)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-medium">
        <Cable className="w-3 h-3 text-blue-400" />
        Fiziksel Port / Arayüz
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 p-6 md:p-8 backdrop-blur-sm">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide uppercase">
              <Monitor className="w-3.5 h-3.5" />
              2. Bölüm : Çevre Birimleri & Portlar
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Dış Donanım Birimleri
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Kullanıcının bilgisayarla iletişim kurmasını sağlayan giriş, çıkış, çift yönlü (G/Ç) çevre birimlerini ve kasanın arka/ön panelindeki bağlantı portlarını yakından tanıyın.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
              {DIS_DONANIM_BIRIMLERI.length}
            </div>
            <div>
              <div className="text-xs text-slate-400">Tanıtılan Aygıt</div>
              <div className="text-sm font-semibold text-white">Çevre & Port Birimi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sınıflandırma ve Filtreler */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Tümü ({DIS_DONANIM_BIRIMLERI.length})
          </button>
          <button
            onClick={() => setFilter('giris')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'giris'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Giriş Birimleri (Input)
          </button>
          <button
            onClick={() => setFilter('cikis')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'cikis'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Çıkış Birimleri (Output)
          </button>
          <button
            onClick={() => setFilter('giris-cikis')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'giris-cikis'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Hem Giriş Hem Çıkış (G/Ç)
          </button>
          <button
            onClick={() => setFilter('port')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'port'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Bağlantı Portları
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Dış donanım veya port ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid Listesi & Detay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Dış Donanım Listesi */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredItems.map(item => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/40'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="shrink-0">
                  <HardwareVisual id={item.id} name={item.name} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}>
                      {item.subCategoryTitle}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.shortDesc}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${isSelected ? 'text-purple-400 translate-x-1' : 'text-slate-600'}`} />
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              Arama kriterinize uygun dış donanım birimi bulunamadı.
            </div>
          )}
        </div>

        {/* Sağ Kolon: Dış Donanım İnceleme Paneli */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
            {/* Üst Kısım */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800">
              <div className="shrink-0">
                <HardwareVisual id={selectedItem.id} name={selectedItem.name} size="lg" />
              </div>
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {getDataFlowBadge(selectedItem.subCategory)}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {selectedItem.englishName}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.shortDesc}
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={() => handleSpeak(selectedItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Öğretmen Sesli Açıklamasını Dinle
                  </button>
                </div>
              </div>
            </div>

            {/* Görevi & Veri İletimi */}
            <div className="space-y-4">
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  Kullanım Amacı ve İşlevi
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedItem.function}
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Çalışma Prensibi
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.detailedDesc}
                </p>
              </div>
            </div>

            {/* Teknik Parametreler */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Cable className="w-3.5 h-3.5" />
                Önemli Özellikler ve Port Standartları
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedItem.keySpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bağlantı & Kurulum Tavsiyesi */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-950 to-blue-950/20 border border-blue-500/30 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                <Cable className="w-4 h-4 text-blue-400" />
                Bağlantı ve Kullanım İpucu
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                {selectedItem.assemblyTip}
              </p>
            </div>

            {/* Biliyor muydunuz? Trivia */}
            <div className="rounded-2xl bg-pink-950/20 border border-pink-500/20 p-4 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-pink-300">Bilişim Tarihinden</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedItem.funFact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
