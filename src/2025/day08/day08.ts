// Advent of Code day 8
// https://adventofcode.com/2025/day/8

// import { rawInput } from "./rawInput";

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

const lights = rawInput.split("\n").map((line) => line.split(",").map(Number));

console.log({ lights });

type Point = { x: number; y: number; z: number };

function closestDistance(p1: number[], p2: number[]) {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
}

function insertSorted(
  array: { distance: number; p1: string; p2: string }[],
  value: { distance: number; p1: string; p2: string },
) {
  if (array.length === 0) {
    array.push(value);
    return;
  }

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (value.distance < array[mid].distance) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  array.splice(left, 0, value);
}

function findCircuit(circuits: string[][], point: string) {
  for (let i = 0; i < circuits.length; i++) {
    const circuit = circuits[i] ?? [];
    console.log({ circuit });
    if (circuit.includes(point)) {
      return { circuit, i, index: circuit.findIndex((c) => c === point) };
    }
  }
  throw new Error("not found");
}

function solvePartOne() {
  const distances: { distance: number; p1: string; p2: string }[] = [];
  const circuits = new Map<string, string[]>();
  const lightsMap: string[][] = [];

  for (let i = 0; i < lights.length - 1; i++) {
    const key1 = `${lights[i][0]},${lights[i][1]},${lights[i][2]}`;

    circuits.set(key1, []);
    lightsMap.push([key1]);

    for (let j = i + 1; j < lights.length; j++) {
      const key2 = `${lights[j][0]},${lights[j][1]},${lights[j][2]}`;
      const distance = closestDistance(lights[i], lights[j]);

      insertSorted(distances, { distance, p1: key1, p2: key2 });
    }
  }

  console.log(distances);
  console.log({ lightsMap });

  for (let i = 0; i < 10; i++) {
    const { p1, p2 } = distances[i];
    console.log(p1, " - ", p2);

    const { circuit: circuit1, i: index1, index: innerIndex1 } = findCircuit(lightsMap, p1);
    const { circuit: circuit2, i: index2, index: innerIndex2 } = findCircuit(lightsMap, p2);

    // const first = circuits.get(p1) ?? [];
    // const second = circuits.get(p2) ?? [];
    // console.log("connected 1: ", [...first]);
    // console.log("connected 2: ", [...second]);

    // if (!first.includes(p2)) {
    //   console.log("p1 and p2 are not connected - connecting");
    //   first.push(p2);
    //   circuits.set(p1, first);
    //   second.push(p1);
    //   circuits.set(p2, second);
    // }

    if (index1 === index2) {
      console.log("both already in the same circuit - do nothing");
      continue;
    }

    if (circuit1.length > 0 && circuit2.length > 0) {
      console.log("both are part of circuits - combining");
      lightsMap.splice(index1, 1);
      lightsMap.splice(index2, 1);
      lightsMap.push([...circuit1, ...circuit2]);
    } else if (circuit1.length === 0) {
      console.log("merge p1 to p2s circuit");
      lightsMap.splice(index1, 1);
      lightsMap[index2].push(...circuit1);
    } else {
      console.log("merge p2 to p1s circuit");
      lightsMap.splice(index2, 1);
      lightsMap[index1].push(...circuit2);
    }
  }

  console.log("lightsMap: ", lightsMap);
  console.log({ circuits });
  return 0;
}

function solvePartTwo() {
  return 0;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));

// 819,987,18 - 941,993,340
// 52,470,668 - 117,168,530
// 162,817,812 - 425,690,689 - 431,825,988 - 346,949,466
// 906,360,560 - 805,96,715 - 739,650,466 - 862,61,35 - 984,92,344
// 57,618,57
// 592,479,940
// 352,342,300
// 466,668,158
// 542,29,236
// 216,146,977
// 970,615,88
