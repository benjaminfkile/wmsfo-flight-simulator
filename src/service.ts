import { ILocation } from "./interfaces";

const service = {
  mode: 0,
  count: 0,
  intervalId: null as NodeJS.Timeout | null,
  current: {} as ILocation,

  // Default Missoula bounds
  MIN_LAT: parseFloat(process.env.MIN_LAT || "46.83"),
  MAX_LAT: parseFloat(process.env.MAX_LAT || "46.95"),
  MIN_LON: parseFloat(process.env.MIN_LON || "-114.12"),
  MAX_LON: parseFloat(process.env.MAX_LON || "-113.85"),

  /**
   * Initialize the simulator service
   */
  init() {
    const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = this;
    this.current = {
      lat: ((MIN_LAT + MAX_LAT) / 2).toFixed(6),
      lon: ((MIN_LON + MAX_LON) / 2).toFixed(6),
      speed: "0",
      temp: "0",
      alt: "0",
      bearing: "0",
      bearing_raw: "0",
      mode: this.mode,
      time: Date.now(),
      type: "0",
      status: "0",
      redirect: 0,
      count: 0,
    };

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => this.updateLocation(), 5000);

    console.log("[SimulatorService] Initialized fake location simulator");
  },

  /**
   * Internal random helper
   */
  randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  },

  /**
   * Update simulated position once per tick
   */
  updateLocation() {
    this.count++;
    const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = this;

    const lat = parseFloat(this.current.lat) + this.randomBetween(-0.001, 0.001);
    const lon = parseFloat(this.current.lon) + this.randomBetween(-0.001, 0.001);

    this.current = {
      ...this.current,
      lat: Math.min(Math.max(lat, MIN_LAT), MAX_LAT).toFixed(6),
      lon: Math.min(Math.max(lon, MIN_LON), MAX_LON).toFixed(6),
      speed: this.randomBetween(30, 90).toFixed(1),
      temp: this.randomBetween(-5, 10).toFixed(1),
      alt: this.randomBetween(900, 1300).toFixed(1),
      bearing: this.randomBetween(0, 360).toFixed(1),
      bearing_raw: this.randomBetween(0, 360).toFixed(1),
      time: Date.now(),
      mode: this.mode,
      count: this.count,
    };
  },

  /**
   * Returns current simulated location
   */
  getCurrentLocation(): ILocation {
    return this.current;
  },

  /**
   * Update simulation mode (0, 1, or 2)
   */
  setMode(newMode: number) {
    if ([0, 1, 2].includes(newMode)) {
      this.mode = newMode;
      this.current.mode = newMode;
      console.log(`[SimulatorService] Mode set to ${newMode}`);
    }
  },

  /**
   * Stop the simulator
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[SimulatorService] Simulator stopped");
    }
  },
};

export default service;
