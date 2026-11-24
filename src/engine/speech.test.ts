import { describe, expect, it } from 'vitest';
import { selectEnglishVoice } from './speech';

describe('English speech voice selection', () => {
  it('prefers US English over default Chinese and other English locales', () => {
    expect(selectEnglishVoice([
      { lang: 'zh-CN', name: 'Chinese Voice' },
      { lang: 'en-GB', name: 'English UK' },
      { lang: 'en-US', name: 'English US' },
    ])?.name).toBe('English US');
  });

  it('prefers natural US voice when available', () => {
    expect(selectEnglishVoice([
      { lang: 'en-US', name: 'US basic voice' },
      { lang: 'en-US', name: 'Samantha' },
    ])?.name).toBe('Samantha');
  });

  it('accepts English variant voices when no US voice is installed', () => {
    expect(selectEnglishVoice([{ lang: 'en-GB', name: 'British' }])?.name).toBe('British');
  });

  it('does not select a non-English voice', () => {
    expect(selectEnglishVoice([{ lang: 'zh-CN', name: 'Chinese' }])).toBeUndefined();
    expect(selectEnglishVoice([])).toBeUndefined();
  });
});
