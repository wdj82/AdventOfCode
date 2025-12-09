// Advent of Code day 8
// https://adventofcode.com/2025/day/8

// import { rawInput } from "./rawInput";

const PART_ONE_NUM_OF_CONNECTIONS = 10; // is 1000 for the real input
const rawInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

const junctions = rawInput.split("\n").map((line) => line.split(",").map(Number));

function closestDistance(p1: number[], p2: number[]) {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
}

function findCircuit(circuits: string[][], point1: string, point2: string) {
  let circuit1: string[] = [];
  let circuit2: string[] = [];
  let index1 = 0;
  let index2 = 0;

  for (let i = 0; i < circuits.length; i++) {
    const circuit = circuits[i] ?? [];

    if (circuit.includes(point1)) {
      circuit1 = circuit;
      index1 = i;
    } else if (circuit.includes(point2)) {
      circuit2 = circuit;
      index2 = i;
    }

    if (circuit1.length > 0 && circuit2.length > 0) break;
  }

  return { circuit1, circuit2, index1, index2 };
}

function solvePartOne() {
  const distances: { distance: number; p1: string; p2: string }[] = [];
  let circuits: string[][] = [];

  // all the junctions start on their own circuits
  for (let i = 0; i < junctions.length; i++) {
    const key = `${junctions[i][0]},${junctions[i][1]},${junctions[i][2]}`;
    circuits.push([key]);
  }

  // find all the paths from each junction box to every other junction box
  for (let i = 0; i < junctions.length - 1; i++) {
    const key1 = `${junctions[i][0]},${junctions[i][1]},${junctions[i][2]}`;

    for (let j = i + 1; j < junctions.length; j++) {
      const key2 = `${junctions[j][0]},${junctions[j][1]},${junctions[j][2]}`;
      const distance = closestDistance(junctions[i], junctions[j]);

      distances.push({ distance, p1: key1, p2: key2 });
    }
  }
  // sort so we start with the shortest distance
  distances.sort((a, b) => a.distance - b.distance);

  // combine junctions into circuits starting with the closest
  for (let i = 0; i < PART_ONE_NUM_OF_CONNECTIONS; i++) {
    const { p1, p2 } = distances[i];

    const { circuit1, circuit2, index1, index2 } = findCircuit(circuits, p1, p2);

    if (index1 === index2) {
      // both already in the same circuit - do nothing
      continue;
    }

    // remove the two circuits that are about to be combined
    circuits = circuits.filter((value) => !value.includes(p1) && !value.includes(p2));
    // combine the two circuits into a new circuit
    circuits.push([...circuit1, ...circuit2]);
  }

  // find the three biggest circuits
  let max1 = 0;
  let max2 = 0;
  let max3 = 0;

  circuits.forEach((lights) => {
    const length = lights.length;
    if (length > max1) {
      max3 = max2;
      max2 = max1;
      max1 = length;
    } else if (length > max2) {
      max3 = max2;
      max2 = length;
    } else if (length > max3) {
      max3 = length;
    }
  });

  return max1 * max2 * max3;
}

function solvePartTwo() {
  const distances: { distance: number; p1: string; p2: string }[] = [];
  let circuits: string[][] = [];

  for (let i = 0; i < junctions.length; i++) {
    const key = `${junctions[i][0]},${junctions[i][1]},${junctions[i][2]}`;
    circuits.push([key]);
  }

  for (let i = 0; i < junctions.length - 1; i++) {
    const key1 = `${junctions[i][0]},${junctions[i][1]},${junctions[i][2]}`;

    for (let j = i + 1; j < junctions.length; j++) {
      const key2 = `${junctions[j][0]},${junctions[j][1]},${junctions[j][2]}`;
      const distance = closestDistance(junctions[i], junctions[j]);

      distances.push({ distance, p1: key1, p2: key2 });
    }
  }
  distances.sort((a, b) => a.distance - b.distance);

  // combine junctions until there's only one circuit starting with the closest
  let i = 0;
  while (circuits.length > 1) {
    const { p1, p2 } = distances[i];
    const { circuit1, circuit2, index1, index2 } = findCircuit(circuits, p1, p2);

    if (index1 === index2) {
      continue;
    }

    circuits = circuits.filter((value) => !value.includes(p1) && !value.includes(p2));
    circuits.push([...circuit1, ...circuit2]);

    i++;
  }

  const { p1, p2 } = distances[i - 1];
  return Number(p1.split(",")[0]) * Number(p2.split(",")[0]);
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
