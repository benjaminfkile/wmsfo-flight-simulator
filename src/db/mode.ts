import { getDb } from "./db";

export const mode = {
  async getMode(): Promise<number> {
    const db = getDb();
    const row = await db("flight_simulator_mode")
      .select("mode")
      .orderBy("created_at", "desc")
      .first();
    return row ? row.mode : 0;
  },

  async setMode(newMode: number): Promise<void> {
    const db = getDb();
    if (![0, 1, 2].includes(newMode)) return;
    await db("flight_simulator_mode").insert({ mode: newMode });
    console.log(`[Mode] Inserted mode: ${newMode}`);
  },
};
