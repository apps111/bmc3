import React from 'react';
import { ArrowRight, Trophy, Eye, CheckCircle2, Zap } from 'lucide-react';
import { LEVEL_CONFIGS } from '../data/bmcData';
import { PlayerStats } from '../types/game';

interface LevelCompleteModalProps {
  completedLevel: 1 | 2 | 3;
  nextLevel: 2 | 3;
  stats: PlayerStats;
  onContinue: () => void;
  onOpenBMC: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  completedLevel,
  nextLevel,
  stats,
  onContinue,
  onOpenBMC
}) => {
  const currentConfig = LEVEL_CONFIGS[completedLevel];
  const nextConfig = LEVEL_CONFIGS[nextLevel];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-center">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <div className="text-[10px] font-black tracking-widest uppercase text-emerald-200">
            TAHAP PEMBELAJARAN BERHASIL DILALUI!
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            LEVEL {completedLevel} SELESAI!
          </h2>
          <p className="text-xs font-semibold text-emerald-100 mt-1">
            {currentConfig.title}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Akumulasi Modal Usaha</div>
              <div className="text-xl font-black text-amber-400">{formatRupiah(stats.cash)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase text-right">Blok Terbuka</div>
              <div className="text-xl font-black text-emerald-400 text-right">{stats.unlockedBlocks.size} / 9 Blok</div>
            </div>
          </div>

          {/* Next Level Teaser */}
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Tantangan Selanjutnya: Level {nextLevel}</span>
            </div>
            <div className="font-bold text-white text-sm">
              {nextConfig.title}
            </div>
            <div className="text-xs text-slate-300">
              {nextConfig.subtitle} (Batas waktu: {nextConfig.timeLimit} detik)
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onOpenBMC}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Lihat Kanvas BMC</span>
          </button>

          <button
            onClick={onContinue}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Mulai Level {nextLevel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
