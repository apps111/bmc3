import React from 'react';
import { X, Award, CheckCircle2, Printer, Download, Sparkles, TrendingUp, Clock, Brain, UserCheck } from 'lucide-react';
import { PlayerStats, BMCBlockKey } from '../types/game';
import { BMC_BLOCKS } from '../data/bmcData';

interface ReportModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ stats, onClose }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const blocksCount = stats.unlockedBlocks.size;
  // Calculate academic score (0 - 100)
  const baseScore = Math.round((blocksCount / 9) * 80);
  const accuracyBonus = stats.totalAnswerAttempts > 0
    ? Math.round((stats.correctAnswersCount / stats.totalAnswerAttempts) * 15)
    : 15;
  const timeBonus = stats.timeRemaining > 30 ? 5 : 2;
  const finalNumericScore = Math.min(100, baseScore + accuracyBonus + timeBonus);

  const handlePrint = () => {
    window.print();
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Printable Certificate/Report Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                RAPOR KOMPETENSI KEWIRAUSAHAAN KELAS XI SMK
              </div>
              <h2 className="text-lg md:text-xl font-black">
                Laporan Hasil Belajar Model Bisnis Kanvas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Rapor Hasil Belajar"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rapor</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs md:text-sm">
          {/* Student Profile Card */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Status Siswa:</div>
              <div className="text-base font-black text-white">Siswa Wirausaha Mandiri SMK (Kelas XI)</div>
              <div className="text-xs text-slate-300 mt-0.5">Program Keahlian: Teaching Factory & Kewirausahaan</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">NILAI AKHIR</div>
                <div className="text-2xl font-black text-emerald-400 tabular-nums">{finalNumericScore}</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2 text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">PREDIKAT</div>
                <div className="text-sm font-black text-amber-400">{stats.grade.split(':')[0]}</div>
              </div>
            </div>
          </div>

          {/* 9 Blocks Mastery Checklist */}
          <div className="space-y-2">
            <div className="font-bold text-blue-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Penguasaan 9 Elemen Business Model Canvas:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {allBlockKeys.map((key) => {
                const isUnlocked = stats.unlockedBlocks.has(key);
                const block = BMC_BLOCKS[key];
                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isUnlocked
                        ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="font-bold text-xs truncate mr-1">
                      {block.order}. {block.title}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase shrink-0">
                      {isUnlocked ? '✓ Teruji' : 'Belum'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soft Skills Assessment Radar Metrics */}
          <div className="space-y-2 pt-1">
            <div className="font-bold text-purple-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              <span>Asesmen Soft Skills Kesiapan Kerja:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-slate-300">Pemecahan Masalah (Problem Solving)</span>
                  <span className="text-emerald-400 font-black">{Math.min(100, 75 + blocksCount * 2.5)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, 75 + blocksCount * 2.5)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">Kemampuan membedah kasus riil pasar & mencari alternatif solusi.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-slate-300">Pengambilan Keputusan (Decision Making)</span>
                  <span className="text-blue-400 font-black">{Math.min(100, 70 + blocksCount * 3)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, 70 + blocksCount * 3)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">Ketepatan memilih strategi nilai dan segmentasi konsumen.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-slate-300">Manajemen Waktu (Time Management)</span>
                  <span className="text-amber-400 font-black">{Math.min(100, Math.round((stats.timeRemaining / 180) * 100))}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((stats.timeRemaining / 180) * 100))}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">Ketepatan menuntaskan misi target waktu per level.</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span className="text-slate-300">Akumulasi Modal Usaha (Finansial)</span>
                  <span className="text-teal-400 font-black">{formatRupiah(stats.cash)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.cash / 500000) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400">Kemampuan mengumpulkan aset modal dan efisiensi biaya.</p>
              </div>
            </div>
          </div>

          {/* Teacher / Assessor Feedback Note */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1">
            <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Rekomendasi Tindak Lanjut Guru Pembimbing:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Peserta didik telah menunjukkan pemahaman konsep Business Model Canvas secara aplikatif. Disarankan untuk segera menyusun prototipe proposal bisnis nyata pada unit Teaching Factory (TeFa) sekolah dan melakukan uji pasar (*Customer Validation*) langsung kepada konsumen.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg"
          >
            Tutup Rapor
          </button>
        </div>
      </div>
    </div>
  );
};
