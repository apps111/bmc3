import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Lightbulb, Coins, Clock, Link2, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { QuestionData, OrderingStep } from '../types/game';
import { BMC_BLOCKS } from '../data/bmcData';

interface QuestionModalProps {
  question: QuestionData;
  questionIndex: number;
  onSolve: (isCorrect: boolean, reward: number, timeBonus: number) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  questionIndex,
  onSolve,
  onClose
}) => {
  // State for multiple choice
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // State for true / false
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);

  // State for matching
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);

  // State for ordering
  const [orderedSteps, setOrderedSteps] = useState<OrderingStep[]>(() => {
    return question.orderingSteps ? [...question.orderingSteps] : [];
  });

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);

  const blockInfo = BMC_BLOCKS[question.blockKey];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Multiple choice submit
  const handleMCSubmit = () => {
    if (!selectedOptionId) return;
    const selected = question.options?.find(o => o.id === selectedOptionId);
    const correct = Boolean(selected?.isCorrect);
    setIsAllCorrect(correct);
    setIsSubmitted(true);
    if (correct) {
      onSolve(true, question.rewardCash, question.timeBonus);
    }
  };

  // True/False submit
  const handleTFSubmit = (val: boolean) => {
    setSelectedTrueFalse(val);
    const correct = val === question.trueFalseAnswer;
    setIsAllCorrect(correct);
    setIsSubmitted(true);
    if (correct) {
      onSolve(true, question.rewardCash, question.timeBonus);
    }
  };

  // Matching handlers
  const handleLeftClick = (id: string) => {
    if (isSubmitted) return;
    setActiveLeftId(id);
  };

  const handleRightClick = (rightText: string) => {
    if (isSubmitted || !activeLeftId) return;
    setMatchedPairs(prev => ({
      ...prev,
      [activeLeftId]: rightText
    }));
    setActiveLeftId(null);
  };

  const handleMatchingSubmit = () => {
    if (!question.matchingPairs) return;
    let allRight = true;
    for (const pair of question.matchingPairs) {
      if (matchedPairs[pair.id] !== pair.right) {
        allRight = false;
        break;
      }
    }
    setIsAllCorrect(allRight);
    setIsSubmitted(true);
    if (allRight) {
      onSolve(true, question.rewardCash, question.timeBonus);
    }
  };

  // Ordering swap helpers
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedSteps.length) return;

    const newSteps = [...orderedSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setOrderedSteps(newSteps);
  };

  const handleOrderingSubmit = () => {
    // Check if orderedSteps are in correct order (correctIndex === 0, 1, 2, ...)
    let allRight = true;
    for (let i = 0; i < orderedSteps.length; i++) {
      if (orderedSteps[i].correctIndex !== i) {
        allRight = false;
        break;
      }
    }
    setIsAllCorrect(allRight);
    setIsSubmitted(true);
    if (allRight) {
      onSolve(true, question.rewardCash, question.timeBonus);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: blockInfo.color }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">
              {blockInfo.order}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                {question.type === 'multiple_choice'
                  ? 'PILIHAN GANDA & PENGECOH'
                  : question.type === 'true_false'
                  ? 'ANALISIS BENAR / SALAH'
                  : question.type === 'matching'
                  ? 'TANTANGAN MENJODOHKAN'
                  : 'TANTANGAN MENGURUTKAN ALUR'}
              </div>
              <h2 className="text-lg md:text-xl font-black">
                {blockInfo.title} ({blockInfo.subtitle})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-xl text-amber-300 font-black text-xs md:text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>+{formatRupiah(question.rewardCash)}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1.5 rounded-xl text-emerald-300 font-black text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>+{question.timeBonus}s</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-100 flex-1">
          {/* Scenario Box with Soft Skill Tag */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Kasus Riil Siswa Wirausaha SMK</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-[10px] font-extrabold text-blue-300">
                Fokus Soft Skill: {question.softSkillFocus}
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-slate-200">
              {question.scenario}
            </p>
          </div>

          {/* Question Title */}
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              Pertanyaan & Instruksi Tantangan:
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {question.question}
            </h3>
          </div>

          {/* TYPE 1: MULTIPLE CHOICE */}
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((opt, i) => {
                const isSelected = selectedOptionId === opt.id;
                let btnClass = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isSelected && !opt.isCorrect) {
                    btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnClass = 'opacity-40 bg-slate-800/40 border-slate-800 text-slate-400';
                  }
                } else if (isSelected) {
                  btnClass = 'bg-blue-900/60 border-blue-400 text-white ring-2 ring-blue-500/50';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center font-bold text-xs uppercase shrink-0 mt-0.5">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: TRUE / FALSE */}
          {question.type === 'true_false' && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={isSubmitted}
                  onClick={() => handleTFSubmit(true)}
                  className={`p-5 rounded-2xl border-2 font-black text-lg transition-all flex flex-col items-center gap-2 cursor-pointer disabled:cursor-default ${
                    isSubmitted
                      ? question.trueFalseAnswer === true
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500'
                        : selectedTrueFalse === true
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'opacity-40 bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-emerald-900/30 hover:bg-emerald-900/50 border-emerald-500/60 text-emerald-300 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <span>BENAR (TRUE)</span>
                </button>

                <button
                  disabled={isSubmitted}
                  onClick={() => handleTFSubmit(false)}
                  className={`p-5 rounded-2xl border-2 font-black text-lg transition-all flex flex-col items-center gap-2 cursor-pointer disabled:cursor-default ${
                    isSubmitted
                      ? question.trueFalseAnswer === false
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500'
                        : selectedTrueFalse === false
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'opacity-40 bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-rose-900/30 hover:bg-rose-900/50 border-rose-500/60 text-rose-300 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  <XCircle className="w-8 h-8 text-rose-400" />
                  <span>SALAH (FALSE)</span>
                </button>
              </div>
            </div>
          )}

          {/* TYPE 3: MATCHING / MENJODOHKAN */}
          {question.type === 'matching' && question.matchingPairs && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-amber-400" />
                <span>Klik item di Kolom A, lalu klik pasangannya di Kolom B!</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    KOLOM A (Konsep)
                  </div>
                  {question.matchingPairs.map((pair) => {
                    const isSelected = activeLeftId === pair.id;
                    const hasPaired = Boolean(matchedPairs[pair.id]);
                    return (
                      <button
                        key={pair.id}
                        disabled={isSubmitted}
                        onClick={() => handleLeftClick(pair.id)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer disabled:cursor-default ${
                          isSelected
                            ? 'bg-blue-900/80 border-blue-400 text-white ring-2 ring-blue-400'
                            : hasPaired
                            ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                            : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div className="font-bold text-xs">{pair.left}</div>
                        {hasPaired && (
                          <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                            ➜ Terhubung: {matchedPairs[pair.id]}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    KOLOM B (Penerapan Riil)
                  </div>
                  {question.matchingPairs.map((pair) => {
                    return (
                      <button
                        key={pair.id}
                        disabled={isSubmitted || !activeLeftId}
                        onClick={() => handleRightClick(pair.right)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer disabled:cursor-default ${
                          activeLeftId
                            ? 'bg-sky-950/50 hover:bg-sky-900/70 border-sky-600 text-sky-200 hover:scale-[1.01]'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 opacity-80'
                        }`}
                      >
                        <div className="text-xs">{pair.right}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleMatchingSubmit}
                  disabled={Object.keys(matchedPairs).length < question.matchingPairs.length}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Periksa Semua Pasangan Menjodohkan
                </button>
              )}
            </div>
          )}

          {/* TYPE 4: ORDERING / MENGURUTKAN ALUR */}
          {question.type === 'ordering' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ArrowUpDown className="w-4 h-4 text-amber-400" />
                <span>Gunakan tombol panah Naik / Turun untuk menyusun tahapan sesuai urutan yang tepat:</span>
              </div>

              <div className="space-y-2">
                {orderedSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-3 bg-slate-800/90 border-2 border-slate-700 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-400 text-blue-300 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-slate-200">{step.label}</span>
                    </div>

                    {!isSubmitted && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveStep(idx, 'up')}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer disabled:cursor-default"
                          title="Geser Naik"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === orderedSteps.length - 1}
                          onClick={() => moveStep(idx, 'down')}
                          className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer disabled:cursor-default"
                          title="Geser Turun"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleOrderingSubmit}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Periksa Urutan Langkah
                </button>
              )}
            </div>
          )}

          {/* Feedback & Pedagogical Reflection */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl border-2 animate-in slide-in-from-bottom-2 ${
                isAllCorrect
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/60 border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base mb-1">
                {isAllCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Luar Biasa! Kompetensi Wirausaha Teruji (+{question.timeBonus}s Bonus Waktu)!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Analisis Kurang Tepat, Evaluasi Solusimu!</span>
                  </>
                )}
              </div>

              <p className="text-xs md:text-sm leading-relaxed mb-3">
                {question.type === 'multiple_choice'
                  ? question.options?.find(o => o.id === selectedOptionId)?.explanation
                  : question.type === 'true_false'
                  ? question.trueFalseExplanation
                  : question.type === 'ordering'
                  ? isAllCorrect
                    ? 'Sempurna! Urutan tahapan saluran telah tersusun secara terstruktur dari Awareness hingga After-Sales!'
                    : 'Urutan tahapan masih belum tepat. Ingat bahwa konsumen harus menyadari (Aware) produk terlebih dahulu sebelum mengevaluasi dan membeli!'
                  : isAllCorrect
                  ? 'Hebat! Kamu berhasil menjodohkan seluruh elemen dengan presisi!'
                  : 'Beberapa pasangan masih belum tepat. Tinjau kembali panduan materi di glosarium BMC!'}
              </p>

              <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-amber-200 leading-normal">
                  {question.innovationTip}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Tutup (Lanjut Berlari)
          </button>

          {question.type === 'multiple_choice' && !isSubmitted && (
            <button
              onClick={handleMCSubmit}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Periksa Solusi Bisnis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isSubmitted && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan Petualangan 3D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
