import React, { useEffect } from 'react';
import { Play, Sparkles, BookOpen, ShieldCheck, Target, Download, Brain, Award } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import { LEARNING_OBJECTIVES } from '../data/bmcData';

interface TitleScreenProps {
  onStart: () => void;
  onOpenCurriculumGuide: () => void;
  onOpenGlossary: () => void;
  onExportZip: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenCurriculumGuide,
  onOpenGlossary,
  onExportZip
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sounds.playJump();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const handleStartGame = () => {
    sounds.playJump();
    sounds.startBGM();
    onStart();
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-4 md:p-8 pointer-events-none select-none bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent overflow-y-auto">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between w-full gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/50 shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-black text-amber-300 tracking-wider uppercase">
            BAHAN AJAR GIM EDUKASI 3D (RASIO 16:9)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCurriculumGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 border border-blue-500/50 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Buka Capaian Pembelajaran & Silabus"
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Tujuan Belajar & Aturan</span>
          </button>

          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold shadow-lg transition-all cursor-pointer"
            title="Buka Glosarium 9 Blok BMC"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Glosarium</span>
          </button>

          <button
            onClick={onExportZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/50 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Unduh Paket Bahan Ajar Mandiri (.zip) Sesuai Kriteria Teknis"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Paket .zip</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece */}
      <div className="flex flex-col items-center text-center my-auto pointer-events-auto max-w-2xl mx-auto space-y-4 py-4">
        {/* Title Lockup SVG */}
        <div className="w-full max-w-md filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 600 150" className="w-full h-auto">
            <defs>
              <linearGradient id="titleGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.8" />
              </filter>
            </defs>

            <path
              d="M 30,25 L 570,25 L 540,75 L 570,125 L 30,125 L 60,75 Z"
              fill="#0F172A"
              stroke="#3B82F6"
              strokeWidth="4"
              opacity="0.95"
            />

            <text
              x="300"
              y="50"
              textAnchor="middle"
              fill="#FDE047"
              fontFamily="system-ui, sans-serif"
              fontWeight="900"
              fontSize="20"
              letterSpacing="6"
            >
              ★ SUPER SISWAPRENEUR 3D ★
            </text>

            <text
              x="300"
              y="105"
              textAnchor="middle"
              fill="url(#titleGold)"
              stroke="#78350F"
              strokeWidth="2"
              fontFamily="Impact, Arial Black, sans-serif"
              fontWeight="900"
              fontSize="48"
              letterSpacing="2"
              filter="url(#shadow)"
            >
              EKSPEDISI BMC
            </text>
          </svg>
        </div>

        {/* Explicit Learning Goal Banner */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 text-left text-xs max-w-xl shadow-xl">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Tujuan Pembelajaran Khusus (Capaian Pembelajaran PKK):</span>
          </div>
          <p className="text-slate-200 leading-relaxed text-[11px] md:text-xs">
            Menguasai <strong>9 Blok Business Model Canvas</strong> melalui tantangan eksplorasi 3 level kontekstual, melatih soft skills <strong>Problem Solving</strong>, <strong>Decision Making</strong>, dan <strong>Manajemen Waktu</strong> untuk kesiapan kerja di era industri.
          </p>
        </div>

        {/* Soft Skills Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-300">
          <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 flex items-center gap-1">
            <Brain className="w-3 h-3 text-emerald-400" />
            Problem Solving
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-400" />
            Decision Making
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            Manajemen Waktu
          </span>
        </div>

        {/* Primary Start CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleStartGame}
            className="group px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base md:text-lg rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer mx-auto"
          >
            <Play className="w-5 h-5 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>MULAI MISI PEMBELAJARAN</span>
          </button>
        </div>

        {/* Flat Control Hints */}
        <div className="text-[11px] font-semibold text-slate-400 tracking-wider">
          <span className="text-amber-400">D-Pad / Tombol Layar</span> Bergerak ·{' '}
          <span className="text-amber-400">Lompat</span> Melompat ·{' '}
          <span className="text-amber-400">Shift / Lari</span> Sprint
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pointer-events-auto border-t border-slate-800/60 pt-3">
        <div>Kurikulum Merdeka SMK · Mata Pelajaran Produk Kreatif & Kewirausahaan (PKK)</div>
        <div>Format SPA Rasio 16:9 · 100% Zero-External Redirects</div>
      </div>
    </div>
  );
};
