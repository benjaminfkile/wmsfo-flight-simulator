import { getDb } from "./db";
import { ILocation } from "../interfaces";

const TABLE = "flight_simulator_gps_location";

const location = {
  /**
   * Insert a new GPS record if not already present (based on unique time)
   */
  async insertIfNew(data: ILocation, instanceId: string) {
    const db = getDb();

    const result = await db.raw(
      `
      INSERT INTO ${TABLE} (
        lat, lon, speed, temp, alt, bearing, bearing_raw,
        mode, time, type, status, redirect, count,
        recorded_at, recorded_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      ON CONFLICT (time)
      DO NOTHING
      RETURNING id;
      `,
      [
        data.lat,
        data.lon,
        data.speed ?? null,
        data.temp ?? null,
        data.alt ?? null,
        data.bearing ?? null,
        data.bearing_raw ?? null,
        data.mode ?? null,
        data.time ?? null,
        data.type ?? null,
        data.status ?? null,
        data.redirect ?? null,
        data.count ?? null,
        instanceId,
      ]
    );

    return result.rows?.[0] ?? null;
  },

  /**
   * Fetch the most recent GPS location record
   */
  async getLatest() {
    const db = getDb();
    const result = await db(TABLE)
      .select("*")
      .orderBy("recorded_at", "desc")
      .first();

    return result ?? null;
  },
};

export default location;
