export type BMCBlockKey =
  | 'customer_segments'
  | 'value_propositions'
  | 'channels'
  | 'customer_relationships'
  | 'key_activities'
  | 'key_resources'
  | 'key_partnerships'
  | 'cost_structure'
  | 'revenue_streams';

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'ordering';

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface OrderingStep {
  id: string;
  label: string;
  correctIndex: number; // 0-based correct sequence
}

export interface QuestionData {
  id: string;
  type: QuestionType;
  level: 1 | 2 | 3;
  blockKey: BMCBlockKey;
  stationTitle: string;
  scenario: string;
  question: string;
  options?: MultipleChoiceOption[];
  trueFalseAnswer?: boolean;
  trueFalseExplanation?: string;
  matchingPairs?: MatchingPair[];
  orderingSteps?: OrderingStep[];
  rewardCash: number;
  timeBonus: number;
  innovationTip: string;
  softSkillFocus: 'Problem Solving' | 'Decision Making' | 'Time Management' | 'Negosiasi' | 'Analisis Risiko';
}

export interface BMCBlockData {
  id: BMCBlockKey;
  order: number;
  level: 1 | 2 | 3;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  description: string;
  smkExample: string;
  keyQuestion: string;
}

export interface LevelConfig {
  levelNumber: 1 | 2 | 3;
  title: string;
  subtitle: string;
  missionGoal: string;
  themeColor: string;
  timeLimit: number; // in seconds
  blocks: BMCBlockKey[];
  finishZ: number;
  skyColor: number;
  groundColor: number;
  monsterSpeed: number;
}

export interface SoftSkillAssessment {
  problemSolving: number; // 0 - 100
  timeManagement: number; // 0 - 100
  decisionMaking: number; // 0 - 100
  entrepreneurialMindset: number; // 0 - 100
}

export interface PlayerStats {
  cash: number;
  health: number;
  maxHealth: number;
  currentLevel: 1 | 2 | 3;
  unlockedBlocks: Set<BMCBlockKey>;
  coinsCollected: number;
  timeRemaining: number;
  totalTimeElapsed: number;
  currentStreak: number;
  grade: string;
  correctAnswersCount: number;
  totalAnswerAttempts: number;
  softSkills: SoftSkillAssessment;
}
