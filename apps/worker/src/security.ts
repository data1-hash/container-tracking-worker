const privateHostPatterns = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
];

export function assertSafeTrackingUrl(value: string) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported carrier URL protocol');
  if (privateHostPatterns.some((pattern) => pattern.test(url.hostname))) {
    throw new Error('Carrier URL points to a blocked private or local host');
  }
  return url.toString();
}
