// Validates every spider-society/*.json and *.html before a PR is merged.
// Run locally with: node scripts/validate.mjs
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "spider-society");
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const errors = [];
const jsonUsers = new Map(); // username -> filename
const htmlUsers = new Map(); // username -> filename

// ── JSON identity records ───────────────────────────────────────────────
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  if (file.startsWith("_")) continue;
  const fail = (msg) => errors.push(`${file}: ${msg}`);
  let data;

  try {
    data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
  } catch (e) {
    fail(`invalid JSON — ${e.message}`);
    continue;
  }

  for (const key of ["name", "alias", "githubUsername"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) fail(`"${key}" must be a non-empty string`);
  }
  if (!Array.isArray(data.skills) || data.skills.length !== 3) {
    fail(`"skills" must be an array of exactly 3 strings`);
  } else if (!data.skills.every((s) => typeof s === "string" && s.trim())) {
    fail(`"skills" entries must be non-empty strings`);
  }
  if (typeof data.suitColor !== "string" || !HEX.test(data.suitColor)) {
    fail(`"suitColor" must be a hex code like "#FF1B4C"`);
  }
  const placeholderVals = ["Your Name", "Your Spider-Alias", "your-github-username"];
  for (const key of ["name", "alias", "githubUsername"]) {
    if (placeholderVals.includes(data[key])) {
      fail(`"${key}" is still the template placeholder — put your own details in`);
    }
  }

  const user = String(data.githubUsername ?? "").toLowerCase();
  if (user) {
    if (jsonUsers.has(user)) fail(`duplicate githubUsername — already claimed in ${jsonUsers.get(user)}`);
    else jsonUsers.set(user, file);
    const expected = `${user}.json`;
    if (file.toLowerCase() !== expected) {
      fail(`file should be named "${expected}" to match githubUsername`);
    }
  }
}

// ── Hand-woven HTML cards ────────────────────────────────────────────────
const MAX_BYTES = 30_000;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  if (file.startsWith("_")) continue;
  const fail = (msg) => errors.push(`${file}: ${msg}`);
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  // Scan the markup only — the template's own instructions mention <script>,
  // and a comment saying "no script tags" is not a script tag.
  const body = raw.replace(/<!--[\s\S]*?-->/g, "");

  if (Buffer.byteLength(raw) > MAX_BYTES) {
    fail(`card is over ${MAX_BYTES / 1000}KB — trim it down`);
  }
  if (/<script/i.test(body)) {
    fail("contains a <script> tag — cards are HTML and CSS only");
  }
  if (/\son\w+\s*=/i.test(body)) {
    fail("contains an inline event handler (onclick=, onload=, ...) — not allowed");
  }
  if (/<iframe/i.test(body)) {
    fail("contains an <iframe> — not allowed");
  }
  if (!/<style[\s>]/i.test(body)) {
    fail("has no <style> block — the CSS must be internal, inside the card");
  }

  const attr = (name) => {
    const m = body.match(new RegExp(`data-${name}\\s*=\\s*["']([^"']*)["']`, "i"));
    return m ? m[1].trim() : "";
  };
  for (const key of ["name", "alias", "github"]) {
    if (!attr(key)) fail(`missing data-${key}="..." on the card element`);
  }
  const placeholders = ["Your Name", "Your Spider-Alias", "your-github-username"];
  for (const key of ["name", "alias", "github"]) {
    if (placeholders.includes(attr(key))) {
      fail(`data-${key} is still the template placeholder — put your own details in`);
    }
  }

  const user = attr("github").toLowerCase().replace(/^@/, "");
  if (user) {
    const expected = `${user}.html`;
    if (file.toLowerCase() !== expected) {
      fail(`file should be named "${expected}" to match data-github`);
    }
    if (htmlUsers.has(user)) fail(`duplicate card — already claimed in ${htmlUsers.get(user)}`);
    else htmlUsers.set(user, file);
  }
}

// ── Cross-check: Chapter 2 asks for BOTH a .json identity record and an
// .html card. Act II (Ch 6-9) opens "your json file" by name — a student
// with only an .html file hits a missing-file wall mid-afternoon. ────────
for (const [user, htmlFile] of htmlUsers) {
  if (!jsonUsers.has(user)) {
    errors.push(
      `${htmlFile}: found an HTML card for "${user}" but no matching ${user}.json — Chapter 2 asks for both (the JSON is your identity record, the HTML is your suit).`,
    );
  }
}

if (errors.length) {
  console.error("\n❌ Spider-ID validation failed:\n");
  for (const e of errors) console.error("  • " + e);
  console.error("");
  process.exit(1);
}
const total = new Set([...jsonUsers.keys(), ...htmlUsers.keys()]).size;
console.log(`✅ ${total} Spider-ID(s) validated.`);
