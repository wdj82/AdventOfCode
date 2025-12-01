// Advent of Code day 1
// https://adventofcode.com/2025/day/1

import { rawInput } from "./rawInput";

// const rawInput = `L68
// L30
// R48
// L5
// R60
// L55
// L1
// L99
// R14
// L82`;

const instructions = rawInput.split("\n").map((line) => ({ dir: line[0], rotations: Number(line.slice(1)) }));

function solvePartOne() {
  let count = 0;
  let dial = 50;

  instructions.forEach(({ dir, rotations }) => {
    dial = dir === "R" ? dial + rotations : dial - rotations;
    while (dial < 0) {
      dial += 100;
    }
    while (dial >= 100) {
      dial -= 100;
    }
    if (dial === 0) {
      count += 1;
    }
  });

  return count;
}

function solvePartTwo() {
  let count = 0;
  let dial = 50;

  instructions.forEach(({ dir, rotations }) => {
    for (let i = 0; i < rotations; i++) {
      dial = dir === "R" ? dial + 1 : dial - 1;
      if (dial < 0) dial = 99;
      if (dial > 99) dial = 0;
      if (dial === 0) count += 1;
    }
  });

  return count;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));

