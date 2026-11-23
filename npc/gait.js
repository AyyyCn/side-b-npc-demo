// Total planted-foot travel over the source Walk_Brisk clip (two repeated gait cycles).
// All four full and reduced rigs retain this same metre-scaled locomotion animation.
export const WALK_DISTANCE = 3.393;
const clamp = (v, a, b) => Math.max(a, Math.min(v, b));
const turn = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
export function motionTrack(end, sample, startYaw) {
  const frames = [{ yaw: startYaw, weight: 0, travel: 0 }];
  let previous = sample(0);
  for (let tick = 1; tick <= Math.ceil(end) + 5; tick++) {
    const state = sample(tick),
      activity = sample(tick - 0.5),
      last = frames[tick - 1],
      dx = state.x - previous.x,
      dz = state.z - previous.z,
      d = Math.hypot(dx, dz);
    const want = d > 0.001 ? Math.atan2(dx, dz) : (activity.facing ?? last.yaw);
    const stride = activity.pushing ? 0.58 : 1;
    const weight = clamp((d * 10) / 0.72, 0, 1) * stride;
    frames.push({
      yaw: last.yaw + clamp(turn(last.yaw, want), -0.62, 0.62),
      weight: last.weight + clamp(weight - last.weight, -0.34, 0.34),
      travel: last.travel + d / stride,
    });
    previous = state;
  }
  return (time) => {
    const t = clamp(time, 0, frames.length - 1),
      i = Math.floor(t),
      a = frames[i],
      b = frames[Math.min(i + 1, frames.length - 1)],
      f = t - i;
    return {
      yaw: a.yaw + (b.yaw - a.yaw) * f,
      weight: a.weight + (b.weight - a.weight) * f,
      travel: a.travel + (b.travel - a.travel) * f,
    };
  };
}
export function sampleRig(actor, motion, tick) {
  for (const p of actor.pose) p.bone.quaternion.copy(p.original);
  actor.walk.weight = motion.weight;
  actor.idle.weight = 1 - motion.weight;
  actor.walk.time =
    ((motion.travel / (WALK_DISTANCE * actor.rigScale) + actor.phase) % 1) *
    actor.walk.getClip().duration;
  actor.idle.time =
    (tick / 10 + actor.phase * 4) % actor.idle.getClip().duration;
  actor.mixer.update(0);
  for (const p of actor.pose) p.original.copy(p.bone.quaternion);
}
