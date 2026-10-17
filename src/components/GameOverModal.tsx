import React from 'react';
import { RotateCcw, Clock, HeartCrack, Lightbulb } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface GameOverModalProps {
  reason: 'health' | 'timeout';
  onRestartLevel: () => void;
  onRestartEntireGame: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  onRestartLevel,
  onRestartEntireGame
}) => {
  const isTimeout = reason === 'timeout';

  const handleRetry = () => {
    sounds.playJump();
    onRestartLevel();
  };

  const handleRestartAll = () => {
    sounds.playJump();
    onRestartEntireGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500 rounded-3xl shadow-2xl p-6 text-center text-white space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500">
          {isTimeout ? <Clock className="w-9 h-9" /> : <HeartCrack className="w-9 h-9" />}
        </div>

        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-rose-400">
            {isTimeout ? 'BATAS WAKTU LEVEL HABIS' : 'SEMANGAT USAHA MENIPIS'}
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            {isTimeout ? 'Waktu Habis, Jangan Putus Asa!' : 'Gagal Adalah Proses Belajar!'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            {isTimeout
              ? 'Dalam wirausaha nyata, batas waktu (deadline) proyek sangat krusial. Setiap kali kamu menjawab benar pada balok tantangan, kamu akan mendapatkan bonus waktu!'
              : 'Wirausahawan sejati tidak pernah takut jatuh. Yang membedakan wirausahawan sukses adalah kemampuannya untuk bangkit dan mengevaluasi kesalahan!'}
          </p>
        </div>

        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 text-left space-y-1.5">
          <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span>Strategi Sukses Menaklukkan Level:</span>
          </div>
          <p>• Selesaikan Pos Balok [?] untuk mendapatkan <strong>+15s hingga +25s bonus waktu</strong>.</p>
          <p>• Injak kepala monster dari atas (Stomp) untuk melumpuhkannya dan mendapatkan koin tambahan.</p>
          <p>• Gunakan tombol LARI (Shift) untuk bergerak lebih cepat.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Level Ini</span>
          </button>

          <button
            onClick={handleRestartAll}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Mulai dari Level 1 (Reset Total)
          </button>
        </div>
      </div>
    </div>
  );
};
