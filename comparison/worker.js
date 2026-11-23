import { prepare, branch, COUNT } from "./simulation.js";
let session;
self.onmessage = ({ data }) => {
  const { seed, hold, nonce } = data;
  try {
    if (!session || seed !== session.checkpoint.seed) {
      session = prepare(seed);
      const ranks = Array.from({ length: COUNT }, (_, id) =>
        branch(session, id, false),
      );
      ranks.sort(
        (a, b) => b.changed.length - a.changed.length || a.hold - b.hold,
      );
      session.ranks = ranks;
      const result = branch(session, hold ?? ranks[0].hold);
      self.postMessage(
        {
          nonce,
          seed,
          guests: session.checkpoint.guests.map(
            ({ id, name, rig, shirt, height }) => ({
              id,
              name,
              rig,
              shirt,
              height,
            }),
          ),
          manager: session.checkpoint.manager,
          original: session.original,
          ranks,
          result,
        },
        [result.frames.buffer],
      );
    } else {
      const result = branch(session, hold ?? session.ranks[0].hold);
      self.postMessage({ nonce, seed, result }, [result.frames.buffer]);
    }
  } catch (error) {
    self.postMessage({ nonce, error: error.message });
  }
};
