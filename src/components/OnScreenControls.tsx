import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, RotateCcw, RotateCw } from 'lucide-react';

interface OnScreenControlsProps {
  onMoveChange: (x: number, z: number) => void;
  onJumpPress: () => void;
  onSprintToggle: (sprint: boolean) => void;
  onRotateCamera: (delta: number) => void;
  isSprinting: boolean;
}

export const OnScreenControls: React.FC<OnScreenControlsProps> = ({
  onMoveChange,
  onJumpPress,
  onSprintToggle,
  onRotateCamera,
  isSprinting
}) => {
  const handleDir = (dx: number, dz: number) => {
    onMoveChange(dx, dz);
  };

  const handleRelease = () => {
    onMoveChange(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex justify-between items-end p-3 md:p-6 pb-20 md:pb-24">
      {/* Bottom-Left: Virtual D-Pad & Camera Controls */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        {/* Camera Yaw Rotation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRotateCamera(0.4)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-lg text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="Putar Kamera ke Kiri"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Kamera ◄</span>
          </button>
          <button
            onClick={() => onRotateCamera(-0.4)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-lg text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="Putar Kamera ke Kanan"
          >
            <span>Kamera ►</span>
            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>

        {/* Directional Pad */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-2 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-sm">
          <div />
          <button
            onTouchStart={() => handleDir(0, -1)}
            onTouchEnd={handleRelease}
            onMouseDown={() => handleDir(0, -1)}
            onMouseUp={handleRelease}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-500 text-white flex flex-col items-center justify-center border border-slate-600 active:scale-95 transition-all cursor-pointer shadow-md"
            title="Maju (W / Panah Atas)"
          >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[8px] font-bold text-slate-400">MAJU</span>
          </button>
          <div />

          <button
            onTouchStart={() => handleDir(-1, 0)}
            onTouchEnd={handleRelease}
            onMouseDown={() => handleDir(-1, 0)}
            onMouseUp={handleRelease}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-500 text-white flex flex-col items-center justify-center border border-slate-600 active:scale-95 transition-all cursor-pointer shadow-md"
            title="Kiri (A / Panah Kiri)"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[8px] font-bold text-slate-400">KIRI</span>
          </button>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-950/40 flex items-center justify-center text-[10px] font-black text-slate-500">
            ARAH
          </div>
          <button
            onTouchStart={() => handleDir(1, 0)}
            onTouchEnd={handleRelease}
            onMouseDown={() => handleDir(1, 0)}
            onMouseUp={handleRelease}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-500 text-white flex flex-col items-center justify-center border border-slate-600 active:scale-95 transition-all cursor-pointer shadow-md"
            title="Kanan (D / Panah Kanan)"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[8px] font-bold text-slate-400">KANAN</span>
          </button>

          <div />
          <button
            onTouchStart={() => handleDir(0, 1)}
            onTouchEnd={handleRelease}
            onMouseDown={() => handleDir(0, 1)}
            onMouseUp={handleRelease}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-500 text-white flex flex-col items-center justify-center border border-slate-600 active:scale-95 transition-all cursor-pointer shadow-md"
            title="Mundur (S / Panah Bawah)"
          >
            <ArrowDown className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[8px] font-bold text-slate-400">MUNDUR</span>
          </button>
          <div />
        </div>
      </div>

      {/* Bottom-Right: Action Buttons (Lari Cepat & Lompat) */}
      <div className="pointer-events-auto flex items-end gap-3 md:gap-4">
        {/* Sprint Button Toggle */}
        <button
          onClick={() => onSprintToggle(!isSprinting)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border shadow-xl active:scale-95 transition-all cursor-pointer ${
            isSprinting
              ? 'bg-amber-500 border-amber-300 text-slate-950 font-black scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
          title="Tombol Lari Cepat (Shift)"
        >
          <Zap className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-[9px] font-bold">LARI</span>
        </button>

        {/* Mario Jump Button */}
        <button
          onTouchStart={onJumpPress}
          onMouseDown={onJumpPress}
          className="w-18 h-18 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:from-yellow-300 active:to-amber-500 border-2 border-yellow-200 text-slate-950 font-black flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer"
          title="Tombol Melompat (Spasi)"
        >
          <ArrowUp className="w-8 h-8 md:w-9 md:h-9 stroke-[3]" />
          <span className="text-[10px] md:text-xs font-black tracking-wider">LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
