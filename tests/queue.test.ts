import { describe, expect, it } from 'vitest';
type Job = { attempts: number; job_status: string; last_error?: string };
function failJob(job: Job, error: string): Job { const attempts = job.attempts + 1; return { ...job, attempts, job_status: attempts >= 3 ? 'FAILED' : 'PENDING', last_error: error }; }
function manualReviewJob(job: Job): Job { return { ...job, job_status: 'MANUAL_REVIEW' }; }
describe('queue transitions', () => { it('failed job increments attempts', () => expect(failJob({ attempts: 0, job_status: 'RUNNING' }, 'x').attempts).toBe(1)); it('failed after 3 attempts becomes FAILED', () => expect(failJob({ attempts: 2, job_status: 'RUNNING' }, 'x').job_status).toBe('FAILED')); it('manual review job becomes MANUAL_REVIEW', () => expect(manualReviewJob({ attempts: 0, job_status: 'RUNNING' }).job_status).toBe('MANUAL_REVIEW')); });
