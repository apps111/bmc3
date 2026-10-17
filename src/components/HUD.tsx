import React from 'react';
import { Heart, Coins, Award, Clock, Zap } from 'lucide-react';
import { PlayerStats, BMCBlockKey } from '../types/game';
import { BMC_BLOCKS, LEVEL_CONFIGS } from '../data/bmcData';

interface HUDProps {
  stats: PlayerStats;
  onOpenBMC: () => void;
}

export const HUD: React.FC<HUDProps> = ({ stats, onOpenBMC }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatCountdown = (secs: number) => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`;
  };

  const isLowTime = stats.timeRemaining < 30;
  const currentLvlConfig = LEVEL_CONFIGS[stats.currentLevel];

  const allBlockKeys: BMCBlockKey[] = [
    'customer_segments',
    'value_propositions',
    'channels',
    'customer_relationships',
    'key_activities',
    'key_resources',
    'key_partnerships',
    'cost_structure',
    'revenue_streams'
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex flex-col justify-between p-3 md:p-6">
      {/* Top Status Perimeter */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Modal Usaha & Health */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Level Indicator Pill */}
          <div
            className="px-3 py-1 rounded-xl font-black text-xs text-white border shadow-lg flex items-center gap-1.5 w-fit"
            style={{ backgroundColor: currentLvlConfig.themeColor + 'CC', borderColor: currentLvlConfig.themeColor }}
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>LEVEL {stats.currentLevel} / 3: {currentLvlConfig.title.split(':')[1]?.trim() || 'FONDASI'}</span>
          </div>

          {/* Modal Usaha / Cash */}
          <div className="bg-slate-900/90 border-2 border-amber-400/80 rounded-2xl px-3.5 py-2 shadow-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-amber-300">MODAL USAHA SISWA</div>
              <div className="text-lg md:text-xl font-black text-white tabular-nums tracking-tight">
                {formatRupiah(stats.cash)}
              </div>
            </div>
          </div>

          {/* Health & Coins */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900/85 border border-slate-700/80 rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-md">
              <span className="text-[10px] font-bold text-slate-300 mr-1">SEMANGAT:</span>
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-4 h-4 transition-transform duration-300 ${
                    heart <= stats.health
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-slate-600 fill-slate-800 scale-90'
                  }`}
                />
              ))}
            </div>

            <div className="bg-slate-900/85 border border-slate-700/80 rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-md">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-[9px] font-black text-amber-950">
                ★
              </div>
              <span className="text-xs font-black text-amber-300 tabular-nums">
                x{stats.coinsCollected}
              </span>
            </div>
          </div>
        </div>

        {/* Top-Center: BMC Mission Pathway & 9 Blocks Tracker */}
        <div className="hidden md:flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* 16:9 Standard Indicator Badge */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-500/40 rounded-full px-3 py-0.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase">
              RASIO 16:9 STANDAR BAHAN AJAR SMK
            </span>
          </div>

          {/* Current Level Missions Pathway */}
          <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl px-3.5 py-1.5 shadow-xl flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-300">ALUR MISI:</span>
            {currentLvlConfig.blocks.map((blockKey, idx) => {
              const isUnlocked = stats.unlockedBlocks.has(blockKey);
              const block = BMC_BLOCKS[blockKey];
              return (
                <div
                  key={blockKey}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black transition-all ${
                    isUnlocked
                      ? 'bg-emerald-600/90 text-white border border-emerald-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                    isUnlocked ? 'bg-white text-emerald-700 font-black' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isUnlocked ? '✓' : idx + 1}
                  </span>
                  <span className="max-w-[110px] truncate">{block.title}</span>
                </div>
              );
            })}
          </div>

          {/* 9 Blocks Full Overview Button */}
          <button
            onClick={onOpenBMC}
            className="text-[10px] font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Lihat Seluruh 9 Blok Canvas ({stats.unlockedBlocks.size}/9) [Tekan C]</span>
          </button>
        </div>

        {/* Top-Right: Countdown Timer & SMK Badge */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Prominent Countdown Timer */}
          <div
            className={`border-2 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-xl transition-all ${
              isLowTime
                ? 'bg-rose-950/95 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900/90 border-slate-700 text-white'
            }`}
          >
            <Clock className={`w-5 h-5 ${isLowTime ? 'text-rose-400' : 'text-amber-400'}`} />
            <div>
              <div className="text-[9px] font-bold tracking-wider uppercase text-slate-400">SISA WAKTU LEVEL</div>
              <div className="text-lg md:text-xl font-black tabular-nums tracking-wider">
                {formatCountdown(stats.timeRemaining)}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 border border-blue-400/50 rounded-xl px-3 py-1 shadow-md text-right">
            <div className="text-[9px] font-bold text-blue-200">PRODUK KREATIF & KEWIRAUSAHAAN</div>
            <div className="text-xs font-black text-white">KELAS XI SMK</div>
          </div>
        </div>
      </div>

      {/* Mobile Center BMC Trigger */}
      <div className="lg:hidden flex justify-center pointer-events-auto">
        <button
          onClick={onOpenBMC}
          className="bg-slate-900/90 border border-blue-400 text-white rounded-xl px-3.5 py-1 text-xs font-bold shadow-lg flex items-center gap-1.5"
        >
          <Award className="w-4 h-4 text-blue-400" />
          <span>Buka Kanvas BMC ({stats.unlockedBlocks.size}/9)</span>
        </button>
      </div>
    </div>
  );
};
