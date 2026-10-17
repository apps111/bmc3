import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Award, Download, Info } from 'lucide-react';
import { BMC_BLOCKS } from '../data/bmcData';
import { BMCBlockKey } from '../types/game';

interface BMCBoardModalProps {
  unlockedBlocks: Set<BMCBlockKey>;
  onClose: () => void;
}

export const BMCBoardModal: React.FC<BMCBoardModalProps> = ({
  unlockedBlocks,
  onClose
}) => {
  const [activeBlockKey, setActiveBlockKey] = useState<BMCBlockKey>('customer_segments');

  const activeBlock = BMC_BLOCKS[activeBlockKey];
  const isSelectedUnlocked = unlockedBlocks.has(activeBlockKey);

  const renderBlockCard = (key: BMCBlockKey, label: string, rowSpanClass: string = '') => {
    const isUnlocked = unlockedBlocks.has(key);
    const data = BMC_BLOCKS[key];
    const isCurrentActive = activeBlockKey === key;

    return (
      <div
        onClick={() => setActiveBlockKey(key)}
        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${rowSpanClass} ${
          isCurrentActive
            ? 'ring-2 ring-white scale-[1.02] z-10'
            : 'hover:scale-[1.01]'
        } ${
          isUnlocked
            ? 'bg-slate-800/90 border-slate-600 shadow-lg'
            : 'bg-slate-900/60 border-slate-800 text-slate-500'
        }`}
        style={{
          borderTopColor: isUnlocked ? data.color : undefined,
          borderTopWidth: isUnlocked ? '4px' : undefined
        }}
      >
        <div className="flex items-start justify-between gap-1 mb-2">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {data.order}. {data.subtitle}
            </div>
            <div className={`text-xs md:text-sm font-black ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
              {label}
            </div>
          </div>
          {isUnlocked ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-slate-600 shrink-0" />
          )}
        </div>

        {isUnlocked ? (
          <p className="text-[11px] line-clamp-3 text-slate-300">
            {data.description}
          </p>
        ) : (
          <div className="text-[10px] text-slate-500 italic py-2">
            Belum terbuka. Cari Pos {data.order} di dunia 3D!
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
          <span className="font-semibold text-slate-400">Status:</span>
          <span className={`font-bold ${isUnlocked ? 'text-emerald-400' : 'text-amber-500/80'}`}>
            {isUnlocked ? 'Terbuka' : 'Terkunci'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                PAPAN STRATEGI WIRAUSAHA SMK
              </div>
              <h2 className="text-lg md:text-xl font-black text-white">
                The Business Model Canvas (9 Blok)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300">
              Terbuka: <span className="text-emerald-400 font-black">{unlockedBlocks.size}</span>/9
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 9 Blocks Interactive Grid Layout */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Official 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Col 1: Key Partners */}
            <div className="flex flex-col gap-3">
              {renderBlockCard('key_partnerships', 'Key Partnerships', 'h-full min-h-[200px]')}
            </div>

            {/* Col 2: Key Activities & Key Resources */}
            <div className="flex flex-col gap-3">
              {renderBlockCard('key_activities', 'Key Activities', 'min-h-[120px]')}
              {renderBlockCard('key_resources', 'Key Resources', 'min-h-[120px]')}
            </div>

            {/* Col 3: Value Propositions */}
            <div className="flex flex-col gap-3">
              {renderBlockCard('value_propositions', 'Value Propositions', 'h-full min-h-[200px]')}
            </div>

            {/* Col 4: Customer Relationships & Channels */}
            <div className="flex flex-col gap-3">
              {renderBlockCard('customer_relationships', 'Customer Relationships', 'min-h-[120px]')}
              {renderBlockCard('channels', 'Channels', 'min-h-[120px]')}
            </div>

            {/* Col 5: Customer Segments */}
            <div className="flex flex-col gap-3">
              {renderBlockCard('customer_segments', 'Customer Segments', 'h-full min-h-[200px]')}
            </div>
          </div>

          {/* Bottom Row: Cost Structure & Revenue Streams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderBlockCard('cost_structure', 'Cost Structure', 'min-h-[110px]')}
            {renderBlockCard('revenue_streams', 'Revenue Streams', 'min-h-[110px]')}
          </div>

          {/* Detail Panel of Selected Block */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 md:p-5 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: activeBlock.color }}
                />
                <h3 className="font-black text-white text-base">
                  {activeBlock.order}. {activeBlock.title} ({activeBlock.subtitle})
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isSelectedUnlocked
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {isSelectedUnlocked ? '✓ Sudah Dikuasai' : 'Belum Selesai'}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {activeBlock.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Pertanyaan Kunci Model Bisnis:</span>
                </div>
                <div className="text-slate-200 italic">
                  "{activeBlock.keyQuestion}"
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                <div className="font-bold text-sky-400 mb-1">
                  Penerapan Riil Siswa SMK:
                </div>
                <div className="text-slate-300">
                  {activeBlock.smkExample}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Klik blok di atas untuk mempelajari detail dan contoh riilnya.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg"
          >
            Tutup & Lanjut Main
          </button>
        </div>
      </div>
    </div>
  );
};
