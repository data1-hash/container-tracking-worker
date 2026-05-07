import { describe, expect, it } from 'vitest';
import { detectCaptcha } from '@voraco/shared';
describe('detectCaptcha', () => { it('detects captcha', () => expect(detectCaptcha('Please complete CAPTCHA')).toBe(true)); it('detects verify human', () => expect(detectCaptcha('Verify you are human')).toBe(true)); it('detects login wall', () => expect(detectCaptcha('Login required to continue')).toBe(true)); it('ignores normal shipment text', () => expect(detectCaptcha('Status In Transit ETA 2026-06-01')).toBe(false)); });
