'use client';

import React from 'react';

interface HardwareVisualProps {
  id: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HardwareVisual({ id, className = '', size = 'md' }: HardwareVisualProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-40 h-40 sm:w-48 sm:h-48'
  }[size];

  switch (id) {
    case 'anakart':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border border-emerald-500/30 shadow-lg shadow-emerald-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* PCB Board */}
            <rect x="5" y="5" width="90" height="90" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            {/* Traces */}
            <path d="M 12 25 L 35 25 L 35 45" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 12 35 L 30 35 L 30 50" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 65 20 L 85 20" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M 65 30 L 85 30" stroke="#34d399" strokeWidth="0.8" fill="none" opacity="0.6" />
            {/* CPU Socket */}
            <rect x="25" y="20" width="30" height="30" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
            <rect x="30" y="25" width="20" height="20" rx="1" fill="#0f172a" stroke="#cbd5e1" strokeDasharray="1 1" />
            {/* RAM Slots */}
            <rect x="62" y="15" width="5" height="40" rx="1" fill="#334155" stroke="#38bdf8" strokeWidth="0.7" />
            <rect x="70" y="15" width="5" height="40" rx="1" fill="#334155" stroke="#38bdf8" strokeWidth="0.7" />
            <rect x="78" y="15" width="5" height="40" rx="1" fill="#334155" stroke="#38bdf8" strokeWidth="0.7" />
            {/* PCIe Slots */}
            <rect x="15" y="65" width="70" height="6" rx="1.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
            <rect x="15" y="77" width="50" height="5" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
            {/* Chipset Heatsink */}
            <rect x="65" y="62" width="20" height="20" rx="2" fill="#047857" stroke="#10b981" strokeWidth="1" />
            <text x="75" y="74" fontSize="4.5" fill="#a7f3d0" textAnchor="middle" fontWeight="bold">CHIP</text>
          </svg>
        </div>
      );

    case 'islemci':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-cyan-900/40 border border-cyan-500/30 shadow-lg shadow-cyan-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* CPU Substrate */}
            <rect x="10" y="10" width="80" height="80" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Corner Notch */}
            <polygon points="12,12 20,12 12,20" fill="#facc15" />
            {/* Integrated Heat Spreader (IHS) */}
            <rect x="20" y="20" width="60" height="60" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="25" y="25" width="50" height="50" rx="2" fill="#e2e8f0" />
            {/* Engraving */}
            <text x="50" y="44" fontSize="8" fill="#0f172a" textAnchor="middle" fontWeight="bold" letterSpacing="1">CPU</text>
            <text x="50" y="55" fontSize="4.5" fill="#475569" textAnchor="middle">8 CORE / 4.8 GHz</text>
            <text x="50" y="63" fontSize="3.5" fill="#64748b" textAnchor="middle">DONANIMSAL</text>
          </svg>
        </div>
      );

    case 'ram':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-amber-900/40 border border-amber-500/30 shadow-lg shadow-amber-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* RAM PCB & Heat Spreader */}
            <rect x="8" y="28" width="84" height="44" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            {/* RGB Lightbar on Top */}
            <rect x="10" y="24" width="80" height="6" rx="2" fill="url(#rgbGrad)" />
            {/* Gold Contacts */}
            <rect x="15" y="72" width="70" height="7" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            <line x1="50" y1="72" x2="50" y2="79" stroke="#1e293b" strokeWidth="2.5" />
            {/* Memory Chips */}
            <rect x="16" y="38" width="12" height="24" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <rect x="32" y="38" width="12" height="24" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <rect x="56" y="38" width="12" height="24" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <rect x="72" y="38" width="12" height="24" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <text x="50" y="52" fontSize="5" fill="#fde68a" textAnchor="middle" fontWeight="bold">DDR5 RAM</text>
            <defs>
              <linearGradient id="rgbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'ekran-karti':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-purple-900/40 border border-purple-500/30 shadow-lg shadow-purple-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Card Body */}
            <rect x="10" y="20" width="80" height="52" rx="4" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
            {/* PCIe Connector */}
            <rect x="25" y="72" width="50" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            <line x1="45" y1="72" x2="45" y2="80" stroke="#18181b" strokeWidth="2" />
            {/* Dual Cooling Fans */}
            <circle cx="32" cy="46" r="16" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
            <circle cx="32" cy="46" r="5" fill="#a855f7" />
            <circle cx="68" cy="46" r="16" fill="#09090b" stroke="#71717a" strokeWidth="1.5" />
            <circle cx="68" cy="46" r="5" fill="#a855f7" />
            {/* Backplate / Bracket */}
            <rect x="6" y="16" width="6" height="60" rx="1" fill="#94a3b8" />
            <text x="50" y="30" fontSize="5" fill="#e9d5ff" textAnchor="middle" fontWeight="bold">GPU 16GB</text>
          </svg>
        </div>
      );

    case 'ssd-hdd':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-blue-900/40 border border-blue-500/30 shadow-lg shadow-blue-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* M.2 NVMe PCB */}
            <rect x="12" y="32" width="76" height="36" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Gold connector pins */}
            <rect x="80" y="38" width="8" height="24" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            <circle cx="18" cy="50" r="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
            {/* Controller chip */}
            <rect x="58" y="40" width="16" height="18" rx="1" fill="#1e293b" stroke="#60a5fa" strokeWidth="0.8" />
            <text x="66" y="52" fontSize="4" fill="#93c5fd" textAnchor="middle">NVMe</text>
            {/* NAND Flash chips */}
            <rect x="26" y="38" width="14" height="22" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <rect x="42" y="38" width="14" height="22" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
            <text x="33" y="51" fontSize="3.5" fill="#cbd5e1" textAnchor="middle">NAND</text>
            <text x="49" y="51" fontSize="3.5" fill="#cbd5e1" textAnchor="middle">NAND</text>
          </svg>
        </div>
      );

    case 'guc-kaynagi':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-yellow-950/70 via-slate-900 to-yellow-900/40 border border-yellow-500/30 shadow-lg shadow-yellow-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* PSU Casing */}
            <rect x="12" y="18" width="76" height="64" rx="5" fill="#1c1917" stroke="#eab308" strokeWidth="1.5" />
            {/* Large Fan Grille */}
            <circle cx="50" cy="50" r="24" fill="#0c0a09" stroke="#78716c" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="8" fill="#eab308" />
            {/* Power Inlet & Switch */}
            <rect x="16" y="24" width="12" height="8" rx="1" fill="#000" stroke="#a8a29e" strokeWidth="0.5" />
            <rect x="72" y="24" width="8" height="6" rx="1" fill="#ef4444" />
            <text x="50" y="53" fontSize="4.5" fill="#000" textAnchor="middle" fontWeight="bold">750W</text>
            <text x="50" y="74" fontSize="4" fill="#fef08a" textAnchor="middle" fontWeight="bold">80 PLUS GOLD</text>
          </svg>
        </div>
      );

    case 'sogutma-sistemi':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-teal-950/70 via-slate-900 to-teal-900/40 border border-teal-500/30 shadow-lg shadow-teal-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Fan Frame */}
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
            {/* Circular Vent */}
            <circle cx="50" cy="50" r="30" fill="#042f2e" stroke="#2dd4bf" strokeWidth="1" />
            {/* Fan Blades */}
            <path d="M 50 50 Q 60 25 50 20 Q 40 25 50 50" fill="#0d9488" />
            <path d="M 50 50 Q 75 60 80 50 Q 75 40 50 50" fill="#0d9488" />
            <path d="M 50 50 Q 40 75 50 80 Q 60 75 50 50" fill="#0d9488" />
            <path d="M 50 50 Q 25 40 20 50 Q 25 60 50 50" fill="#0d9488" />
            <circle cx="50" cy="50" r="7" fill="#14b8a6" />
          </svg>
        </div>
      );

    case 'ses-ve-ag-karti':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-indigo-900/40 border border-indigo-500/30 shadow-lg shadow-indigo-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="18" y="22" width="64" height="48" rx="3" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <rect x="8" y="18" width="6" height="58" rx="1" fill="#94a3b8" />
            <rect x="30" y="70" width="35" height="6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            {/* Wi-Fi Antenna / Jack */}
            <line x1="10" y1="26" x2="2" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="36" x2="2" y2="20" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            {/* Audio Jacks */}
            <circle cx="11" cy="46" r="2.5" fill="#22c55e" />
            <circle cx="11" cy="54" r="2.5" fill="#3b82f6" />
            <circle cx="11" cy="62" r="2.5" fill="#ef4444" />
            <text x="50" y="48" fontSize="6" fill="#c7d2fe" textAnchor="middle" fontWeight="bold">Wi-Fi 7</text>
          </svg>
        </div>
      );

    // Dış Donanım
    case 'monitor':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-purple-900/40 border border-purple-500/30 shadow-lg shadow-purple-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Screen frame */}
            <rect x="10" y="14" width="80" height="54" rx="4" fill="#09090b" stroke="#a855f7" strokeWidth="1.5" />
            {/* Display area */}
            <rect x="14" y="18" width="72" height="46" rx="2" fill="#18181b" />
            <path d="M 20 54 L 38 32 L 52 44 L 66 26 L 80 54 Z" fill="#6b21a8" opacity="0.6" />
            <circle cx="68" cy="24" r="4" fill="#facc15" />
            {/* Stand */}
            <rect x="46" y="68" width="8" height="16" fill="#71717a" />
            <rect x="34" y="82" width="32" height="4" rx="2" fill="#a1a1aa" />
          </svg>
        </div>
      );

    case 'klavye':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border border-emerald-500/30 shadow-lg shadow-emerald-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="8" y="26" width="84" height="48" rx="4" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
            {/* Keys Grid */}
            {[0, 1, 2, 3].map(row => (
              <g key={row}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(col => (
                  <rect
                    key={col}
                    x={14 + col * 9}
                    y={32 + row * 9}
                    width="7"
                    height="6.5"
                    rx="1"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            ))}
            {/* Spacebar */}
            <rect x="32" y="60" width="36" height="8" rx="1.5" fill="#065f46" stroke="#10b981" strokeWidth="0.8" />
          </svg>
        </div>
      );

    case 'fare':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border border-emerald-500/30 shadow-lg shadow-emerald-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M 50 14 C 36 14 30 32 30 52 C 30 74 38 86 50 86 C 62 86 70 74 70 52 C 70 32 64 14 50 14 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            {/* Split */}
            <line x1="50" y1="14" x2="50" y2="44" stroke="#10b981" strokeWidth="1" />
            <path d="M 32 44 L 68 44" stroke="#334155" strokeWidth="1" />
            {/* Scroll wheel */}
            <rect x="47" y="24" width="6" height="14" rx="2" fill="#10b981" />
            <circle cx="50" cy="65" r="5" fill="#059669" opacity="0.4" />
          </svg>
        </div>
      );

    case 'yazici':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-purple-900/40 border border-purple-500/30 shadow-lg shadow-purple-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Paper top */}
            <rect x="30" y="14" width="40" height="20" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Main body */}
            <rect x="14" y="32" width="72" height="42" rx="4" fill="#18181b" stroke="#a855f7" strokeWidth="1.5" />
            {/* Paper tray out */}
            <rect x="26" y="60" width="48" height="24" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <line x1="32" y1="68" x2="68" y2="68" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="32" y1="74" x2="58" y2="74" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Indicator light */}
            <circle cx="76" cy="42" r="2.5" fill="#22c55e" />
          </svg>
        </div>
      );

    case 'tarayici':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-emerald-900/40 border border-emerald-500/30 shadow-lg shadow-emerald-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="12" y="24" width="76" height="52" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <rect x="20" y="32" width="60" height="36" rx="2" fill="#1e293b" stroke="#34d399" strokeWidth="0.8" />
            {/* Scanning light bar */}
            <line x1="45" y1="32" x2="45" y2="68" stroke="#00f2fe" strokeWidth="3" />
            <line x1="45" y1="32" x2="45" y2="68" stroke="#fff" strokeWidth="1" />
            <circle cx="78" cy="28" r="2" fill="#22c55e" />
          </svg>
        </div>
      );

    case 'hoparlor-kulaklik':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-purple-900/40 border border-purple-500/30 shadow-lg shadow-purple-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Headphone band */}
            <path d="M 24 55 A 28 28 0 0 1 76 55" fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
            {/* Left ear cup */}
            <rect x="16" y="50" width="12" height="24" rx="4" fill="#18181b" stroke="#c084fc" strokeWidth="1.5" />
            {/* Right ear cup */}
            <rect x="72" y="50" width="12" height="24" rx="4" fill="#18181b" stroke="#c084fc" strokeWidth="1.5" />
            {/* Sound waves */}
            <path d="M 88 56 Q 96 62 88 68" fill="none" stroke="#c084fc" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'portlar':
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-blue-900/40 border border-blue-500/30 shadow-lg shadow-blue-950/40 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Metal I/O Shield */}
            <rect x="12" y="16" width="76" height="68" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            {/* HDMI Port */}
            <path d="M 22 26 L 44 26 L 42 34 L 24 34 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
            <text x="33" y="32" fontSize="3" fill="#93c5fd" textAnchor="middle">HDMI</text>
            {/* USB-C Port */}
            <rect x="54" y="26" width="22" height="8" rx="4" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
            <text x="65" y="32" fontSize="3" fill="#93c5fd" textAnchor="middle">TYPE-C</text>
            {/* Dual USB-A */}
            <rect x="22" y="44" width="22" height="12" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <rect x="54" y="44" width="22" height="12" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            {/* RJ45 Ethernet */}
            <rect x="22" y="64" width="24" height="14" rx="2" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
            {/* Audio Jack */}
            <circle cx="65" cy="71" r="5" fill="#22c55e" stroke="#16a34a" strokeWidth="1" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="15" y="15" width="70" height="70" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M 40 50 L 50 40 L 60 50 L 50 60 Z" fill="#06b6d4" />
          </svg>
        </div>
      );
  }
}
