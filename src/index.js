import { readConfig, requireRuntimeConfig } from './config.js';
import { createSheetsStore } from './sheets.js';
import { runTrackingBatch } from './tracker.js';

async function main() {
  const config = readConfig();
  requireRuntimeConfig(config);
  const store = createSheetsStore(config);
  const results = await runTrackingBatch(store, config);

  console.log(JSON.stringify({ processed: results.length, results }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
