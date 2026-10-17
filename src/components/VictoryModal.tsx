import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Trophy, RotateCcw, Eye, CheckCircle2, Coins, Clock } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface VictoryModalProps {
  stats: PlayerStats;
  onOpenBMC: () => void;
  onRestart: () => void;
  onOpenReport?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onOpenBMC,
  onRestart,
  onOpenReport
}) => {
  useEffect(() => {
    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.3)] overflow-hidden flex flex-col text-white">
        {/* Certificate Golden Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-center relative">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-slate-950/15 border-2 border-slate-950/30 flex items-center justify-center text-slate-950">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="text-[11px] font-black tracking-widest uppercase">
            KELULUSAN EKSPEDISI KEWIRAUSAHAAN KELAS XI SMK
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            SELAMAT, WIRAUSAHAWAN MUDA!
          </h2>
          <p className="text-xs font-bold text-slate-900/90 mt-1">
            Kamu telah menuntaskan seluruh rintangan dan menguasai model bisnis nyata!
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5">
          {/* Grade Badge */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              PREDIKAT KELULUSAN
            </div>
            <div className="text-lg md:text-xl font-black text-amber-400">
              {stats.grade}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Siap memimpin rintisan usaha mandiri dan teaching factory sekolah!
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <Coins className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 uppercase font-bold">Modal Usaha</div>
              <div className="text-sm font-black text-white tabular-nums">
                {formatRupiah(stats.cash)}
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 uppercase font-bold">Blok BMC</div>
              <div className="text-sm font-black text-emerald-400 tabular-nums">
                {stats.unlockedBlocks.size} dari 9 Blok
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 col-span-2 sm:col-span-1">
              <Clock className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 uppercase font-bold">Waktu Tempuh</div>
              <div className="text-sm font-black text-white tabular-nums">
                {formatTime(stats.totalTimeElapsed)}
              </div>
            </div>
          </div>

          {/* Achievement Checklist */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-300 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kompetensi Teruji Siswa SMK:</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Kemampuan memvalidasi masalah nyata & Customer Segments</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Penciptaan Value Proposition inovatif berdaya saing</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Kalkulasi struktur biaya (HPP, BEP) & multi-revenue streams</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="w-full sm:w-1/3 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Rapor Kelulusan</span>
            </button>
          )}

          <button
            onClick={onOpenBMC}
            className="w-full sm:w-1/3 py-2.5 px-3 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Papan Kanvas</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-1/3 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
