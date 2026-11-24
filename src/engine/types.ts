export type Skill = 'listening' | 'recognition' | 'reading' | 'speaking';
export type ChallengeMode = 'choice' | 'robot-tap' | 'self-recall';

export interface ChoiceOption { id: string; label: string; icon?: string }
export interface Challenge {
  id: string;
  pointId: string;
  skill: Skill;
  mode: ChallengeMode;
  title: string;
  instruction: string;
  prompt: string;
  spoken?: string;
  options?: ChoiceOption[];
  correctAnswer: string;
  explanation: string;
  /** A teacher-authored alternative to the original mission question. */
  reviewVariant?: boolean;
}
export interface KnowledgePoint {
  id: string;
  english: string;
  chinese: string;
  section: 'A' | 'B' | 'C';
  category: 'greeting' | 'body' | 'letters' | 'friendship' | 'reading';
  /** Indicates curriculum alignment, not copied textbook content. */
  alignment: 'core' | 'extension';
  sourceSection: string;
}
export interface Mission {
  id: string;
  index: number;
  title: string;
  englishTitle: string;
  subtitle: string;
  zone: string;
  icon: string;
  character: 'fox' | 'robot';
  introduction: string;
  introductionEnglish: string;
  celebration: string;
  challenges: Challenge[];
}
export interface TextbookUnit {
  id: string; number: number; name: string; chinese: string;
  world: string; available: boolean;
}
export type ReviewStatus = 'learning' | 'reviewing' | 'consolidated';
export interface ReviewEntry {
  key: string;
  pointId: string;
  skill: Skill;
  stage: number;
  status: ReviewStatus;
  attempts: number;
  independentSuccesses: number;
  errors: number;
  lastPracticedAt: string;
  lastQualifiedDay: string | null;
  dueAt: string;
}
export interface Attempt {
  id: string;
  challengeId: string;
  pointId: string;
  skill: Skill;
  correct: boolean;
  independent: boolean;
  at: string;
  missionId: string | null;
}
export interface GameState {
  version: 1;
  completedMissions: string[];
  entries: Record<string, ReviewEntry>;
  attempts: Attempt[];
  session: { missionId: string; step: number } | null;
}
export interface Grading {
  pointId: string;
  skill: Skill;
  correct: boolean;
  independent: boolean;
}
