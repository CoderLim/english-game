import type { Attempt, GameState, Grading, ReviewEntry, Skill } from './types';
import { findReviewChallenge } from '../content/unit1';

const DAY = 24 * 60 * 60 * 1000;
const RELEARNING_DELAY = 15 * 60 * 1000;
/** Days between *independent, cross-day* retrieval successes. */
export const INTERVALS = [1, 3, 7, 14, 30] as const;
export const STORAGE_KEY = 'english-adventure:pep-2024-g3-upper:v1';

export function localDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}
export function keyOf(pointId: string, skill: Skill): string {
  return pointId + '::' + skill;
}
export function createEmptyState(): GameState {
  return { version: 1, completedMissions: [], entries: {}, attempts: [], session: null };
}
export function gradeEntry(previous: ReviewEntry | undefined, grade: Grading, at: Date): ReviewEntry {
  const now = at.toISOString();
  const today = localDay(at);
  const qualified = grade.correct && grade.independent;
  const key = keyOf(grade.pointId, grade.skill);
  const priorStage = previous?.stage ?? -1;
  let stage = priorStage;
  let lastQualifiedDay = previous?.lastQualifiedDay ?? null;
  let dueAt: string;
  if (qualified) {
    // Repeating the same question 10 times today must not count as 10 spaced reviews.
    const newDay = lastQualifiedDay !== today;
    if (newDay) {
      stage = Math.min(priorStage + 1, INTERVALS.length - 1);
      lastQualifiedDay = today;
    }
    const interval = INTERVALS[Math.max(0, stage)];
    const earliest = at.getTime() + interval * DAY;
    const alreadyDue = previous && !newDay ? Date.parse(previous.dueAt) : 0;
    dueAt = new Date(Math.max(earliest, Number.isFinite(alreadyDue) ? alreadyDue : 0)).toISOString();
  } else {
    stage = Math.max(-1, priorStage - 1);
    dueAt = new Date(at.getTime() + RELEARNING_DELAY).toISOString();
  }
  return {
    key, pointId: grade.pointId, skill: grade.skill, stage,
    status: stage >= 3 ? 'consolidated' : stage >= 0 ? 'reviewing' : 'learning',
    attempts: (previous?.attempts ?? 0) + 1,
    independentSuccesses: (previous?.independentSuccesses ?? 0) + (qualified ? 1 : 0),
    errors: (previous?.errors ?? 0) + (grade.correct ? 0 : 1),
    lastPracticedAt: now, lastQualifiedDay, dueAt,
  };
}
export function recordAttempt(state: GameState, input: Omit<Attempt, 'id' | 'at'>, at = new Date()): GameState {
  const key = keyOf(input.pointId, input.skill);
  const entry = gradeEntry(state.entries[key], input, at);
  const attempt = { ...input, id: input.challengeId + '-' + at.getTime() + '-' + state.attempts.length, at: at.toISOString() };
  return {
    ...state,
    entries: { ...state.entries, [key]: entry },
    // Only the most recent 500 low-sensitivity answer events are retained locally.
    attempts: [...state.attempts, attempt].slice(-500),
  };
}
export function getDueEntries(state: GameState, at = new Date()): ReviewEntry[] {
  return Object.values(state.entries)
    .filter((entry) => Date.parse(entry.dueAt) <= at.getTime() && Boolean(findReviewChallenge(entry.pointId, entry.skill)))
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
}
export function getReviewQueue(state: GameState, at = new Date()) {
  return getDueEntries(state, at)
    .map((entry) => findReviewChallenge(entry.pointId, entry.skill))
    .filter((challenge) => challenge !== undefined);
}
export function completeMission(state: GameState, id: string): GameState {
  return { ...state, completedMissions: [...new Set([...state.completedMissions, id])], session: null };
}
export function persistState(state: GameState): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; } catch { return false; }
}
export function loadState(): GameState {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return createEmptyState();
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || parsed.version !== 1) return createEmptyState();
    const valueState = parsed as Partial<GameState>;
    if (!Array.isArray(valueState.completedMissions) || !valueState.entries || typeof valueState.entries !== 'object' || !Array.isArray(valueState.attempts)) return createEmptyState();
    return {
      version: 1,
      completedMissions: valueState.completedMissions.filter((s): s is string => typeof s === 'string'),
      entries: Object.fromEntries(Object.entries(valueState.entries).filter(([, entry]) => {
        const e = entry as Partial<ReviewEntry> | null;
        return !!e && typeof e.key === 'string' && typeof e.pointId === 'string' && typeof e.skill === 'string' && Number.isInteger(e.stage) && typeof e.dueAt === 'string';
      })) as Record<string, ReviewEntry>,
      attempts: valueState.attempts.filter((a): a is Attempt => !!a && typeof a === 'object' && typeof a.challengeId === 'string').slice(-500),
      session: valueState.session && typeof valueState.session.missionId === 'string' && Number.isInteger(valueState.session.step) && valueState.session.step >= 0 ? valueState.session : null,
    };
  } catch { return createEmptyState(); }
}
