// Advent of Code day 5
// https://adventofcode.com/2025/day/5

// import { rawInput } from "./rawInput";

const rawInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

const [rawRanges, rawInventory] = rawInput.split("\n\n").map((parts) => parts.split("\n"));

const ranges = rawRanges.map((range) => range.split("-").map(Number));
const inventory = rawInventory.map(Number);

function solvePartOne() {
  let count = 0;

  inventory.forEach((item) => {
    for (let i = 0; i < ranges.length; i++) {
      const [start, end] = ranges[i];
      if (item >= start && item <= end) {
        count += 1;
        break;
      }
    }
  });

  return count;
}

function solvePartTwo() {
  let totalRange = [ranges[0]];

  for (let j = 1; j < ranges.length; j++) {
    let [newStart, newEnd] = ranges[j];
    let isInserted = false;
    const merged: number[][] = [];

    for (let i = 0; i < totalRange.length; i++) {
      const [start, end] = totalRange[i];

      if (newEnd < start - 1) {
        // new range starts before current range - no overlap
        if (!isInserted) {
          merged.push([newStart, newEnd]);
          isInserted = true;
        }
        merged.push([start, end]);
      } else if (newStart > end + 1) {
        // new range starts after current range - no overlap
        merged.push([start, end]);
      } else {
        // ranges overlap or are adjacent - merge them
        newStart = Math.min(newStart, start);
        newEnd = Math.max(newEnd, end);
      }
    }

    if (!isInserted) {
      merged.push([newStart, newEnd]);
    }
    totalRange = merged;
  }

  let total = 0;
  totalRange.forEach(([start, end]) => {
    total += end - start + 1;
  });
  return total;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
