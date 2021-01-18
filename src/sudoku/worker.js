import { Sudoku, Solver, Generator } from "./sudoku.js";

let generator = null;
let solver = null;

export function getProgress() {
  return generator.progress;
}

export async function generate(givenDigits) {
  generator = new Generator();
  generator.fillGrid();
  await generator.maskGrid(81 - givenDigits);
  return generator.sudoku;
}

export function solve(sudoku) {
  solver = new Solver(Sudoku.fromObject(sudoku));
  solver.solve();
  return solver.sudoku;
}