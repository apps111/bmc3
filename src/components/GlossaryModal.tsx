import React, { useState } from 'react';
import { X, BookOpen, Search, Lightbulb } from 'lucide-react';
import { BMC_GLOSSARY, BMC_BLOCKS } from '../data/bmcData';

interface GlossaryModalProps {
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGlossary = BMC_GLOSSARY.filter(item =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                MODUL TEORI KEWIRAUSAHAAN KELAS XI
              </div>
              <h2 className="text-lg md:text-xl font-black text-white">
                Glosarium & Intisari Model Bisnis
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

        {/* Search Input */}
        <div className="p-4 bg-slate-850 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah BMC (contoh: Value Proposition, BEP, TeFa)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Scrollable Terms List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-slate-200">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              <div className="font-bold text-emerald-400 text-sm mb-1">
                {item.term}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}

          {/* Quick tip box */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 mt-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed">
              <strong>Kunci Sukses Wirausaha SMK:</strong> Model bisnis bukanlah dokumen statis sekali jadi, melainkan hipotesis yang terus diuji, diperbaiki, dan diselaraskan dengan kebutuhan nyata konsumen (Customer Discovery).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Tutup Glosarium
          </button>
        </div>
      </div>
    </div>
  );
};
