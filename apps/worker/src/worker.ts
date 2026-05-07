import { runOnce } from './queue.js'; import { logger } from './logger.js';
export async function runLoop() { const seconds = Number(process.env.WORKER_LOOP_INTERVAL_SECONDS ?? 60); while (true) { logger.info(await runOnce()); await new Promise((resolve) => setTimeout(resolve, seconds * 1000)); } }
