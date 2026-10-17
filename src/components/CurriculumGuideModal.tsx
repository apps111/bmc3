import React, { useState } from 'react';
import { X, Target, BookOpen, ShieldCheck, Zap, Award, CheckCircle2, Trophy } from 'lucide-react';
import { LEARNING_OBJECTIVES, LEVEL_CONFIGS } from '../data/bmcData';

interface CurriculumGuideModalProps {
  onClose: () => void;
}

export const CurriculumGuideModal: React.FC<CurriculumGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'tujuan' | 'aturan' | 'misi' | 'rubrik'>('tujuan');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-blue-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                PANDUAN PEDAGOGIK & KURIKULUM SMK
              </div>
              <h2 className="text-lg md:text-xl font-black">
                Pedoman Pembelajaran & Aturan Main Gim
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('tujuan')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tujuan'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Tujuan & Soft Skills
          </button>
          <button
            onClick={() => setActiveTab('aturan')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'aturan'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Aturan & Tantangan
          </button>
          <button
            onClick={() => setActiveTab('misi')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'misi'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Pathway 3 Level Misi
          </button>
          <button
            onClick={() => setActiveTab('rubrik')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'rubrik'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Rubrik Penilaian
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-200 text-xs md:text-sm">
          {/* TAB 1: TUJUAN & SOFT SKILLS */}
          {activeTab === 'tujuan' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Capaian Pembelajaran (CP) Resmi:</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {LEARNING_OBJECTIVES.capaianPembelajaran}
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Mata Pelajaran: <strong>{LEARNING_OBJECTIVES.mataPelajaran}</strong> ({LEARNING_OBJECTIVES.jenjang})
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-blue-400 uppercase tracking-wider text-xs">
                  Alur Tujuan Pembelajaran (ATP) 3 Level:
                </div>
                {LEARNING_OBJECTIVES.alurTujuanPembelajaran.map((atp, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{atp}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-purple-400 uppercase tracking-wider text-xs">
                  Soft Skills Dunia Kerja yang Dilatih:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {LEARNING_OBJECTIVES.softSkills.map((sk, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <div className="font-bold text-white mb-1">{sk.name}</div>
                      <div className="text-slate-300 text-xs">{sk.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ATURAN & MEKANIKA */}
          {activeTab === 'aturan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1.5">
                  <div className="font-bold text-rose-400 flex items-center gap-2">
                    <span>❤️ Sistem Semangat (3 Nyawa)</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Pemain memulai dengan 3 Nyawa Semangat. Menabrak monster hambatan dari samping mengurangi 1 hati. Melompat dan menginjak kepala monster (Stomp) melumpuhkan musuh dan memberi koin bonus!
                  </p>
                </div>

                <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-2">
                    <span>⏳ Manajemen Batas Waktu</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Tiap level dibatasi waktu countdown (150-180 detik). Menjawab benar pada balok tantangan memberikan <strong>bonus waktu +15s hingga +25s</strong>. Jika waktu habis, level harus diulang!
                  </p>
                </div>

                <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1.5">
                  <div className="font-bold text-blue-400 flex items-center gap-2">
                    <span>📦 Balok Tanya [?] & Kios BMC</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Lompat dan sundul balok emas [?] dari bawah untuk membuka soal studi kasus nyata. Selesaikan soal untuk membuka stempel blok resmi pada Kanvas BMC.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center gap-2">
                    <span>💰 Modal Usaha Siswa (Skor)</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Kumpulkan koin emas di sepanjang jalan dan menangkan hadiah uang modal usaha (Rp) setiap memecahkan tantangan studi kasus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PATHWAY 3 LEVEL */}
          {activeTab === 'misi' && (
            <div className="space-y-3">
              {[1, 2, 3].map((lvlNum) => {
                const conf = LEVEL_CONFIGS[lvlNum as 1 | 2 | 3];
                return (
                  <div key={lvlNum} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-white text-base">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{conf.title}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-[10px] font-bold text-slate-300">
                        Batas: {conf.timeLimit} Detik
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Latar:</strong> {conf.subtitle}
                    </p>
                    <p className="text-xs text-amber-300 font-semibold">
                      <strong>Tujuan Misi:</strong> {conf.missionGoal}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Blok yang Harus Dikuasai:</span>
                      {conf.blocks.map((b, i) => (
                        <span key={b} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-bold text-blue-300">
                          {b.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: RUBRIK PENILAIAN */}
          {activeTab === 'rubrik' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-700">
                <div className="font-bold text-white mb-1">Skala Predikat Kelulusan Wirausahawan:</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-700/60 pb-1">
                    <span className="font-bold text-emerald-400">9 Blok BMC Terbuka:</span>
                    <span>Master Entrepreneur Unicorn (Nilai A / Sempurna)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/60 pb-1">
                    <span className="font-bold text-blue-400">7 - 8 Blok Terbuka:</span>
                    <span>Wirausahawan Berdaya Saing Tinggi (Nilai B+)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/60 pb-1">
                    <span className="font-bold text-amber-400">4 - 6 Blok Terbuka:</span>
                    <span>Wirausahawan Berkembang (Nilai B)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400">Di bawah 4 Blok:</span>
                    <span>Wirausahawan Pemula / Butuh Remedial (Nilai C)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
          >
            Mengerti & Siap Berpetualang
          </button>
        </div>
      </div>
    </div>
  );
};
