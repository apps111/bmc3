import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface MobileControlsProps {
  onMoveChange: (x: number, z: number) => void;
  onJumpPress: () => void;
  onSprintToggle: (sprint: boolean) => void;
  isSprinting: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveChange,
  onJumpPress,
  onSprintToggle,
  isSprinting
}) => {
  // Mobile D-Pad touch handlers
  const handleDir = (dx: number, dz: number) => {
    onMoveChange(dx, dz);
  };

  const handleRelease = () => {
    onMoveChange(0, 0);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex justify-between items-end p-4 pb-20 sm:hidden">
      {/* Left: D-Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1 bg-slate-900/60 p-2 rounded-3xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
        <div />
        <button
          onTouchStart={() => handleDir(0, -1)}
          onTouchEnd={handleRelease}
          onMouseDown={() => handleDir(0, -1)}
          onMouseUp={handleRelease}
          className="w-12 h-12 rounded-2xl bg-slate-800/80 active:bg-amber-500 text-white flex items-center justify-center border border-slate-600 active:scale-95 transition-all"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onTouchStart={() => handleDir(-1, 0)}
          onTouchEnd={handleRelease}
          onMouseDown={() => handleDir(-1, 0)}
          onMouseUp={handleRelease}
          className="w-12 h-12 rounded-2xl bg-slate-800/80 active:bg-amber-500 text-white flex items-center justify-center border border-slate-600 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-slate-900/40 flex items-center justify-center text-[10px] font-bold text-slate-500">
          DPAD
        </div>
        <button
          onTouchStart={() => handleDir(1, 0)}
          onTouchEnd={handleRelease}
          onMouseDown={() => handleDir(1, 0)}
          onMouseUp={handleRelease}
          className="w-12 h-12 rounded-2xl bg-slate-800/80 active:bg-amber-500 text-white flex items-center justify-center border border-slate-600 active:scale-95 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <div />
        <button
          onTouchStart={() => handleDir(0, 1)}
          onTouchEnd={handleRelease}
          onMouseDown={() => handleDir(0, 1)}
          onMouseUp={handleRelease}
          className="w-12 h-12 rounded-2xl bg-slate-800/80 active:bg-amber-500 text-white flex items-center justify-center border border-slate-600 active:scale-95 transition-all"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {/* Right: Action Buttons (Jump & Sprint) */}
      <div className="pointer-events-auto flex items-end gap-3">
        {/* Sprint Button */}
        <button
          onClick={() => onSprintToggle(!isSprinting)}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border shadow-xl active:scale-95 transition-all cursor-pointer ${
            isSprinting
              ? 'bg-amber-500 border-amber-300 text-slate-950 font-black'
              : 'bg-slate-800/80 border-slate-600 text-slate-300'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] font-bold">LARI</span>
        </button>

        {/* Mario Jump Button */}
        <button
          onTouchStart={onJumpPress}
          onMouseDown={onJumpPress}
          className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 active:from-yellow-300 active:to-amber-500 border-2 border-yellow-200 text-slate-950 font-black flex flex-col items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer"
        >
          <ArrowUp className="w-7 h-7 stroke-[3]" />
          <span className="text-[10px] font-black tracking-wider">LOMPAT</span>
        </button>
      </div>
    </div>
  );
};
