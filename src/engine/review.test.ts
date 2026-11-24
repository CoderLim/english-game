import { describe, expect, it } from 'vitest';
import { createEmptyState, gradeEntry, getDueEntries, getReviewQueue, recordAttempt, completeMission } from './review';
import { knowledgePoints, missions, reviewChallenges, units } from '../content/unit1';

const t = (day: number, hour = 10) => new Date(2026, 10, day, hour);
const base = { pointId: 'u1-body-hand', skill: 'listening' as const, correct: true, independent: true };

describe('spaced repetition', () => {
  it('schedules an initial independent recall one day later', () => {
    const r = gradeEntry(undefined, base, t(1));
    expect(r.stage).toBe(0);
    expect(Date.parse(r.dueAt)).toBe(t(1).getTime() + 86400000);
  });
  it('does not inflate spaced mastery through multiple attempts on the same day', () => {
    const first = gradeEntry(undefined, base, t(1));
    const repeat = gradeEntry(first, base, t(1, 12));
    expect(repeat.stage).toBe(0);
    expect(repeat.independentSuccesses).toBe(2);
    expect(Date.parse(repeat.dueAt)).toBeGreaterThanOrEqual(Date.parse(first.dueAt));
  });
  it('advances only on a different local day', () => {
    const first = gradeEntry(undefined, base, t(1));
    const next = gradeEntry(first, base, t(2));
    expect(next.stage).toBe(1);
    expect(Date.parse(next.dueAt)).toBe(t(2).getTime() + 3 * 86400000);
  });
  it('treats prompted success as practice but not independent recall', () => {
    const entry = gradeEntry(undefined, { ...base, independent: false }, t(1));
    expect(entry.stage).toBe(-1);
    expect(entry.independentSuccesses).toBe(0);
    expect(Date.parse(entry.dueAt)).toBe(t(1).getTime() + 15 * 60000);
  });
  it('shortens the interval on failure', () => {
    const first = gradeEntry(undefined, base, t(1));
    const second = gradeEntry(first, base, t(2));
    const failed = gradeEntry(second, { ...base, correct: false, independent: false }, t(5));
    expect(failed.stage).toBe(0);
    expect(failed.errors).toBe(1);
  });
  it('only selects due entries with an authored review variant', () => {
    const state = recordAttempt(createEmptyState(), { ...base, missionId: 'help-robot', challengeId: 'm2-hand' }, t(1));
    expect(getDueEntries(state, t(1))).toHaveLength(0);
    expect(getReviewQueue(state, t(2))).toHaveLength(1);
    expect(getReviewQueue(state, t(2))[0].id).toBe('r2-hand');
  });
  it('keeps a bounded event history and completes a mission idempotently', () => {
    const state = completeMission(completeMission(createEmptyState(), 'meet-fox'), 'meet-fox');
    expect(state.completedMissions).toEqual(['meet-fox']);
  });
});

describe('curriculum integrity', () => {
  it('has unique curriculum and exercise identifiers with known objectives', () => {
    expect(new Set(knowledgePoints.map((x) => x.id)).size).toBe(knowledgePoints.length);
    const ids = [...missions.flatMap((x) => x.challenges), ...reviewChallenges].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    const known = new Set(knowledgePoints.map((x) => x.id));
    for (const item of [...missions.flatMap((x) => x.challenges), ...reviewChallenges]) {
      expect(known.has(item.pointId)).toBe(true);
      if (item.mode === 'choice') expect(item.options?.some((o) => o.id === item.correctAnswer)).toBe(true);
      if (item.mode === 'robot-tap') expect(['ear','eye','mouth','hand','arm']).toContain(item.correctAnswer);
    }
  });
  it('keeps future curriculum worlds locked until approved', () => {
    expect(units.filter((u) => u.available)).toHaveLength(1);
    expect(missions).toHaveLength(2);
  });
});
