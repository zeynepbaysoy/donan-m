'use client';

import React, { useState } from 'react';
import { IC_DONANIM_BIRIMLERI, HardwareItem } from '@/lib/hardware-data';
import { HardwareVisual } from '@/components/HardwareVisual';
import { audioFeedback } from '@/lib/audio-feedback';
import { 
  Cpu, 
  Search, 
  Volume2, 
  Sparkles, 
  Wrench, 
  Zap, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Layers
} from 'lucide-react';

export function InternalHardwareSection() {
  const [selectedItem, setSelectedItem] = useState<HardwareItem>(IC_DONANIM_BIRIMLERI[0]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = IC_DONANIM_BIRIMLERI.filter(item => {
    const matchesFilter = filter === 'all' || item.subCategory === filter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSpeak = (item: HardwareItem) => {
    const text = `${item.name}. ${item.shortDesc} Temel görevi: ${item.function} Öğretmen Montaj İpucu: ${item.assemblyTip}`;
    audioFeedback.speak(text, true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Başlık ve Tanıtım Kartı */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/20 p-6 md:p-8 backdrop-blur-sm">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
              <Cpu className="w-3.5 h-3.5" />
              1. Bölüm : Sistem Mimarisi
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              İç Donanım Birimleri
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              Bilgisayar kasasının içinde yer alan, doğrudan anakarta bağlanan ve sistemin çalışmasını, hesaplamalarını, veri depolamasını ve enerjisini sağlayan çekirdek bileşenleri keşfedin.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {IC_DONANIM_BIRIMLERI.length}
            </div>
            <div>
              <div className="text-xs text-slate-400">Tanıtılan Bileşen</div>
              <div className="text-sm font-semibold text-white">Temel İç Donanım</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Tüm Parçalar ({IC_DONANIM_BIRIMLERI.length})
          </button>
          <button
            onClick={() => setFilter('temel-ic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'temel-ic'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Temel Birimler (CPU, RAM, Anakart, SSD)
          </button>
          <button
            onClick={() => setFilter('genisleme')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'genisleme'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Genişleme Kartları (GPU, Ağ/Ses)
          </button>
          <button
            onClick={() => setFilter('guc-sogutma')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              filter === 'guc-sogutma'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Güç ve Soğutma (PSU, Fan)
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="İç donanım ara (örn: RAM, CPU)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Ana Grid & Seçili Parça İnceleme Laboratuvarı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Kolon: Donanım Kartları Listesi */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredItems.map(item => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/40'
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
                  <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {item.shortDesc}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
              Arama kriterinize uygun iç donanım birimi bulunamadı.
            </div>
          )}
        </div>

        {/* Sağ Kolon: Ayrıntılı Donanım İnceleme Paneli */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
            {/* Üst Başlık & Görsel */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800">
              <div className="shrink-0">
                <HardwareVisual id={selectedItem.id} name={selectedItem.name} size="lg" />
              </div>
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${selectedItem.badgeColor}`}>
                    {selectedItem.subCategoryTitle}
                  </span>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Öğretmen Sesli Özeti Dinle
                  </button>
                </div>
              </div>
            </div>

            {/* Görev ve Çalışma Mantığı */}
            <div className="space-y-4">
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Bilgisayardaki Temel Görevi
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedItem.function}
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5" />
                  Derinlemesine Teknik Açıklama
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedItem.detailedDesc}
                </p>
              </div>
            </div>

            {/* Teknik Özellikler Grid */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Önemli Teknik Parametreler
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedItem.keySpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Öğretmenin Kasa Montaj İpucu */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-amber-950/20 border border-amber-500/30 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Wrench className="w-4 h-4 text-amber-400" />
                Öğretmen Montaj & Bakım Notu
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {selectedItem.assemblyTip}
              </p>
            </div>

            {/* Biliyor muydunuz? Trivia */}
            <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/20 p-4 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-cyan-300">Biliyor muydunuz?</div>
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
