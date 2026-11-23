import { byKey } from "./npc/people.js";
const cast = [
  {
    id: "nell",
    name: byKey.nell.name,
    role: "Bartender",
    x: -3.49,
    z: -2.52,
    friends: ["kit"],
    call: "Kit, Lark’s doing a set. Pass it on.",
  },
  {
    id: "kit",
    name: byKey.kit.name,
    role: "Photographer",
    x: -2.25,
    z: -1.32,
    friends: ["finn"],
    call: "Finn, Lark’s on in a minute.",
  },
  {
    id: "finn",
    name: byKey.finn.name,
    role: "Courier",
    x: -0.39,
    z: 0.02,
    friends: ["ida"],
    call: "Ida, come hear this with us.",
  },
  {
    id: "ida",
    name: byKey.ida.name,
    role: "Architect",
    x: 0.86,
    z: 1.45,
    friends: [],
    call: "",
  },
  {
    id: "silas",
    name: byKey.silas.name,
    role: "Regular",
    x: -5.06,
    z: 1.71,
    friends: [],
    call: "",
  },
  {
    id: "lark",
    name: byKey.lark.name,
    role: "DJ",
    x: 5.33,
    z: -1.17,
    friends: [],
    call: "",
  },
];
const seats = {
  kit: [3.25, 0.38],
  finn: [4.28, 1.18],
  ida: [5.7, 1.55],
  silas: [3.91, 0.7],
};
export function createRoom(onState) {
  let people = [],
    phase = "choose",
    time = 0,
    relayAt = 0,
    speaker = "",
    line = "",
    until = 0,
    question = "";
  function reset() {
    people = cast.map((p) => ({
      ...p,
      source: "",
      learned: 0,
      walked: 0,
      walking: false,
      arrived: false,
      untilFree: 0,
      partner: "",
    }));
    phase = "choose";
    time = 0;
    relayAt = 2.5;
    speaker = "";
    line = "";
    until = 0;
    question = "";
  }
  function speak(id, text, duration) {
    speaker = id;
    line = text;
    until = time + duration;
  }
  function know(person, source) {
    person.source = source;
    person.learned = time;
  }
  function walk(p, x, z, limit, dt) {
    const dx = x - p.x,
      dz = z - p.z,
      distance = Math.hypot(dx, dz);
    if (distance <= limit + 0.005) return true;
    const step = Math.min(distance - limit, 1.52 * dt);
    // Turn around a neighbour instead of cutting through their standing pose.
    for (const angle of [0, 0.36, -0.36, 0.76, -0.76, 1.2, -1.2, 1.52, -1.52]) {
      const c = Math.cos(angle),
        s = Math.sin(angle);
      const nx = p.x + ((dx * c - dz * s) * step) / distance,
        nz = p.z + ((dx * s + dz * c) * step) / distance;
      if (people.some((q) => q !== p && Math.hypot(nx - q.x, nz - q.z) < 0.66))
        continue;
      p.x = nx;
      p.z = nz;
      p.walked += step;
      p.walking = true;
      break;
    }
    return false;
  }
  function tick(dt) {
    time += dt;
    for (const p of people) {
      p.walking = false;
      if (time < p.untilFree) continue;
      p.partner = "";
      if (!p.source || p.arrived || time - p.learned < 1.65) continue;
      const friend = people.find(
        (other) => p.friends.includes(other.id) && !other.source,
      );
      if (friend) {
        p.partner = friend.id;
        // Nell can speak from her side of the counter. Guests cross the room to speak quietly.
        const reach = p.id === "nell" ? 2.0 : 1.08;
        if (walk(p, friend.x, friend.z, reach, dt) && time >= relayAt) {
          know(friend, p.id);
          friend.partner = p.id;
          p.untilFree = friend.untilFree = time + 1.35;
          relayAt = time + 1.65;
          if (!question || time >= until) {
            question = "";
            speak(p.id, p.call, 1.65);
          }
        }
      } else if (p.id === "nell") {
        const home = cast[0];
        walk(p, home.x, home.z, 0.012, dt);
      } else if (seats[p.id]) {
        const seat = seats[p.id];
        p.arrived = walk(p, seat[0], seat[1], 0.012, dt);
      }
    }
    const attendees = people.filter((p) => p.source && seats[p.id]);
    if (attendees.length && attendees.every((p) => p.arrived))
      phase = "concert";
  }
  function answer(p, kind) {
    if (kind === "other")
      return "Ask me about the show, or what’s keeping me busy.";
    if (kind === "work")
      return {
        nell: "Closing tabs before the first track.",
        kit: "Just finished a shoot down the block.",
        finn: "No more deliveries tonight.",
        ida: "I came straight from the studio.",
        silas: "Just enjoying a quiet drink.",
        lark: "I play for whoever stops to listen.",
      }[p.id];
    if (p.id === "lark")
      return kind === "source"
        ? "It’s my set. I brought the records."
        : "I’m here at the decks.";
    if (!p.source) return "What show?";
    if (kind === "source")
      return p.source === "you"
        ? "You did. Just a moment ago."
        : people.find((other) => other.id === p.source).name + " told me.";
    return "Over by the decks. Lark’s playing tonight.";
  }
  function publish() {
    onState({
      phase,
      time,
      people: people.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        x: p.x,
        z: p.z,
        partner: p.partner,
        recipient: p.friends[0] || "",
        learned: p.learned,
        walking: p.walking,
        walked: p.walked,
        source: p.source,
        arrived: p.arrived,
      })),
      speaker: time < until ? speaker : "",
      line: time < until ? line : "",
      question: time < until ? question : "",
    });
  }
  function act(action, payload = {}) {
    const person = people.find((p) => p.id === payload.person);
    if (action === "again") reset();
    if (
      action === "whisper" &&
      phase === "choose" &&
      person &&
      ["nell", "silas"].includes(person.id)
    ) {
      know(person, "you");
      phase = "spreading";
      speak(
        person.id,
        person.id === "nell"
          ? "A secret set? Kit needs to hear this."
          : "Just between us. I’ll be there.",
        2.5,
      );
    }
    if (action === "ask" && phase !== "choose" && person) {
      const prompts = {
        source: "Who told you about the show?",
        place: "Where is the concert?",
        work: "What are you up to?",
        other: "May I ask you something?",
      };
      const kind = ["source", "place", "work", "other"].includes(payload.kind)
        ? payload.kind
        : "other";
      question =
        typeof payload.question === "string"
          ? payload.question.slice(0, 120)
          : prompts[kind];
      speak(person.id, answer(person, kind), 3.8);
    }
    publish();
  }
  const interval = 1 / 15;
  reset();
  publish();
  return {
    interval,
    act,
    step() {
      if (phase !== "choose") {
        tick(interval);
        publish();
      }
    },
  };
}
