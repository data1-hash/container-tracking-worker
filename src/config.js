const DEFAULT_BATCH_LIMIT = 10;

export function readConfig(env = process.env) {
  const batchLimit = Number.parseInt(env.BATCH_LIMIT ?? `${DEFAULT_BATCH_LIMIT}`, 10);

  return {
    spreadsheetId: env.SPREADSHEET_ID ?? '',
    googleServiceAccountJson: env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '',
    batchLimit: Number.isFinite(batchLimit) && batchLimit > 0 ? batchLimit : DEFAULT_BATCH_LIMIT,
    mockMode: String(env.MOCK_MODE ?? '').toLowerCase() === 'true',
  };
}

export function requireRuntimeConfig(config) {
  if (config.mockMode) {
    return;
  }

  const missing = [];
  if (!config.spreadsheetId) missing.push('SPREADSHEET_ID');
  if (!config.googleServiceAccountJson) missing.push('GOOGLE_SERVICE_ACCOUNT_JSON');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
