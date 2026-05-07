import { describe, expect, it } from 'vitest';
import { hasCaptchaOrBlocker, normalizeKeywords } from '../src/captcha.js';

describe('captcha and blocker detection', () => {
  it('normalizes configured keywords', () => {
    expect(normalizeKeywords('captcha, human verification|access denied')).toEqual([
      'captcha',
      'human verification',
      'access denied',
    ]);
  });

  it('detects CAPTCHA or login-wall text without bypassing it', () => {
    const result = hasCaptchaOrBlocker('Please complete CAPTCHA before continuing.', 'captcha');

    expect(result.detected).toBe(true);
    expect(result.reason).toContain('captcha');
  });

  it('allows normal tracking text', () => {
    const result = hasCaptchaOrBlocker('Status: Loaded on vessel');

    expect(result.detected).toBe(false);
  });
});
