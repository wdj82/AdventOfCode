// Advent of Code day 9
// https://adventofcode.com/2025/day/9

// import { rawInput } from "./rawInput";

const rawInput = `1,0
3,0
3,6
16,6
16,0
18,0
18,9
13,9
13,7
6,7
6,9
1,9`;

const tiles = rawInput.split("\n").map((line) => line.split(",").map(Number));

function solvePartOne() {
  let maxArea = 0;

  for (let i = 0; i < tiles.length - 1; i++) {
    const [x1, y1] = tiles[i];

    for (let j = i + 1; j < tiles.length; j++) {
      const [x2, y2] = tiles[j];

      const width = Math.abs(x2 - x1) + 1;
      const height = Math.abs(y2 - y1) + 1;
      const area = width * height;
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}

function buildCompressedGrid(tiles: number[][]) {
  const uniqueX = new Set<number>([0]);
  const uniqueY = new Set<number>([0]);

  for (const [x, y] of tiles) {
    uniqueX.add(x);
    uniqueY.add(y);
  }

  const maxX = Math.max(...Array.from(uniqueX));
  const maxY = Math.max(...Array.from(uniqueY));
  uniqueX.add(maxX + 1);
  uniqueY.add(maxY + 1);

  const sortedX = Array.from(uniqueX).sort((a, b) => a - b);
  const sortedY = Array.from(uniqueY).sort((a, b) => a - b);

  const xMap = new Map<number, number>();
  const yMap = new Map<number, number>();

  sortedX.forEach((x, i) => xMap.set(x, i));
  sortedY.forEach((y, i) => yMap.set(y, i));

  const grid: number[][] = Array(sortedX.length)
    .fill(0)
    .map(() => Array(sortedY.length).fill(0));

  // Mark edges
  for (let i = 0; i < tiles.length; i++) {
    const [x1, y1] = tiles[i];
    const [x2, y2] = tiles[(i + 1) % tiles.length];

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    if (y1 === y2) {
      // Horizontal edge
      const yIdx = yMap.get(y1)!;
      for (let xIdx = xMap.get(minX)!; xIdx <= xMap.get(maxX)!; xIdx++) {
        grid[xIdx][yIdx] = 1;
      }
    } else {
      // Vertical edge
      const xIdx = xMap.get(x1)!;
      for (let yIdx = yMap.get(minY)!; yIdx <= yMap.get(maxY)!; yIdx++) {
        grid[xIdx][yIdx] = 1;
      }
    }
  }

  // Flood fill from outside (0,0)
  const queue: [number, number][] = [[0, 0]];
  if (grid[0][0] === 0) {
    grid[0][0] = 2; // Mark as outside
  }

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;

    for (const [dx, dy] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length && grid[nx][ny] === 0) {
        grid[nx][ny] = 2; // Mark as outside
        queue.push([nx, ny]);
      }
    }
  }

  return { grid, xMap, yMap };
}

function isRectangleValid(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  grid: number[][],
  xMap: Map<number, number>,
  yMap: Map<number, number>,
): boolean {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  const minXIdx = xMap.get(minX)!;
  const maxXIdx = xMap.get(maxX)!;
  const minYIdx = yMap.get(minY)!;
  const maxYIdx = yMap.get(maxY)!;

  for (let xIdx = minXIdx; xIdx <= maxXIdx; xIdx++) {
    for (let yIdx = minYIdx; yIdx <= maxYIdx; yIdx++) {
      if (grid[xIdx][yIdx] === 2) {
        // If any cell is outside
        return false;
      }
    }
  }

  return true;
}

function solvePartTwo() {
  const { grid, xMap, yMap } = buildCompressedGrid(tiles);

  let maxArea = 0;
  for (let i = 0; i < tiles.length; i++) {
    const [x1, y1] = tiles[i];
    for (let j = i + 1; j < tiles.length; j++) {
      const [x2, y2] = tiles[j];

      if (x1 === x2 || y1 === y2) continue;

      if (isRectangleValid(x1, y1, x2, y2, grid, xMap, yMap)) {
        const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
}

type VerticalEdge = {
  x: number;
  y1: number;
  y2: number;
};

function buildVerticalEdges(tiles: number[][]): VerticalEdge[] {
  const edges: VerticalEdge[] = [];

  for (let i = 0; i < tiles.length; i++) {
    const [x1, y1] = tiles[i];
    const [x2, y2] = tiles[(i + 1) % tiles.length];

    if (x1 === x2) {
      edges.push({
        x: x1,
        y1: Math.min(y1, y2),
        y2: Math.max(y1, y2),
      });
    }
  }

  return edges;
}

function buildYSlabs(edges: VerticalEdge[]): number[] {
  const ys = new Set<number>();
  for (const e of edges) {
    ys.add(e.y1);
    ys.add(e.y2);
  }
  return Array.from(ys).sort((a, b) => a - b);
}

function interiorIntervalsAtY(y: number, edges: VerticalEdge[]): [number, number][] {
  const xs: number[] = [];

  for (const e of edges) {
    // half-open rule avoids corner double counting
    if (y >= e.y1 && y < e.y2) {
      xs.push(e.x);
    }
  }

  xs.sort((a, b) => a - b);

  const intervals: [number, number][] = [];
  for (let i = 0; i + 1 < xs.length; i += 2) {
    intervals.push([xs[i], xs[i + 1]]);
  }

  return intervals;
}

type Slab = {
  y1: number;
  y2: number;
  intervals: [number, number][];
};

function buildSlabs(edges: VerticalEdge[]): Slab[] {
  const ys = buildYSlabs(edges);
  const slabs: Slab[] = [];

  for (let i = 0; i + 1 < ys.length; i++) {
    const y1 = ys[i];
    const y2 = ys[i + 1];
    const midY = (y1 + y2) / 2;

    slabs.push({
      y1,
      y2,
      intervals: interiorIntervalsAtY(midY, edges),
    });
  }

  return slabs;
}

function rectangleValid(x1: number, y1: number, x2: number, y2: number, slabs: Slab[]): boolean {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  for (const slab of slabs) {
    if (slab.y2 <= minY || slab.y1 >= maxY) continue;

    let covered = false;
    for (const [a, b] of slab.intervals) {
      if (a <= minX && b >= maxX) {
        covered = true;
        break;
      }
    }

    if (!covered) return false;
  }

  return true;
}

function solvePartTwoVerticalSlices() {
  const edges = buildVerticalEdges(tiles);
  const slabs = buildSlabs(edges);

  let maxArea = 0;

  for (let i = 0; i < tiles.length - 1; i++) {
    const [x1, y1] = tiles[i];

    for (let j = i + 1; j < tiles.length; j++) {
      const [x2, y2] = tiles[j];
      if (x1 === x2 || y1 === y2) continue;

      if (rectangleValid(x1, y1, x2, y2, slabs)) {
        const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
        maxArea = Math.max(maxArea, area);
      }
    }
  }

  return maxArea;
}

const partOne = solvePartOne();
const partTwo = solvePartTwoVerticalSlices();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
