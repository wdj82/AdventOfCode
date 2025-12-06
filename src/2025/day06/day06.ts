// Advent of Code day 6
// https://adventofcode.com/2025/day/6

// import { rawInput } from "./rawInput";

const rawInput = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;

const lines = rawInput.split("\n");
console.log({ lines });

function solvePartOne() {
  const digits: number[][] = Array.from({ length: lines.length - 1 }, () => []);
  const operators: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let char = "";

    for (let j = 0; j < line.length; j++) {
      const currChar = line[j];
      const nextChar = line[j + 1] ?? " ";

      if (currChar !== " ") {
        char += currChar;
      }
      if (char.length > 0 && nextChar === " ") {
        if (i !== lines.length - 1) {
          digits[i].push(Number(char));
        } else {
          operators.push(char);
        }
        char = "";
        j += 1;
      }
    }
  }

  let grandTotal = 0;

  for (let i = 0; i < digits[0].length; i++) {
    const operator = operators[i];
    let total = operator === "+" ? 0 : 1;

    for (let j = 0; j < digits.length; j++) {
      const number = digits[j][i];
      if (operator === "+") {
        total += number;
      } else if (operator === "*") {
        total *= number;
      }
    }
    grandTotal += total;
  }

  return grandTotal;
}

function solvePartTwo() {
  let maxLength = lines[0].length;
  // in the example the last line is the longest. make sure we get the longest line
  for (let i = 1; i < lines.length - 1; i++) {
    maxLength = Math.max(maxLength, lines[i].length);
  }

  // find all the columns - made when every item in a column is a space
  const columns: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    if (lines[0][i] === " ") {
      let isColumn = true;
      for (let j = 0; j < lines.length; j++) {
        if (lines[j][i] !== " ") {
          isColumn = false;
          break;
        }
      }
      if (isColumn) {
        columns.push(i);
      }
    }
  }
  // add the end of the longest line for the last column
  columns.push(maxLength);

  // go down each column's digits to get the numbers
  // 123
  //  34
  //   1
  // becomes 1, 23, 341
  const digits: number[][] = [];
  let index = 0;
  let number = "";
  for (let j = 0; j < columns.length; j++) {
    let end = columns[j];
    while (index < end) {
      for (let i = 0; i < lines.length - 1; i++) {
        const char = lines[i][index] ?? "";

        if (char !== " ") {
          number += char;
        }
      }

      index += 1;
      (digits[j] ??= []).push(Number(number));
      number = "";
    }

    // skip the column divider
    index += 1;
  }

  // get all the operators
  const operators: string[] = [];
  const operatorLine = lines[lines.length - 1].trim();
  for (let i = 0; i < operatorLine.length; i++) {
    const char = operatorLine[i];
    if (char !== " ") {
      operators.push(char);
    }
  }

  let grandTotal = 0;
  for (let i = 0; i < digits.length; i++) {
    const operator = operators[i];
    let total = operator === "+" ? 0 : 1;

    for (let j = 0; j < digits[i].length; j++) {
      const number = digits[i][j];
      if (operator === "+") {
        total += number;
      } else if (operator === "*") {
        total *= number;
      }
    }
    grandTotal += total;
  }

  return grandTotal;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
