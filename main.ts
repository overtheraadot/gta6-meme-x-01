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
// `url`, and writes the exact same bytes into the output directory.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// It prints nothing on success and exits non-zero on any problem.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
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

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), raw!);
