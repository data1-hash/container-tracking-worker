import type { CarrierRule } from '@voraco/shared';
export function buildTrackingUrl(rule: CarrierRule, trackingNumber: string) { return rule.tracking_url_pattern.replace('{number}', encodeURIComponent(trackingNumber)); }
