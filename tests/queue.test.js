import { describe, expect, it } from 'vitest';
import { buildTrackingUrl, isDue, markQueueFailure, readPendingJobs } from '../src/queue.js';
import { MockSheetsStore, TAB_NAMES } from '../src/sheets.js';
import { createMockDatabase } from '../src/mockData.js';

describe('queue helpers', () => {
  it('replaces tracking number placeholder safely', () => {
    expect(buildTrackingUrl('https://carrier.example/track/{number}', 'BL 123')).toBe(
      'https://carrier.example/track/BL%20123',
    );
  });

  it('reads pending due jobs up to the batch limit', async () => {
    const store = new MockSheetsStore(createMockDatabase());
    const jobs = await readPendingJobs(store, 1, new Date('2026-05-07T00:00:00Z'));

    expect(jobs).toHaveLength(1);
    expect(jobs[0].data['Job ID']).toBe('JOB-001');
  });

  it('sets retry backoff and increments attempts on failure', async () => {
    const store = new MockSheetsStore(createMockDatabase());
    const [job] = await store.getRows(TAB_NAMES.queue);

    await markQueueFailure(store, job, new Error('Temporary carrier outage'), new Date('2026-05-07T00:00:00Z'));

    expect(store.database.Robot_Queue[0].Attempts).toBe('1');
    expect(store.database.Robot_Queue[0]['Job Status']).toBe('PENDING');
    expect(isDue(store.database.Robot_Queue[0]['Next Run At'], new Date('2026-05-07T00:00:00Z'))).toBe(false);
  });
});
