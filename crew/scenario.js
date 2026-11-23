import { byKey } from "../npc/people.js";
import {
  prepare,
  branch,
  DEFAULT_SEED,
  DEFAULT_HOLD,
  COUNT,
} from "../comparison/simulation.js";
export const TICKS_PER_SECOND = 10;
export const DOORS = 260;
export const SECOND_ZONE_AT = 24;
export const points = {
  dock: { x: -4.0, z: 0.74 },
  stage: { x: 1.9, z: 0.74 },
  audio: { x: 1.94, z: -0.34 },
  patch: { x: -2.08, z: -1.46 },
  lights: { x: 2.12, z: -1.48 },
  wing: { x: 4.47, z: -1.4 },
  booth: { x: 0.05, z: -1.1 },
};
export const crew = [
  {
    person: byKey.esme,
    title: "Sound engineer",
    skills: ["sound", "move"],
    home: { x: -5.49, z: 1.42 },
    park: { x: -4.9, z: 3.15 },
    pace: 1.65,
  },
  {
    person: byKey.wes,
    title: "Stagehand",
    skills: ["move", "power"],
    home: { x: -5.5, z: 0.02 },
    park: { x: -5.72, z: -0.88 },
    pace: 1.55,
  },
  {
    person: byKey.nina,
    title: "Stage manager",
    skills: ["move", "cue", "power"],
    home: { x: -1.5, z: -1.25 },
    park: { x: -3.55, z: -1.3 },
    pace: 1.62,
  },
  {
    person: byKey.maya,
    title: "Show technician",
    skills: ["lights", "sound", "cue"],
    home: { x: 2.65, z: -1.21 },
    park: { x: 3.38, z: -1.26 },
    pace: 1.52,
  },
].map((g, id) => ({ ...g, id, name: g.person.name }));
export const skillName = {
  move: "rack handling",
  power: "power",
  sound: "audio",
  lights: "lighting",
  cue: "show control",
};
export function readForecast(params) {
  const raw = params.get("seed"),
    seed =
      raw && /^\d{1,10}$/.test(raw) && Number(raw) <= 4294967295
        ? Number(raw)
        : DEFAULT_SEED;
  const candidate = params.get("hold");
  const hold =
    candidate !== null &&
    /^\d{1,2}$/.test(candidate) &&
    Number(candidate) < COUNT
      ? Number(candidate)
      : DEFAULT_HOLD;
  const session = prepare(seed);
  return {
    seed,
    hold,
    messenger: session.checkpoint.guests[hold].name,
    original: session.finalHalls.filter((zone) => zone === 1).length,
    altered: branch(session, hold, false).east,
  };
}
export function makeJobs(attendance, recordReady = 0) {
  const jobs = [
    {
      id: "rack",
      name: "Move PA rack",
      short: "Move rack",
      roles: ["move", "move"],
      from: points.dock,
      to: points.stage,
      ticks: 70,
      after: [],
    },
    {
      id: "feed",
      name: "Set up power",
      short: "Power",
      roles: ["power"],
      from: points.patch,
      ticks: 54,
      after: [],
    },
    {
      id: "lights",
      name: "Focus house lights",
      short: "Lights",
      roles: ["lights"],
      from: points.lights,
      ticks: 58,
      after: ["feed"],
    },
    {
      id: "sound",
      name: "Patch main sound",
      short: "Sound",
      release: recordReady,
      roles: ["sound"],
      from: points.audio,
      ticks: 48,
      after: ["rack", "feed"],
    },
  ];
  if (attendance >= SECOND_ZONE_AT)
    jobs.push({
      id: "zone",
      name: "Open second speaker zone",
      short: "Zone two",
      roles: ["sound"],
      from: points.wing,
      ticks: 46,
      after: ["sound"],
    });
  jobs.push({
    id: "cue",
    name: "Run opening cue",
    short: "Opening cue",
    roles: ["cue", "sound"],
    from: points.booth,
    ticks: 37,
    after: ["lights", attendance >= SECOND_ZONE_AT ? "zone" : "sound"],
  });
  return jobs.map((j) => ({ ...j, to: j.to ?? j.from }));
}
