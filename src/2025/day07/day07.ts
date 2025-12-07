// Advent of Code day 7
// https://adventofcode.com/2025/day/7

// import { rawInput } from "./rawInput";

const rawInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

const grid = rawInput.split("\n").map((line) => line.split(""));

function findStart() {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "S") {
        return { x, y };
      }
    }
  }
  throw new Error("no start found");
}
const start = findStart();

function solvePartOne() {
  let splits = 0;
  let beams = [start];

  for (let i = 0; i < grid.length - 1; i++) {
    const newBeams: { x: number; y: number }[] = [];

    beams.forEach(({ x, y }) => {
      if (grid[x + 1][y] === "^") {
        splits += 1;
        const newBeam1 = { x: x + 1, y: y - 1 };
        const newBeam2 = { x: x + 1, y: y + 1 };
        if (!newBeams.find((beam) => beam.x === newBeam1.x && beam.y === newBeam1.y)) {
          newBeams.push(newBeam1);
        }
        if (!newBeams.find((beam) => beam.x === newBeam2.x && beam.y === newBeam2.y)) {
          newBeams.push(newBeam2);
        }
      } else {
        const newBeam = { x: x + 1, y };
        if (!newBeams.find((beam) => beam.x === newBeam.x && beam.y === newBeam.y)) {
          newBeams.push(newBeam);
        }
      }
    });
    beams = newBeams;
  }

  return splits;
}

// first solution - dfs with memoization - works but better solution below
// function solvePartTwo() {
//   const memo = new Map();
//   const stack: { x: number; y: number; state: number; children?: { x: number; y: number }[] }[] = [
//     { x: start.x, y: start.y, state: 0 },
//   ];

//   while (stack.length > 0) {
//     const beam = stack.pop()!;

//     const key = `${beam.x},${beam.y}`;
//     if (beam.state === 0 && memo.has(key)) {
//       continue;
//     }

//     if (beam.state === 0 && beam.x + 1 === grid.length) {
//       memo.set(key, 1);
//       continue;
//     }

//     if (beam.state === 0) {
//       const children = [];
//       if (grid[beam.x + 1][beam.y] === "^") {
//         children.push({ x: beam.x + 1, y: beam.y + 1 });
//         children.push({ x: beam.x + 1, y: beam.y - 1 });
//       } else {
//         children.push({ x: beam.x + 1, y: beam.y });
//       }

//       stack.push({ x: beam.x, y: beam.y, state: 1, children });
//       children.forEach((c) => stack.push({ x: c.x, y: c.y, state: 0 }));
//     } else {
//       // we've done this node before and have it's children
//       let total = 0;
//       beam.children?.forEach((c) => {
//         total += memo.get(`${c.x},${c.y}`);
//       });
//       memo.set(key, total);
//     }
//   }

//   return memo.get(`${start.x},${start.y}`);
// }

// going from bottom up using dynamic programming
function solvePartTwo() {
  const rows = grid.length;
  const cols = grid[0].length;
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  // every position in the bottom row is a valid end of path
  for (let i = 0; i < cols; i++) {
    dp[rows - 1][i] = 1;
  }

  // going from bottom up calculate the the row based on the prev row already calculated
  // if the cell below is a splitter the cell adds the two cells below it: dp[x][y] = dp[x+1][y-1] + dp[x+1][y+1]
  // otherwise the cell is the same as the one below: dp[x][y] = dp[x+1][y]
  for (let x = rows - 2; x >= 0; x--) {
    for (let y = 0; y < cols; y++) {
      if (grid[x + 1][y] === "^") {
        let total = 0;
        total += dp[x + 1][y - 1];
        total += dp[x + 1][y + 1];
        dp[x][y] = total;
      } else {
        dp[x][y] = dp[x + 1][y];
      }
    }
  }

  // the whole dp grid is how many paths to the bottom are there at every point
  // get the one for the start location
  return dp[start.x][start.y];
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
