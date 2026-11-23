import http from "node:http";
import { readFile } from "node:fs/promises";

const model = process.env.MODEL_URL;
const port = Number(process.env.PORT || 19447);
const html = await readFile(new URL("./play.html", import.meta.url));
const kinds = ["source", "place", "work", "other"];
async function interpret(question) {
  const response = await fetch(new URL("/v1/chat/completions", model), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "Classify a question to a listening bar guest. Return one word. source = who told you, identity of informant, how you heard the news. place = location of the concert or musician. work = your job or current activity. other = unrelated.",
        },
        { role: "user", content: "Who passed you the invitation?" },
        { role: "assistant", content: "source" },
        { role: "user", content: "Where should I go to hear the music?" },
        { role: "assistant", content: "place" },
        { role: "user", content: question },
      ],
      grammar: 'root ::= "source" | "place" | "work" | "other"',
      temperature: 0,
      max_tokens: 5,
    }),
  });
  if (!response.ok) throw Error("Model unavailable");
  const kind = (await response.json()).choices?.[0]?.message?.content?.trim();
  if (!kinds.includes(kind)) throw Error("Unrecognized response");
  return kind;
}
http
  .createServer(async (req, res) => {
    const path = (req.url || "").split("?", 1)[0];
    const json = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };
    if (req.method === "GET" && path === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }
    if (req.method === "GET" && path === "/capabilities") {
      json(200, { freeText: Boolean(model) });
      return;
    }
    if (req.method === "GET" && path === "/favicon.ico") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method !== "POST" || path !== "/interpret") {
      json(404, {});
      return;
    }
    if (
      req.headers.origin &&
      req.headers.origin !== "http://" + req.headers.host
    ) {
      json(403, {});
      return;
    }
    if (!model) {
      json(503, {});
      return;
    }
    let body = "";
    try {
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 1024) {
          json(413, {});
          return;
        }
      }
      const q = JSON.parse(body).question;
      if (typeof q !== "string" || !q.trim() || q.length > 120) {
        json(400, {});
        return;
      }
      json(200, { kind: await interpret(q) });
    } catch {
      json(503, {});
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Side B is open at http://127.0.0.1:" + port),
  );
