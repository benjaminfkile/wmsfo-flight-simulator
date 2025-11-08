import { getDb } from "./db/db";

// how many rows to keep
const MAX_ROWS = 10_000;
// how often to check (every hour)
const INTERVAL_MS = 60 * 60 * 1000;

// jitter helper to avoid synchronized jobs across instances
function randomJitter(baseMs: number, jitterPercent = 0.2) {
  const delta = baseMs * jitterPercent;
  return baseMs + (Math.random() * 2 - 1) * delta;
}

const cleanup = {
  intervalId: null as NodeJS.Timeout | null,

  start() {
    if (this.intervalId) {
      console.warn("[cleanup] Already running — skipping reinit.");
      return;
    }

    const interval = randomJitter(INTERVAL_MS);
    console.log(
      `[cleanup] Starting periodic cleanup (interval: ${(
        interval /
        1000 /
        60
      ).toFixed(1)} min)`
    );

    // Run immediately and then on schedule
    this.cleanup();
    this.intervalId = setInterval(() => this.cleanup(), interval);
  },

  async cleanup() {
    try {
      const db = getDb();

      console.log("[cleanup] Checking row count...");
      const countResult = await db("flight_simulator_gps_location")
        .count<{ count: string }>("* as count")
        .first();
      const rowCount = parseInt(countResult?.count ?? "0", 10);

      if (rowCount <= MAX_ROWS) {
        console.log(`[cleanup] Row count OK (${rowCount}/${MAX_ROWS}).`);
        return;
      }

      const toDelete = rowCount - MAX_ROWS;
      console.log(`[cleanup] Trimming ${toDelete} oldest rows...`);

      await db.raw(
        `
        DELETE FROM flight_simulator_gps_location
        WHERE id IN (
          SELECT id
          FROM flight_simulator_gps_location
          ORDER BY time ASC
          LIMIT ?
        );
        `,
        [toDelete]
      );

      console.log("[cleanup] Cleanup complete.");
    } catch (err) {
      console.error("[cleanup] Error during cleanup:", err);
    }
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[cleanup] Stopped cleanup loop.");
    }
  },
};

export default cleanup;
