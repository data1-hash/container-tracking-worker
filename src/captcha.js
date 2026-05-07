const DEFAULT_BLOCK_KEYWORDS = [
  'captcha',
  'human verification',
  'verify you are human',
  'access denied',
  'blocked',
  'login required',
  'sign in',
];

export function normalizeKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
  }

  return String(keywords ?? '')
    .split(/[|,;\n]/u)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function hasCaptchaOrBlocker(text, keywords = []) {
  const haystack = String(text ?? '').toLowerCase();
  const configured = normalizeKeywords(keywords);
  const allKeywords = [...new Set([...DEFAULT_BLOCK_KEYWORDS, ...configured])];

  const matchedKeyword = allKeywords.find((keyword) => haystack.includes(keyword.toLowerCase()));

  return {
    detected: Boolean(matchedKeyword),
    reason: matchedKeyword ? `Blocked by keyword: ${matchedKeyword}` : '',
    keyword: matchedKeyword ?? '',
  };
}
