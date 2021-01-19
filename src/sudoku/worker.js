import { Sudoku, Solver, Generator } from "./sudoku.js";

let generator = null;

export function getProgress() {
  return generator.progress;
}

export async function generate(givenDigits, enabledTechniques) {
  let solver = new Solver();
  solver.EnabledTechniques = enabledTechniques;
  generator = new Generator(solver);
  generator.fillGrid();
  await generator.maskGrid(81 - givenDigits);
  return generator.sudoku;
}

export function solve(sudoku, enabledTechniques) {
  let solver = new Solver();
  solver.EnabledTechniques = enabledTechniques;
  solver.setup(Sudoku.fromObject(sudoku));
  let res = solver.solve();
  return { result: res, sudoku: solver.sudoku };
}

export function step(sudoku, enabledTechniques) {
  let solver = new Solver();
  solver.EnabledTechniques = enabledTechniques;
  solver.setup(Sudoku.fromObject(sudoku));
  let res = solver.step();
  return { result: res, sudoku: solver.sudoku };
}
