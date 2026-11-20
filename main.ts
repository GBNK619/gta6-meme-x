// THE PIGGY BANK — gta6-meme-x-01 entry program.
// The entry itself is a post on X: an original GTA 6 meme (the make.fun
// ghost topping up a piggy bank that grew a beard waiting since 2013).
// POST.json at the repository root names that post. This program's whole
// job is to hand the post in: read POST.json, make sure it really names
// an X post, and write it to the output directory for the gate to read.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`piggy-bank: ${message}`);
  process.exit(1);
}

const raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
let post: { url?: unknown };
try {
  post = JSON.parse(raw) as { url?: unknown };
} catch {
  fail('POST.json is not valid JSON');
}

// Share links copied out of X carry tracking parameters ("?s=46" and the
// like); the gate wants the post's plain address, so strip any query,
// fragment and trailing slash before validating and handing the post in.
const rawUrl = typeof post.url === 'string' ? post.url.trim() : '';
const url = rawUrl.split(/[?#]/)[0].replace(/\/+$/, '');
const postPattern = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;
if (!postPattern.test(url)) {
  fail(`POST.json does not name an X post: "${rawUrl}"`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'POST.json'), `${JSON.stringify({ url })}\n`);
console.log(`piggy-bank: handing in the post ${url}`);
