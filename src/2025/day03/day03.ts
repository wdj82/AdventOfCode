// Advent of Code day 3
// https://adventofcode.com/2025/day/3

// import { rawInput } from "./rawInput";

const rawInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

const banks = rawInput.split("\n").map((line) => line.split(""));

function solvePartOne() {
  let total = 0;

  banks.forEach((bank) => {
    let max = 0;
    let maxFirstDigit = 0;

    for (let i = 0; i < bank.length - 1; i++) {
      let maxSecondDigit = 0;
      const currFirst = Number(bank[i]);
      if (currFirst <= maxFirstDigit) {
        continue;
      }

      maxFirstDigit = currFirst;
      for (let j = i + 1; j < bank.length; j++) {
        const currSecond = Number(bank[j]);
        if (currSecond <= maxSecondDigit) {
          continue;
        }

        maxSecondDigit = currSecond;
        const newMax = Number(maxFirstDigit.toString() + maxSecondDigit.toString());
        if (newMax > max) {
          max = newMax;
        }
      }
    }

    total += max;
  });

  return total;
}

// uses a monotonic stack to solve
function solvePartTwo() {
  let total = 0;
  const numOfBatteries = 12;

  banks.forEach((bank) => {
    let toRemove = bank.length - numOfBatteries;
    const stack: number[] = [];

    for (let i = 0; i < bank.length; i++) {
      const currBattery = Number(bank[i]);
      while (stack.length > 0 && toRemove > 0 && stack[stack.length - 1] < currBattery) {
        stack.pop();
        toRemove -= 1;
      }
      stack.push(currBattery);
    }

    total += Number(stack.slice(0, numOfBatteries).join(""));
  });

  return total;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
