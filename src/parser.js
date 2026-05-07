function captureFirst(text, pattern) {
  if (!pattern) {
    return '';
  }

  const regex = new RegExp(pattern, 'imu');
  const match = regex.exec(text);
  if (!match) {
    return '';
  }

  return String(match[1] ?? match[0] ?? '').trim();
}

export function parseShipmentText(rawText, rule) {
  const text = String(rawText ?? '');
  const parsed = {
    status: captureFirst(text, rule.statusRegex),
    eta: captureFirst(text, rule.etaRegex),
    vessel: captureFirst(text, rule.vesselRegex),
    location: captureFirst(text, rule.locationRegex),
    voyage: captureFirst(text, rule.voyageRegex),
    rawEvent: text.slice(0, 4000),
  };

  const usefulFields = ['status', 'eta', 'vessel', 'location', 'voyage'].filter((field) => parsed[field]);
  const confidence = Math.min(1, usefulFields.length / 4);

  return {
    ...parsed,
    confidence,
    usefulFields,
    needsManualReview: confidence < 0.25,
  };
}
