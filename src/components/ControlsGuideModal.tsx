import React from 'react';
import { X, Gamepad2, Move, ArrowUp, MousePointer, Shield } from 'lucide-react';

interface ControlsGuideModalProps {
  onClose: () => void;
}

export const ControlsGuideModal: React.FC<ControlsGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                PETUNJUK GIM 3D
              </div>
              <h2 className="text-lg font-black text-white">
                Kontrol & Mekanisme Mario
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Move className="w-4 h-4" />
                <span>Berjalan & Berlari</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Gunakan tombol <strong>W, A, S, D</strong> atau <strong>Tombol Panah</strong>. Tahan <strong>Shift</strong> untuk sprint kencang!
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <ArrowUp className="w-4 h-4" />
                <span>Melompat (Jump)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Tekan <strong>Spasi</strong> untuk melompat tinggi melompati rintangan dan menyundul balok tanya [?].
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <MousePointer className="w-4 h-4" />
                <span>Rotasi Kamera</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Klik dan seret (drag) mouse di layar untuk memutar sudut pandang kamera 3D.
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <Shield className="w-4 h-4" />
                <span>Injak Musuh (Stomp)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Lompat dan injak bagian atas monster hambatan dari atas untuk melumpuhkannya dan dapat modal ekstra!
              </p>
            </div>
          </div>

          <div className="bg-blue-950/40 border border-blue-800/60 p-3.5 rounded-2xl">
            <div className="font-bold text-blue-300 mb-1">
              Tombol Pintasan Cepat:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-slate-300">
              <div>• <strong>[C]</strong>: Buka Kanvas BMC</div>
              <div>• <strong>[G]</strong>: Glosarium Teori</div>
              <div>• <strong>[R]</strong>: Reset Kamera</div>
              <div>• <strong>[H]</strong>: Buka/Tutup Dock</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Mengerti, Lanjut Bermain
          </button>
        </div>
      </div>
    </div>
  );
};
