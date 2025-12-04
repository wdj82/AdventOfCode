// Advent of Code day 4
// https://adventofcode.com/2025/day/4

// import { rawInput } from "./rawInput";

const rawInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

const positions = [
  { dx: -1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: -1, dy: 1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 1 },
];

function getAdjacentCount(x: number, y: number, grid: string[][]) {
  let count = 0;

  positions.forEach(({ dx, dy }) => {
    const newX = x + dx;
    const newY = y + dy;
    if (newX < 0 || newY < 0 || newX >= grid.length || newY >= grid[0].length) {
      return;
    }
    if (grid[newX][newY] === "@") {
      count += 1;
    }
  });

  return count;
}

function solvePartOne() {
  const grid = rawInput.split("\n").map((rows) => rows.split(""));
  let total = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "@") {
        const count = getAdjacentCount(i, j, grid);
        if (count < 4) {
          total += 1;
        }
      }
    }
  }

  return total;
}

function getPapersToRemove(grid: string[][]) {
  const papersToRemove: { x: number; y: number }[] = [];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      if (grid[x][y] === "@") {
        const count = getAdjacentCount(x, y, grid);

        if (count < 4) {
          papersToRemove.push({ x, y });
        }
      }
    }
  }

  return papersToRemove;
}

function solvePartTwo() {
  const grid = rawInput.split("\n").map((rows) => rows.split(""));
  let total = 0;
  let papersToRemove = getPapersToRemove(grid);

  while (papersToRemove.length > 0) {
    total += papersToRemove.length;

    // remove each paper from the grid that has fewer than four adjacent rolls of paper
    papersToRemove.forEach(({ x, y }) => (grid[x][y] = "."));

    // get the nex batch of papers that can be removed
    papersToRemove = getPapersToRemove(grid);
  }

  return total;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
