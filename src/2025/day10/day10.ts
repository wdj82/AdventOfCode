// Advent of Code day 10
// https://adventofcode.com/2025/day/10

// import { rawInput } from "./rawInput";

const rawInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
// [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

const machines = rawInput.split("\n").map((line) => {
  const array = line.split(" ");
  const lights = array[0]
    .slice(1, -1)
    .split("")
    .map((c) => (c === "#" ? 1 : 0));
  const buttons = array.slice(1, -1).map((button) => button.slice(1, -1).split(",").map(Number));
  const joltage = array.at(-1)?.slice(1, -1).split(",").map(Number) ?? [0];
  return { lights, buttons, joltage };
});
console.log({ machines });

function gaussianEliminationGF2(matrix: number[][], target: number[]) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create augmented matrix [matrix | target]
  const augmented: number[][] = [];
  for (let i = 0; i < rows; i++) {
    augmented[i] = [...matrix[i], target[i]];
  }

  // Forward elimination to reduced row echelon form
  let pivotRow = 0;
  const pivotCols: number[] = [];

  for (let col = 0; col < cols; col++) {
    // Find pivot (a row with 1 in current column)
    let foundPivot = false;

    for (let row = pivotRow; row < rows; row++) {
      if (augmented[row][col] === 1) {
        // Swap rows
        [augmented[pivotRow], augmented[row]] = [augmented[row], augmented[pivotRow]];
        foundPivot = true;
        break;
      }
    }

    if (!foundPivot) {
      continue; // No pivot in this column, move to next
    }

    pivotCols.push(col);

    // Eliminate all other 1s in this column (both above and below)
    for (let row = 0; row < rows; row++) {
      if (row !== pivotRow && augmented[row][col] === 1) {
        // XOR this row with pivot row
        for (let c = 0; c <= cols; c++) {
          augmented[row][c] ^= augmented[pivotRow][c];
        }
      }
    }

    pivotRow++;
  }

  // Check for inconsistencies
  for (let row = 0; row < rows; row++) {
    let allZero = true;
    for (let col = 0; col < cols; col++) {
      if (augmented[row][col] === 1) {
        allZero = false;
        break;
      }
    }

    if (allZero && augmented[row][cols] === 1) {
      return { solution: null, freeVars: [] };
    }
  }

  // Identify free variables (columns without pivots)
  const freeVars: number[] = [];
  for (let col = 0; col < cols; col++) {
    if (!pivotCols.includes(col)) {
      freeVars.push(col);
    }
  }

  // Extract basic solution (all free vars = 0)
  const solution: number[] = new Array(cols).fill(0);

  for (let row = 0; row < rows; row++) {
    let leadingCol = -1;
    for (let col = 0; col < cols; col++) {
      if (augmented[row][col] === 1) {
        leadingCol = col;
        break;
      }
    }

    if (leadingCol !== -1) {
      solution[leadingCol] = augmented[row][cols];
    }
  }

  return { solution, freeVars };
}

function findMinimumSolution(augmented: number[][], cols: number, freeVars: number[]): number[] {
  if (freeVars.length === 0) {
    // No free variables, extract the unique solution
    const solution: number[] = new Array(cols).fill(0);
    for (let row = 0; row < augmented.length; row++) {
      let leadingCol = -1;
      for (let col = 0; col < cols; col++) {
        if (augmented[row][col] === 1) {
          leadingCol = col;
          break;
        }
      }
      if (leadingCol !== -1) {
        solution[leadingCol] = augmented[row][cols];
      }
    }
    return solution;
  }

  // Try all combinations of free variables
  const numCombinations = 1 << freeVars.length; // 2^n combinations
  let minSolution: number[] | null = null;
  let minPresses = Infinity;

  for (let combo = 0; combo < numCombinations; combo++) {
    const solution: number[] = new Array(cols).fill(0);

    // Set free variables based on current combination
    for (let i = 0; i < freeVars.length; i++) {
      solution[freeVars[i]] = (combo >> i) & 1;
    }

    // Calculate dependent variables
    for (let row = 0; row < augmented.length; row++) {
      let leadingCol = -1;
      for (let col = 0; col < cols; col++) {
        if (augmented[row][col] === 1) {
          leadingCol = col;
          break;
        }
      }

      if (leadingCol !== -1 && !freeVars.includes(leadingCol)) {
        // Calculate value based on free variables
        let value = augmented[row][cols];
        for (let col = leadingCol + 1; col < cols; col++) {
          if (augmented[row][col] === 1) {
            value ^= solution[col];
          }
        }
        solution[leadingCol] = value;
      }
    }

    // Count presses
    const presses = solution.reduce((sum, val) => sum + val, 0);
    if (presses < minPresses) {
      minPresses = presses;
      minSolution = solution;
    }
  }

  return minSolution!;
}

function solvePartOne() {
  let totalPresses = 0;

  machines.forEach((machine) => {
    const numLights = machine.lights.length;
    const numButtons = machine.buttons.length;

    const matrix: number[][] = [];
    for (let i = 0; i < numLights; i++) {
      matrix[i] = new Array(numButtons).fill(0);
    }

    for (let i = 0; i < numButtons; i++) {
      machine.buttons[i].forEach((light) => (matrix[light][i] = 1));
    }

    const result = gaussianEliminationGF2(matrix, machine.lights);

    if (result.solution === null) {
      throw new Error("no solution");
    }

    // If there are free variables, we need to search for minimum
    let finalSolution: number[];
    if (result.freeVars.length > 0) {
      // Re-do elimination to get augmented matrix for searching
      const rows = matrix.length;
      const cols = matrix[0].length;
      const augmented: number[][] = [];
      for (let i = 0; i < rows; i++) {
        augmented[i] = [...matrix[i], machine.lights[i]];
      }

      let pivotRow = 0;
      for (let col = 0; col < cols; col++) {
        let foundPivot = false;
        for (let row = pivotRow; row < rows; row++) {
          if (augmented[row][col] === 1) {
            [augmented[pivotRow], augmented[row]] = [augmented[row], augmented[pivotRow]];
            foundPivot = true;
            break;
          }
        }
        if (!foundPivot) continue;

        for (let row = 0; row < rows; row++) {
          if (row !== pivotRow && augmented[row][col] === 1) {
            for (let c = 0; c <= cols; c++) {
              augmented[row][c] ^= augmented[pivotRow][c];
            }
          }
        }
        pivotRow++;
      }

      finalSolution = findMinimumSolution(augmented, cols, result.freeVars);
    } else {
      finalSolution = result.solution;
    }

    const count = finalSolution.reduce((sum, val) => sum + val, 0);
    // console.log(`Machine: ${count} presses`);
    totalPresses += count;
  });

  return totalPresses;
}

function minJoltagePresses(buttons: number[][], target: number[]): number {
  const numberOfCounters = target.length;
  const numberOfButtons = buttons.length;

  // Build matrix (rows = counters, cols = buttons)
  const matrix: number[][] = Array.from({ length: numberOfCounters }, () => Array(numberOfButtons).fill(0));

  // strictBounds per button (like your strictBounds array)
  const strictBounds: number[] = new Array(numberOfButtons).fill(Infinity);

  for (let j = 0; j < numberOfButtons; j++) {
    const wiring = buttons[j];
    if (wiring !== undefined && wiring.length > 0) {
      for (const item of wiring) {
        if (item < numberOfCounters) {
          matrix[item][j] = 1;
          // a button cannot be pressed more than the smallest requirement it touches
          if (target[item] < strictBounds[j]) {
            strictBounds[j] = target[item];
          }
        }
      }
    } else {
      // buttons that touch no counters can never be pressed
      strictBounds[j] = 0;
    }
  }

  for (let j = 0; j < numberOfButtons; j++) {
    if (strictBounds[j] === Infinity) strictBounds[j] = 0;
  }

  // Now solve the restricted system using the same procedure as your class method:
  return solveRestrictedSystem(matrix, target.slice(), strictBounds, numberOfButtons, numberOfCounters);
}

function solveRestrictedSystem(
  matrix: number[][],
  target: number[],
  bounds: number[],
  numberOfColumns: number,
  numberOfRows: number,
): number {
  // make a copy to operate on
  const matrixCopy = matrix.map((row) => row.slice());
  const rhs = target.slice();

  const pivotColumnIndices: number[] = [];
  let pivotRow = 0;
  const columnToPivotRow = new Map<number, number>();

  // Gaussian elimination with normalization (matches your class code)
  for (let columnIndex = 0; columnIndex < numberOfColumns && pivotRow < numberOfRows; columnIndex++) {
    let rowSelection = pivotRow;
    while (rowSelection < numberOfRows && Math.abs(matrixCopy[rowSelection][columnIndex]) < 1e-9) {
      rowSelection++;
    }
    if (rowSelection === numberOfRows) continue;

    // swap selected row into pivotRow
    [matrixCopy[pivotRow], matrixCopy[rowSelection]] = [matrixCopy[rowSelection], matrixCopy[pivotRow]];
    [rhs[pivotRow], rhs[rowSelection]] = [rhs[rowSelection], rhs[pivotRow]];

    // normalize pivot row
    const pivotVal = matrixCopy[pivotRow][columnIndex];
    for (let j = columnIndex; j < numberOfColumns; j++) {
      matrixCopy[pivotRow][j] /= pivotVal;
    }
    rhs[pivotRow] /= pivotVal;

    // eliminate column entries in other rows
    for (let i = 0; i < numberOfRows; i++) {
      if (i !== pivotRow) {
        const factor = matrixCopy[i][columnIndex];
        if (Math.abs(factor) > 1e-9) {
          for (let j = columnIndex; j < numberOfColumns; j++) {
            matrixCopy[i][j] -= factor * matrixCopy[pivotRow][j];
          }
          rhs[i] -= factor * rhs[pivotRow];
        }
      }
    }

    pivotColumnIndices.push(columnIndex);
    columnToPivotRow.set(columnIndex, pivotRow);
    pivotRow++;
  }

  // collect free variables
  const freeVariables: number[] = [];
  const isPivot = new Set(pivotColumnIndices);
  for (let j = 0; j < numberOfColumns; j++) {
    if (!isPivot.has(j)) freeVariables.push(j);
  }

  // consistency check (if a zero row has non-zero RHS -> impossible)
  for (let i = pivotRow; i < numberOfRows; i++) {
    if (Math.abs(rhs[i]) > 1e-4) {
      return 0;
    }
  }

  let minimumPresses = Infinity;
  const currentSolution: number[] = new Array(numberOfColumns).fill(0);

  // DFS over free variables, with pruning by current cost
  const search = (freeVarListIdx: number, currentCost: number) => {
    if (currentCost >= minimumPresses) return;

    if (freeVarListIdx === freeVariables.length) {
      // Derive pivot variables by back-substitution (in reverse pivot order)
      let derivedCost = currentCost;
      let possible = true;

      for (let i = pivotColumnIndices.length - 1; i >= 0; i--) {
        const pivotColumnIndex = pivotColumnIndices[i];
        const pivotRowIndex = columnToPivotRow.get(pivotColumnIndex)!;

        // start with rhs value
        let derivedValue = rhs[pivotRowIndex];

        // subtract contributions from already-chosen variables to the right
        for (let j = pivotColumnIndex + 1; j < numberOfColumns; j++) {
          if (Math.abs(matrixCopy[pivotRowIndex][j]) > 1e-9) {
            derivedValue -= matrixCopy[pivotRowIndex][j] * currentSolution[j];
          }
        }

        // must be integer (within tolerance)
        if (Math.abs(derivedValue - Math.round(derivedValue)) > 1e-4) {
          possible = false;
          break;
        }
        derivedValue = Math.round(derivedValue);

        if (derivedValue < 0) {
          possible = false;
          break;
        }

        if (derivedValue > bounds[pivotColumnIndex]) {
          possible = false;
          break;
        }

        currentSolution[pivotColumnIndex] = derivedValue;
        derivedCost += derivedValue;
        if (derivedCost >= minimumPresses) {
          possible = false;
          break;
        }
      }

      if (possible) {
        minimumPresses = derivedCost;
      }
      return;
    }

    const freeVariableIndex = freeVariables[freeVarListIdx];
    const freeVariableBound = bounds[freeVariableIndex];

    // iterate free variable values 0..bound (same ordering as your working code)
    for (let val = 0; val <= freeVariableBound; val++) {
      currentSolution[freeVariableIndex] = val;
      search(freeVarListIdx + 1, currentCost + val);
    }
  };

  search(0, 0);
  return minimumPresses === Infinity ? 0 : minimumPresses;
}

function solvePartTwo() {
  let totalPresses = 0;

  machines.forEach((machine) => {
    const presses = minJoltagePresses(machine.buttons, machine.joltage);
    // console.log({ presses });
    totalPresses += presses;
  });

  return totalPresses;
}

const partOne = solvePartOne();
const partTwo = solvePartTwo();

document.getElementById("partOne")?.appendChild(document.createTextNode(partOne.toString()));
document.getElementById("partTwo")?.appendChild(document.createTextNode(partTwo.toString()));
