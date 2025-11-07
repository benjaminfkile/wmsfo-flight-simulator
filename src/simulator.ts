import { ILocation } from "./interfaces";

let mode = 0;
let count = 0;

// Default Missoula bounds
const MIN_LAT = parseFloat(process.env.MIN_LAT || "46.83");
const MAX_LAT = parseFloat(process.env.MAX_LAT || "46.95");
const MIN_LON = parseFloat(process.env.MIN_LON || "-114.12");
const MAX_LON = parseFloat(process.env.MAX_LON || "-113.85");

let current: ILocation = {
  lat: ((MIN_LAT + MAX_LAT) / 2).toFixed(6),
  lon: ((MIN_LON + MAX_LON) / 2).toFixed(6),
  speed: "0",
  temp: "0",
  alt: "0",
  bearing: "0",
  bearing_raw: "0",
  mode,
  time: Date.now(),
  type: "0",
  status: "0",
  redirect: 0,
  count: 0,
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Update position roughly once a second
setInterval(() => {
  count++;
  const lat = parseFloat(current.lat) + randomBetween(-0.001, 0.001);
  const lon = parseFloat(current.lon) + randomBetween(-0.001, 0.001);

  current = {
    ...current,
    lat: Math.min(Math.max(lat, MIN_LAT), MAX_LAT).toFixed(6),
    lon: Math.min(Math.max(lon, MIN_LON), MAX_LON).toFixed(6),
    speed: (randomBetween(30, 90)).toFixed(1),
    temp: (randomBetween(-5, 10)).toFixed(1),
    alt: (randomBetween(900, 1300)).toFixed(1),
    bearing: (randomBetween(0, 360)).toFixed(1),
    bearing_raw: (randomBetween(0, 360)).toFixed(1),
    time: Date.now(),
    mode,
    count,
  };
}, 1000);

export function getCurrentLocation(): ILocation {
  return current;
}

export function setMode(newMode: number) {
  if ([0, 1, 2].includes(newMode)) {
    mode = newMode;
    current.mode = newMode;
  }
}

