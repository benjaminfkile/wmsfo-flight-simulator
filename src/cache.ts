import { ILocation } from "./interfaces";
import location from "./db/location";
import service from "./service";
import { amILeader } from "./utils/amILeader";
import { mode } from "./db/mode";

const INTERVAL = 5000;

const cache = {
  cachedData: {} as ILocation,
  intervalId: null as NodeJS.Timeout | null,
  initialized: false,

  /**
   * Initialize the Santa Flyover cache system
   */
  async init() {
    if (this.initialized) {
      console.warn("[SantaFlyoverCache] Already initialized — skipping.");
      return;
    }

    console.log("[SantaFlyoverCache] Starting simulator + distributed polling");

    // Always start the simulator, regardless of environment
    service.init();

    // Start polling for updates
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.refresh(), INTERVAL);

    // Do first refresh immediately
    await this.refresh();

    this.initialized = true;
  },

  /**
   * Refresh loop: only leader updates DB; others read from DB
   */
  async refresh() {
    try {
      const { isLeader, instanceId } = await amILeader();

      const newMode = await mode.getMode();

      if (isLeader) {
        // --- Leader behavior: fetch from simulator + write to DB ---
        const data = service.getCurrentLocation();

        await location.insertIfNew(data, instanceId ?? "missing-instance-id");

        this.cachedData = data;
        this.cachedData.mode = newMode;

        console.log("[SantaFlyoverCache] Leader updated cache + DB");
      } else {
        // --- Follower behavior: read from DB ---

        const latest = await location.getLatest();

        if (latest) {
          this.cachedData = latest;
          this.cachedData.mode = newMode;
        }

        console.log("[SantaFlyoverCache] Follower refreshed cache from DB");
      }
    } catch (err) {
      console.error("[SantaFlyoverCache] Error refreshing data:", err);
    }
  },

  /**
   * Returns cached Santa Flyover data
   */
  getData(): ILocation {
    return this.cachedData;
  },

  /**
   * Stops polling and simulator
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[SantaFlyoverCache] Polling stopped");
    }
    this.cachedData = {} as ILocation;
    this.initialized = false;
    service.stop();
  },
};

export default cache;
