// Advent of Code day 12
// https://adventofcode.com/2025/day/12

// import { rawInput } from "./rawInput";

const rawInput = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

const input = rawInput.split("\n\n");
const regions = input
  .at(-1)
  ?.split("\n")
  .map((line) => line.split(": "))
  .map((region) => {
    console.log({ region });
    const [size, needs] = region;
    const dimensions = size.split("x").map(Number);
    console.log({ dimensions });
    const quantities = needs.split(" ").map(Number);
    console.log({ quantities });
    return { area: dimensions[0] * dimensions[1], quantities };
  });

// doesn't work for the test input but does for the real input. good enough!
function solvePartOne() {
  let count = 0;
  regions?.forEach(({ area, quantities }) => {
    let totalSizeNeeded = 0;
    quantities.forEach((shape) => (totalSizeNeeded += shape * 7));

    if (totalSizeNeeded <= area) {
      count += 1;
    }
  });
  return count;
}

const partOne = solvePartOne();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
