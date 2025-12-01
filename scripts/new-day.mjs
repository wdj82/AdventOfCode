#!/usr/bin/env node
import fs from "fs";
import path from "path";

const year = process.argv[2];
const day = process.argv[3];

if (!year || !day) {
  console.error("Usage: node scripts/new-day.mjs <year> <day>");
  process.exit(1);
}

const dayPadded = day.toString().padStart(2, "0");

const basePath = path.join("src", year, `day${dayPadded}`);
fs.mkdirSync(basePath, { recursive: true });

// index.html template
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AOC ${year} - Day ${dayPadded}</title>
  </head>

  <body style="background: #212121; color:white">
    <h1>
      Advent of Code ${year} -
      <a href="https://adventofcode.com/${year}/day/${parseInt(day)}" target="_blank" style="color: white"> Day ${parseInt(day)}</a>
    </h1>

    <h3>Part One: <span id="partOne"></span></h3>
    <h3>Part Two: <span id="partTwo"></span></h3>

    <script type="module" src="./day${dayPadded}.ts"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(basePath, "index.html"), html);

// main TS file template
const ts = `// Advent of Code day ${parseInt(day)}
// https://adventofcode.com/${year}/day/${parseInt(day)}

import { rawInput } from "./rawInput";

function solvePartOne() {
  return 0;
}

function solvePartTwo() {
  return 0;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
`;

fs.writeFileSync(path.join(basePath, `day${dayPadded}.ts`), ts);

// rawInput placeholder file
const raw = `export const rawInput = \`
\`;`;

fs.writeFileSync(path.join(basePath, "rawInput.ts"), raw);

console.log(`Created Advent of Code folder: src/${year}/day${dayPadded}`);
