#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "node:child_process";

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
const raw = `export const rawInput = \`\`;`;

fs.writeFileSync(path.join(basePath, "rawInput.ts"), raw);
console.log(`Created Advent of Code folder: src/${year}/day${dayPadded}`);

// update year html file with new day
const yearIndexFile = path.join("src", year, "index.html");

if (!fs.existsSync(yearIndexFile)) {
  console.log(`Year index.html not found for ${year}, creating a new one...`);

  const newYearHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Advent of Code ${year}</title> 
    <style>
      body {
        background: #2a2a2a;
        color: white;
      }
      a {
        color: white;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      li {
        margin: 16px;
      }
    </style>
  </head>
  <body>
    <h1><a href="https://adventofcode.com/${year}/" target="_blank">Advent of Code - ${year}</a></h1> 
    <ul>
      <li><a href="./day${dayPadded}/index.html">Day ${parseInt(day)}</a></li>
    </ul>
  </body>
</html>
`;
  fs.writeFileSync(yearIndexFile, newYearHtml, "utf8");
  console.log(`Created new year index.html at src/${year}/index.html`);
} else {
  let yearHtml = fs.readFileSync(yearIndexFile, "utf8");

  // Find closing </ul> tag to insert new day
  const ulCloseIndex = yearHtml.lastIndexOf("</ul>");
  if (ulCloseIndex === -1) {
    console.error("Could not find <ul> in year index.html");
    process.exit(1);
  }

  // Check if day already exists
  const dayLink = `./day${dayPadded}/index.html`;
  if (yearHtml.includes(dayLink)) {
    console.log(`Day ${day} already exists in year index.html`);
  } else {
    const newLi = `<li><a href="${dayLink}">Day ${day}</a></li>\n`;
    yearHtml = yearHtml.slice(0, ulCloseIndex) + newLi + yearHtml.slice(ulCloseIndex);
    fs.writeFileSync(yearIndexFile, yearHtml, "utf8");
    console.log(`Updated ${year}/index.html to include Day ${day}`);
  }
}

// format files
try {
  execSync('npx prettier --write "src/**/*.{js,ts,html}"', { stdio: "inherit" });
  console.log("Prettier finished formatting all files ✅");
} catch (err) {
  console.error("Prettier failed:", err);
}
