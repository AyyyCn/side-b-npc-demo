import {
  crew,
  makeJobs,
  readForecast,
  DOORS,
  skillName,
  SECOND_ZONE_AT,
} from "./scenario.js";
import {
  initialPlan,
  recover,
  memberState,
  rackAt,
  checkpoint,
  jobAt,
} from "./planner.js";
import { simulate, stations } from "../perception/search.js";
import { crewView } from "./view.js";
import { timeline, el, stamp, setText } from "../npc/timeline.js";
const params = new URLSearchParams(location.search),
  forecast = readForecast(params);
const archiveMode = params.get("archive");
const bin = stations.find((s) => s.id === params.get("bin")) ?? stations[2];
const archive = ["open", "closed"].includes(archiveMode)
  ? simulate(archiveMode === "closed", bin.id)
  : null;
let run = params.get("run") === "altered" ? "altered" : "original",
  base,
  plan,
  kept,
  view,
  uiKey = "",
  trackKey = "";
function setup() {
  base = initialPlan(makeJobs(forecast[run], archive?.end ?? 0));
  plan = base;
  kept = null;
  uiKey = trackKey = "";
}
setup();
setText("lab-title", "Crew coordination");
setText(
  "premise",
  "Call a stagehand on the radio mid-transfer. Can the crew still open the doors on time?",
);
setText("experiment", "The opening cue");
const related = el("related");
related.hidden = false;
related.href = "?crowd&seed=" + forecast.seed + "&hold=" + forecast.hold;
related.textContent = "See the crowd that booked this hall ↗";
el("fields").innerHTML =
  '<label>Audience<select id="attendance"><option value="original">Original crowd · ' +
  forecast.original +
  '</option><option value="altered">Interrupted crowd · ' +
  forecast.altered +
  '</option></select></label><label>Radio recipient<select id="who">' +
  crew
    .map(
      (m) =>
        '<option value="' +
        m.id +
        '">' +
        m.name +
        " · " +
        m.title +
        "</option>",
    )
    .join("") +
  '</select></label><label>Absence<select id="duration"><option value="60">6 seconds</option><option value="120" selected>12 seconds</option><option value="200">20 seconds</option></select></label>';
el("attendance").value = run;
el("who").value = 1;
el("actions").innerHTML =
  '<button id="apply" class="main-action">Make radio call</button><button id="restore">Reset plan</button>';
el("under").innerHTML =
  '<h3>Crew schedule</h3><div id="gantt"></div><p class="proof-note">Solid bars show assigned work. Stripes mark the absence. The line follows the replay.</p>';
el("details").innerHTML =
  '<h3 id="decision-title">Current work</h3><p class="notes" id="decision"></p><p class="proof-note" id="order"></p><p class="proof-note interactive"><a id="to-archive">Open the record search ↗</a></p>';
const teamNames = (e) => e.team.map((i) => crew[i].name).join(" and ");
const limit = () => Math.max(DOORS, plan.end, kept?.end ?? 0);
const timer = timeline({ initial: checkpoint(base), limit, draw, describe });
function reset() {
  setup();
  timer.jump(checkpoint(base));
}
el("attendance").onchange = (e) => {
  run = e.target.value;
  reset();
};
el("restore").onclick = reset;
el("who").onchange = el("duration").onchange = () => {
  if (plan.incident) reset();
  else timer.paint();
};
el("apply").onclick = () => {
  const t = Math.floor(timer.tick);
  if (t >= base.end || plan.incident) return;
  const absent = Number(el("who").value),
    duration = Number(el("duration").value);
  plan = recover(base, t, absent, duration);
  kept = recover(base, t, absent, duration, { keepTeams: true });
  uiKey = trackKey = "";
  timer.jump(t, true);
};
function describe(t) {
  const rack = jobAt(plan, "rack", t),
    incident = plan.incident;
  return {
    mode: "crew",
    recordReady: archive?.end ?? 0,
    audience: forecast[run],
    run,
    seed: forecast.seed,
    doors: DOORS,
    baseEnd: base.end,
    finish: plan.end,
    keptTeamsEnd: kept?.end ?? null,
    incident: incident ?? null,
    rack: {
      position: rackAt(plan, t),
      worked: rack.worked,
      total: rack.total,
      team: rack.current ? teamNames(rack.current) : null,
    },
    jobs: plan.jobs.map((j) => j.id),
    assignments: plan.entries.map((e) => ({
      id: e.job.id,
      team: teamNames(e),
      start: e.start,
      end: e.end,
    })),
    crew: crew.map((m) => {
      const p = memberState(plan, m.id, t);
      return {
        name: m.name,
        x: p.x,
        z: p.z,
        activity: p.kind,
        skills: m.skills,
      };
    }),
  };
}
function draw(t) {
  view(plan, t);
  const incident = plan.incident,
    rack = jobAt(plan, "rack", t),
    pct = Math.round((100 * rack.worked) / rack.total);
  const active = plan.entries.filter((e) => e.start <= t && t < e.end);
  const status =
    t >= plan.end
      ? "Opening cue complete"
      : rack.current
        ? teamNames(rack.current) + " move the PA rack"
        : !rack.done && pct > 0
          ? "PA rack parked at " + pct + "%"
          : active.length
            ? active.map((e) => e.job.short).join("  ·  ")
            : "Crew moving into position";
  setText("scene-caption", status);
  el("apply").disabled = Boolean(incident) || Math.floor(t) >= base.end;
  const key =
    run +
    "/" +
    (incident
      ? [incident.t, incident.absent, incident.until].join("-")
      : "base");
  if (key !== uiKey) {
    uiKey = key;
    const pair = incident
      ? [
          [stamp(kept.end), "Keep original teams"],
          [stamp(plan.end), "Reassign the crew"],
        ]
      : [
          [stamp(base.end), "Planned opening cue"],
          [stamp(DOORS), "Doors open"],
        ];
    el("result").innerHTML =
      '<div class="metrics">' +
      pair
        .map(
          ([v, s]) =>
            '<div class="metric"><strong>' +
            v +
            "</strong><span>" +
            s +
            "</span></div>",
        )
        .join("") +
      "</div><p>" +
      (incident
        ? plan.end <= DOORS
          ? "Replanned crew makes doors by " + stamp(DOORS - plan.end) + "."
          : "Opening runs " + stamp(plan.end - DOORS) + " past doors."
        : "Doors are set for " +
          stamp(DOORS) +
          ". Each job needs the right skills and a crew member on site.") +
      "</p>";
    el("to-archive").href =
      "?perception&seed=" +
      forecast.seed +
      "&hold=" +
      forecast.hold +
      "&run=" +
      run +
      "&screen=" +
      (archiveMode ?? "closed") +
      "&bin=" +
      bin.id;
    setText(
      "order",
      forecast[run] +
        " guests in East Hall. " +
        (forecast[run] >= SECOND_ZONE_AT
          ? "The work order includes a second speaker zone."
          : "One speaker zone covers this audience.") +
        (archive
          ? " The reference sleeve arrives from " +
            bin.name +
            " at " +
            stamp(archive.end) +
            " for the main sound check."
          : ""),
    );
    setText("decision-title", incident ? "Handoff" : "On the clock");
    if (incident) {
      const person = crew[incident.absent],
        during = base.entries.find(
          (e) =>
            e.team.includes(person.id) &&
            e.start <= incident.t &&
            incident.t < e.end,
        );
      if (during) {
        const next = plan.entries.find(
          (e) =>
            e.job.id === during.job.id &&
            !e.interrupted &&
            e.start >= incident.t,
        );
        const percent = Math.round(
          ((incident.t - during.start) / (during.end - during.start)) * 100,
        );
        setText(
          "decision",
          person.name +
            " answers the radio at " +
            stamp(incident.t) +
            ". " +
            (during.job.id === "rack"
              ? "The rack is " + percent + "% across the stage. "
              : during.job.name + " is " + percent + "% complete. ") +
            teamNames(next) +
            " " +
            (next.team.length === 1 ? "resumes" : "resume") +
            " at " +
            stamp(next.start) +
            "." +
            (during.job.id === "rack"
              ? " Both are trained rack handlers."
              : ""),
        );
      } else
        setText(
          "decision",
          person.name +
            " is unavailable from " +
            stamp(incident.t) +
            " to " +
            stamp(incident.until) +
            ". The planner schedules the remaining work from each person’s current position.",
        );
    } else {
      const originalRack = base.entries.find((e) => e.job.id === "rack"),
        power = base.entries.find((e) => e.job.id === "feed");
      setText(
        "decision",
        teamNames(originalRack) +
          " move the rack. " +
          teamNames(power) +
          " sets up power. Interrupt one crew member to compare the two schedules.",
      );
    }
  }
  const selected = Number(el("who").value);
  el("who").title = crew[selected].skills.map((k) => skillName[k]).join(", ");
  if (trackKey !== key) {
    trackKey = key;
    el("gantt").innerHTML = crew
      .map(
        (m, i) =>
          '<div class="report-row"><b>' +
          m.name +
          '</b><div class="work-track">' +
          plan.tracks[i]
            .filter((p) => p.kind === "work" || p.kind === "away")
            .map(
              (p) =>
                '<i class="' +
                p.kind +
                '" style="left:' +
                (100 * p.start) / limit() +
                "%;width:" +
                (100 * (p.end - p.start)) / limit() +
                '%" title="' +
                (p.kind === "away"
                  ? "Called away"
                  : plan.jobs.find((j) => j.id === p.task).name) +
                " · " +
                stamp(p.start) +
                " to " +
                stamp(p.end) +
                '"></i>',
            )
            .join("") +
          "<em></em></div></div>",
      )
      .join("");
  }
  for (const line of el("gantt").querySelectorAll("em"))
    line.style.left = (t / limit()) * 100 + "%";
}
crewView(el("world"))
  .then((v) => {
    view = v;
    timer.open();
  })
  .catch(timer.fail);
