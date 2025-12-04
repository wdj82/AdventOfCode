// Advent of Code day 2
// https://adventofcode.com/2025/day/2

// import { rawInput } from "./rawInput";

const rawInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

const ranges = rawInput.split(",").map((ranges) => ranges.split("-").map(Number));

function solvePartOne() {
  let count = 0;

  ranges.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      const currentId = i.toString();
      if (currentId.length % 2 !== 0) continue;
      const firstHalf = currentId.slice(0, currentId.length / 2);
      const secondHalf = currentId.slice(currentId.length / 2);
      if (firstHalf === secondHalf) {
        count += i;
      }
    }
  });

  return count;
}

function solvePartTwo() {
  let count = 0;

  ranges.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) {
      const currentId = i.toString();
      const doubled = currentId + currentId;
      const isWrongId = doubled.indexOf(currentId, 1) !== currentId.length;
      if (isWrongId) {
        count += i;
      }
    }
  });

  return count;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
