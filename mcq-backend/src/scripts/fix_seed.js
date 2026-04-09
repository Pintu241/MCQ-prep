import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetFile = join(__dirname, "../utils/seed.js");

const content = readFileSync(targetFile, "utf8");
const lines = content.split("\n");

// Line 202 (0-indexed) is the broken line 203 (1-indexed)
console.log("Broken line:", lines[202].slice(0, 80), "...");

// Replace with clean content
lines[202] =
  '      { question: "How many permutations does n-factorial represent?", options: ["n + (n-1)", "n * (n-1) * ... * 1", "n ^ n", "2 ^ n"], correct: 1, explanation: "n! counts all ordered arrangements of n items.", topic: "Combinatorics", difficulty: "Easy" },';

writeFileSync(targetFile, lines.join("\n"), "utf8");
console.log("Fixed! New line:", lines[202].slice(0, 80), "...");
