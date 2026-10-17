import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, BookOpen, RotateCcw, HelpCircle, ChevronDown, ChevronUp, Download, Gamepad2, Award, Archive } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface BottomDockProps {
  onOpenBMC: () => void;
  onOpenGlossary: () => void;
  onOpenControlsGuide: () => void;
  onResetCamera: () => void;
  onDownloadHTML: () => void;
  showOnScreenControls: boolean;
  onToggleOnScreenControls: () => void;
  onOpenReport?: () => void;
  onExportZip?: () => void;
  is16x9Locked?: boolean;
  onToggle16x9?: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  onOpenBMC,
  onOpenGlossary,
  onOpenControlsGuide,
  onResetCamera,
  onDownloadHTML,
  showOnScreenControls,
  onToggleOnScreenControls,
  onOpenReport,
  onExportZip,
  is16x9Locked = true,
  onToggle16x9
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto transition-transform duration-300">
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-1 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold rounded-full border border-slate-700/80 shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
        title="Buka / Tutup Bilah Menu"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3 h-3 text-amber-400" />
            <span>Menu Gim</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span>Sembunyikan Bilah</span>
          </>
        )}
      </button>

      {/* Dock Container */}
      {!isCollapsed && (
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl px-2.5 py-1.5 shadow-2xl flex items-center gap-1.5 md:gap-2 max-w-[96vw] overflow-x-auto no-scrollbar">
          {/* BMC Canvas Button */}
          <button
            onClick={onOpenBMC}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Buka Papan Kanvas BMC [C]"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Kanvas BMC [C]</span>
          </button>

          {/* Toggle On-Screen Controls */}
          <button
            onClick={onToggleOnScreenControls}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              showOnScreenControls
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
            }`}
            title="Tampilkan / Sembunyikan Tombol Layar"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tombol Layar</span>
          </button>

          {/* 16:9 Aspect Ratio Lock Toggle */}
          {onToggle16x9 && (
            <button
              onClick={onToggle16x9}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                is16x9Locked
                  ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-400'
              }`}
              title="Kunci Rasio Layar 16:9 Standar Pembelajaran SMK"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>16:9</span>
            </button>
          )}

          {/* Glossary Theory Button */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Glosarium & Teori [G]"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Materi BMC</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={onResetCamera}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Reset Sudut Kamera [R]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              isMuted
                ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
            }`}
            title="Suara Musik & Efek"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Controls Guide */}
          <button
            onClick={onOpenControlsGuide}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 text-xs font-medium transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Panduan Kontrol"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Standalone GitHub HTML Download Button */}
          <button
            onClick={onDownloadHTML}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/50 text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Download Gim dalam 1 File HTML (Siap Repo ke GitHub / GitHub Pages)"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">File HTML</span>
          </button>

          {/* Export Zip Package Button */}
          {onExportZip && (
            <button
              onClick={onExportZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-400/50 text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Unduh Paket Bahan Ajar Lengkap .zip (index.html + panduan, < 25MB)"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              <span>Paket .zip</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
