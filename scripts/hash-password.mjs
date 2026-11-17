#!/usr/bin/env node
// Prints the ADMIN_PASSWORD_HASH value for a password typed at the prompt (input is hidden).
// Usage: npm run hash-password
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';

const ITERATIONS = 100_000; // Maximum PBKDF2 iteration count the Workers runtime accepts.

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (text) => {
    if (text.startsWith(question)) rl.output.write(text);
  };
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    }),
  );
}

const password = process.env.ADMIN_PASSWORD ?? (await ask('Admin password: '));
if (password.length < 12) {
  console.error('Use at least 12 characters.');
  process.exit(1);
}
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
console.log(`pbkdf2-sha256$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`);
