// Advent of Code day 11
// https://adventofcode.com/2025/day/11

import { rawInput } from "./rawInput";

// const rawInput = `svr: aaa bbb
// aaa: fft
// fft: ccc
// bbb: tty
// tty: ccc
// ccc: ddd eee
// ddd: hub
// hub: fff
// eee: dac
// dac: fff
// fff: ggg hhh
// ggg: out
// hhh: out`;

const devices = new Map<string, string[]>();
rawInput
  .split("\n")
  .map((line) => line.split(": "))
  .forEach((device) => {
    devices.set(device[0], device[1].split(" "));
  });

// simple dfs with memoization
function solvePartOne() {
  const memo = new Map<string, number>();

  function dfs(node: string): number {
    if (node === "out") {
      return 1;
    }

    if (memo.has(node)) {
      return memo.get(node) ?? 0;
    }

    let total = 0;
    devices.get(node)?.forEach((nextNode) => {
      total += dfs(nextNode);
    });
    memo.set(node, total);
    return total;
  }

  return dfs("you");
}

function reverseGraph() {
  const rev = new Map<string, string[]>();
  devices.forEach((list, key) => {
    list.forEach((v) => {
      if (!rev.has(v)) {
        rev.set(v, []);
      }
      rev.get(v)!.push(key);
    });
  });
  return rev;
}

function computeReachable(start: string, graph: Map<string, string[]>) {
  const stack = [start];
  const seen = new Set([start]);

  while (stack.length > 0) {
    const node = stack.pop() ?? "";
    graph.get(node)?.forEach((next) => {
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    });
  }

  return seen;
}

function solvePartTwo() {
  const memo = new Map<string, number>();

  // calculate nodes that can reach out, dac, and fft from reverse
  const reverse = reverseGraph();
  const canReachOut = computeReachable("out", reverse);
  const canReachDAC = computeReachable("dac", reverse);
  const canReachFFT = computeReachable("fft", reverse);

  function dfs(node: string, hasDAC: boolean, hasFFT: boolean): number {
    if (node === "dac") hasDAC = true;
    if (node === "fft") hasFFT = true;

    // the node must be able to reach the end
    if (!canReachOut.has(node)) return 0;

    // prune if this node can never reach dac
    if (!hasDAC && !canReachDAC.has(node)) return 0;

    // prune if this node can never reach fft
    if (!hasFFT && !canReachFFT.has(node)) return 0;

    if (node === "out") {
      return hasDAC && hasFFT ? 1 : 0;
    }

    const key = `${node},${hasDAC},${hasFFT}`;

    if (memo.has(key)) {
      return memo.get(key)!;
    }

    let total = 0;
    devices.get(node)?.forEach((nextNode) => {
      total += dfs(nextNode, hasDAC, hasFFT);
    });

    memo.set(key, total);
    return total;
  }

  return dfs("svr", false, false);
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
