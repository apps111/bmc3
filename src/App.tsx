import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { BMCBlockKey, PlayerStats, QuestionData } from './types/game';
import { getQuestionForBlock, LEVEL_CONFIGS } from './data/bmcData';
import { HUD } from './components/HUD';
import { BottomDock } from './components/BottomDock';
import { TitleScreen } from './components/TitleScreen';
import { QuestionModal } from './components/QuestionModal';
import { BMCBoardModal } from './components/BMCBoardModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GlossaryModal } from './components/GlossaryModal';
import { ControlsGuideModal } from './components/ControlsGuideModal';
import { CurriculumGuideModal } from './components/CurriculumGuideModal';
import { ReportModal } from './components/ReportModal';
import { OnScreenControls } from './components/OnScreenControls';
import { downloadStandaloneHTML } from './utils/generateStandaloneHTML';
import { exportZipPackage } from './utils/exportZipPackage';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // High-level Game States: 'title' | 'playing' | 'level_complete' | 'game_over' | 'victory'
  const [gameState, setGameState] = useState<'title' | 'playing' | 'level_complete' | 'game_over' | 'victory'>('title');
  const [completedLevelData, setCompletedLevelData] = useState<{ completed: 1 | 2 | 3; next: 2 | 3 } | null>(null);
  const [gameOverReason, setGameOverReason] = useState<'health' | 'timeout'>('health');

  // Modals & Auxiliary States
  const [activeQuestion, setActiveQuestion] = useState<{ question: QuestionData; index: number } | null>(null);
  const [showBMCBoard, setShowBMCBoard] = useState<boolean>(false);
  const [showGlossary, setShowGlossary] = useState<boolean>(false);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [showCurriculumGuide, setShowCurriculumGuide] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showOnScreenControls, setShowOnScreenControls] = useState<boolean>(true);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);
  const [is16x9Locked, setIs16x9Locked] = useState<boolean>(true);

  // Player Stats with Soft Skill Metrics
  const [stats, setStats] = useState<PlayerStats>({
    cash: 100000,
    health: 3,
    maxHealth: 3,
    currentLevel: 1,
    unlockedBlocks: new Set<BMCBlockKey>(),
    coinsCollected: 0,
    timeRemaining: LEVEL_CONFIGS[1].timeLimit,
    totalTimeElapsed: 0,
    currentStreak: 0,
    grade: 'Pemula',
    correctAnswersCount: 0,
    totalAnswerAttempts: 0,
    softSkills: {
      problemSolving: 80,
      timeManagement: 85,
      decisionMaking: 80,
      entrepreneurialMindset: 85
    }
  });

  // Handle Question Trigger
  const handleQuestionTrigger = useCallback((blockKey: BMCBlockKey, questionIndex: number) => {
    const randomizedQ = getQuestionForBlock(blockKey);
    engineRef.current?.pause();
    setActiveQuestion({ question: randomizedQ, index: questionIndex });
  }, []);

  // Handle Stats Update from Engine
  const handleStatsUpdate = useCallback((newStats: PlayerStats) => {
    setStats({
      ...newStats,
      unlockedBlocks: new Set(newStats.unlockedBlocks)
    });
  }, []);

  // Handle Level Complete Trigger
  const handleLevelComplete = useCallback((completedLevel: 1 | 2 | 3, nextLevel: 2 | 3 | null) => {
    if (nextLevel) {
      setCompletedLevelData({ completed: completedLevel, next: nextLevel });
      setGameState('level_complete');
    }
  }, []);

  // Handle Victory Trigger
  const handleVictory = useCallback((finalStats: PlayerStats) => {
    setStats({
      ...finalStats,
      unlockedBlocks: new Set(finalStats.unlockedBlocks)
    });
    setGameState('victory');
  }, []);

  // Handle Game Over
  const handleGameOver = useCallback((reason: 'health' | 'timeout') => {
    setGameOverReason(reason);
    setGameState('game_over');
  }, []);

  // Initialize Three.js Game Engine once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine(mountRef.current, {
      onQuestionTrigger: handleQuestionTrigger,
      onStatsUpdate: handleStatsUpdate,
      onLevelComplete: handleLevelComplete,
      onVictory: handleVictory,
      onGameOver: handleGameOver
    });
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [handleQuestionTrigger, handleStatsUpdate, handleLevelComplete, handleVictory, handleGameOver]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.code === 'KeyC') {
        setShowBMCBoard(prev => !prev);
      } else if (e.code === 'KeyG') {
        setShowGlossary(prev => !prev);
      } else if (e.code === 'KeyR') {
        engineRef.current?.resetCamera();
      } else if (e.code === 'Escape') {
        setActiveQuestion(null);
        setShowBMCBoard(false);
        setShowGlossary(false);
        setShowControlsGuide(false);
        setShowCurriculumGuide(false);
        setShowReportModal(false);
        engineRef.current?.resume();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Game flow triggers
  const handleStartGame = () => {
    setGameState('playing');
    engineRef.current?.resume();
  };

  const handleNextLevel = () => {
    engineRef.current?.nextLevel();
    setGameState('playing');
    setCompletedLevelData(null);
  };

  const handleRestartLevel = () => {
    engineRef.current?.restartLevel();
    setGameState('playing');
  };

  const handleRestartEntireGame = () => {
    engineRef.current?.restartEntireGame();
    setGameState('playing');
  };

  // Solve question callback
  const handleQuestionSolve = (isCorrect: boolean, reward: number, timeBonus: number) => {
    if (activeQuestion && isCorrect) {
      setStats(prev => ({
        ...prev,
        correctAnswersCount: prev.correctAnswersCount + 1,
        totalAnswerAttempts: prev.totalAnswerAttempts + 1
      }));
      engineRef.current?.awardCorrectAnswer(
        activeQuestion.question.blockKey,
        reward,
        timeBonus,
        activeQuestion.index
      );
    } else {
      setStats(prev => ({
        ...prev,
        totalAnswerAttempts: prev.totalAnswerAttempts + 1
      }));
    }
  };

  const handleCloseQuestion = () => {
    setActiveQuestion(null);
    engineRef.current?.resume();
  };

  // On-screen control helpers
  const handleMoveChange = (x: number, z: number) => {
    if (engineRef.current) {
      engineRef.current.virtualInput.moveX = x;
      engineRef.current.virtualInput.moveZ = z;
    }
  };

  const handleJumpPress = () => {
    if (engineRef.current) {
      engineRef.current.virtualInput.jump = true;
    }
  };

  const handleSprintToggle = (sprint: boolean) => {
    setIsSprinting(sprint);
    if (engineRef.current) {
      engineRef.current.virtualInput.sprint = sprint;
    }
  };

  const handleRotateCamera = (delta: number) => {
    engineRef.current?.rotateCameraBy(delta);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center font-sans select-none">
      {/* 16:9 Screen Ratio Wrapper */}
      <div
        className={`relative overflow-hidden bg-slate-950 transition-all duration-300 ${
          is16x9Locked
            ? 'w-full h-full max-w-[177.78vh] max-h-[56.25vw] aspect-video shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-slate-800'
            : 'w-full h-full'
        }`}
      >
        {/* Isolated Three.js WebGL Mount Container */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Title Screen Overlay */}
        {gameState === 'title' && (
          <TitleScreen
            onStart={handleStartGame}
            onOpenCurriculumGuide={() => setShowCurriculumGuide(true)}
            onOpenGlossary={() => setShowGlossary(true)}
            onExportZip={exportZipPackage}
          />
        )}

        {/* Playing View with HUD and On-Screen Controls */}
        {gameState === 'playing' && (
          <>
            <HUD
              stats={stats}
              onOpenBMC={() => setShowBMCBoard(true)}
            />

            {showOnScreenControls && (
              <OnScreenControls
                onMoveChange={handleMoveChange}
                onJumpPress={handleJumpPress}
                onSprintToggle={handleSprintToggle}
                onRotateCamera={handleRotateCamera}
                isSprinting={isSprinting}
              />
            )}

            <BottomDock
              onOpenBMC={() => setShowBMCBoard(true)}
              onOpenGlossary={() => setShowGlossary(true)}
              onOpenControlsGuide={() => setShowControlsGuide(true)}
              onResetCamera={() => engineRef.current?.resetCamera()}
              onDownloadHTML={downloadStandaloneHTML}
              showOnScreenControls={showOnScreenControls}
              onToggleOnScreenControls={() => setShowOnScreenControls(!showOnScreenControls)}
              onOpenReport={() => setShowReportModal(true)}
              onExportZip={exportZipPackage}
              is16x9Locked={is16x9Locked}
              onToggle16x9={() => setIs16x9Locked(prev => !prev)}
            />
          </>
        )}

        {/* Question Modal */}
        {activeQuestion && (
          <QuestionModal
            question={activeQuestion.question}
            questionIndex={activeQuestion.index}
            onSolve={handleQuestionSolve}
            onClose={handleCloseQuestion}
          />
        )}

        {/* Level Complete Modal */}
        {gameState === 'level_complete' && completedLevelData && (
          <LevelCompleteModal
            completedLevel={completedLevelData.completed}
            nextLevel={completedLevelData.next}
            stats={stats}
            onContinue={handleNextLevel}
            onOpenBMC={() => setShowBMCBoard(true)}
          />
        )}

        {/* 9-Block Business Model Canvas Interactive Board */}
        {showBMCBoard && (
          <BMCBoardModal
            unlockedBlocks={stats.unlockedBlocks}
            onClose={() => setShowBMCBoard(false)}
          />
        )}

        {/* Curriculum & Pedagogical Guide Modal */}
        {showCurriculumGuide && (
          <CurriculumGuideModal
            onClose={() => setShowCurriculumGuide(false)}
          />
        )}

        {/* Student Competency Report Modal */}
        {showReportModal && (
          <ReportModal
            stats={stats}
            onClose={() => setShowReportModal(false)}
          />
        )}

        {/* Theory & Glossary Modal */}
        {showGlossary && (
          <GlossaryModal
            onClose={() => setShowGlossary(false)}
          />
        )}

        {/* Controls Guide Modal */}
        {showControlsGuide && (
          <ControlsGuideModal
            onClose={() => setShowControlsGuide(false)}
          />
        )}

        {/* Victory Modal */}
        {gameState === 'victory' && (
          <VictoryModal
            stats={stats}
            onOpenBMC={() => setShowBMCBoard(true)}
            onRestart={handleRestartEntireGame}
            onOpenReport={() => setShowReportModal(true)}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'game_over' && (
          <GameOverModal
            reason={gameOverReason}
            onRestartLevel={handleRestartLevel}
            onRestartEntireGame={handleRestartEntireGame}
          />
        )}
      </div>
    </div>
  );
}
