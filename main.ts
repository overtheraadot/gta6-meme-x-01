// gta6-meme-x-01 entry — account A (overtheraa).
//
// The entry itself is the X post named in POST.json: a GTA 6 meme drawn by
// this agent ("The 13-year wait"), posted from a public X account with the
// make.fun ghost in the picture and the play code in the post text. The
// house reads that post from X and hands its first picture plus its text
// to the judge. Nothing this program writes is judged.
//
// So all this program has to do is hand POST.json to the grader: it reads
// the file from the bot directory, checks it is a JSON object with a string
// `url` that names a real X post, and writes the exact same bytes into the
// output directory.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// It prints nothing on success and exits non-zero on any problem.
// Run with --help for usage.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const USAGE = `gta6-meme-x-01 — hand POST.json to the grader

usage:
  MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts [--help]

environment:
  MAKEFUN_BOT_DIR      directory holding POST.json (default: /bot)
  MAKEFUN_OUTPUT_DIR   directory to write POST.json into (default: /output)

POST.json must be a JSON object with a string "url" naming the X post, e.g.
  {"url": "https://x.com/<handle>/status/<id>"}
`;

if (process.argv.slice(2).includes("--help")) {
  process.stdout.write(USAGE);
  process.exit(0);
}

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

// A post URL must be an https link to a single X post:
//   https://x.com/<handle>/status/<id>
// (twitter.com is accepted too.) The <handle>/<id> placeholders in
// POST.json are allowed while the post does not exist yet; anything else
// that is not a well-formed post URL is rejected with the expected form.
function validatePostUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail(
      `POST.json url is not a valid URL: ${JSON.stringify(url)} ` +
        `(expected https://x.com/<handle>/status/<id>)`,
    );
  }
  if (parsed!.protocol !== "https:") {
    fail(
      `POST.json url must use https: ${JSON.stringify(url)} ` +
        `(expected https://x.com/<handle>/status/<id>)`,
    );
  }
  const host = parsed!.hostname.replace(/^www\./, "");
  if (host !== "x.com" && host !== "twitter.com") {
    fail(
      `POST.json url must point at x.com (or twitter.com): ${JSON.stringify(url)} ` +
        `(expected https://x.com/<handle>/status/<id>)`,
    );
  }
  const match = /^\/([^/]+)\/status\/([^/]+)$/.exec(parsed!.pathname);
  if (!match) {
    fail(
      `POST.json url must name one post: ${JSON.stringify(url)} ` +
        `(expected https://x.com/<handle>/status/<id>)`,
    );
  }
  const [, handle, id] = match as [string, string, string];
  const handleOk = handle === "%3Chandle%3E" || /^[A-Za-z0-9_]{1,15}$/.test(handle);
  const idOk = id === "%3Cid%3E" || /^\d+$/.test(id);
  if (!handleOk || !idOk) {
    fail(
      `POST.json url must name one post: ${JSON.stringify(url)} ` +
        `(expected https://x.com/<handle>/status/<id>)`,
    );
  }
}

const sourcePath = resolve(join(botDir, "POST.json"));
let raw: string;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch (err) {
  fail(`could not read ${sourcePath}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw!);
} catch (err) {
  fail(`POST.json is not valid JSON: ${(err as Error).message}`);
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  fail("POST.json must be a JSON object");
}
const url = (parsed as { url?: unknown }).url;
if (typeof url !== "string" || url.length === 0) {
  fail("POST.json must name the post in a string field called url");
}
validatePostUrl(url);

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "POST.json");
writeFileSync(outPath, raw!);

// Confirm the output directory really holds the file, byte-identical.
let written: string;
try {
  written = readFileSync(outPath, "utf8");
} catch (err) {
  fail(`could not read back ${outPath}: ${(err as Error).message}`);
}
if (written! !== raw!) {
  fail(`${outPath} does not match POST.json after writing`);
}
try {
  if (!statSync(outDir).isDirectory()) fail(`${outDir} is not a directory`);
} catch {
  fail(`output directory ${outDir} was not created`);
}
