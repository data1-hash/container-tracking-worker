import { runOnce } from './queue.js'; import { runLoop } from './worker.js'; import { logger } from './logger.js';
const mode = process.argv[2] ?? 'start';
if (mode === 'run-loop') await runLoop(); else if (mode === 'run-once') logger.info(await runOnce()); else logger.info('Worker ready. Use run-once or run-loop to process queue.');
