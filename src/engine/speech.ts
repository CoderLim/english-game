/**
 * Prefer a clear US-English system voice where one is installed.
 * Web Speech voice availability and audio quality are platform-dependent.
 */
export function selectEnglishVoice<T extends { lang: string; name: string }>(voices: readonly T[]): T | undefined {
  const english = voices.filter((voice) => /^en(?:[-_]|$)/i.test(voice.lang));
  const score = (voice: T): number => {
    const us = /^en[-_]US$/i.test(voice.lang);
    const natural = /natural|enhanced|premium|samantha|jenny|aria|google us english/i.test(voice.name);
    return (us ? 10 : 5) + (natural ? 2 : 0);
  };
  return english.sort((a, b) => score(b) - score(a))[0];
}
