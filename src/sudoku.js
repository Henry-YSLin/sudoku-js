class Sudoku {
  #board;

  at(position) {
    return this.#board[position.row - 1][position.column - 1];
  }

  positionOf(cell) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (this.#board[i][j] === cell) {
          return new Position(j + 1, i + 1);
        }
      }
    }
  }

  get board() {
    return this.#board;
  }

  static allNumbers() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  constructor(board) {
    if (board) {
      board = board.flat();
    }
    this.#board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        this.#board[i][j] = new Cell(i + "" + j);
        if (board) {
          let num = board[i * 9 + j];
          if (num === 0) {
            this.#board[i][j].number = null;
          } else {
            this.#board[i][j].number = num;
            this.#board[i][j].fixed = true;
          }
        } else {
          this.#board[i][j].number = Math.floor(Math.random() * 9 + 1);
        }
      }
    }
  }
}

class Possibilities {
  constructor() {
    for (let i = 1; i <= 9; i++) this[i] = true;
  }

  get numbers() {
    let ret = [];
    for (let i = 1; i <= 9; i++) if (this[i]) ret.push(i);
    return ret;
  }
}

class Cell {
  constructor(id) {
    this.id = id;
    this.number = 0;
    this.fixed = false;
    this.possibilities = new Possibilities();
  }
}

class Position {
  #column;
  #row;

  constructor(column, row) {
    this.#column = column;
    this.#row = row;
  }

  get column() {
    return this.#column;
  }

  get row() {
    return this.#row;
  }

  get box() {
    return (
      Math.floor((this.column - 1) / 3) + Math.floor((this.row - 1) / 3) * 3 + 1
    );
  }

  get boxColumn() {
    return ((this.box - 1) % 3) + 1;
  }

  get boxRow() {
    return Math.floor((this.box - 1) / 3) + 1;
  }

  of(sudoku) {
    return sudoku.at(this);
  }

  canSee(pos) {
    return (
      !this.equals(pos) &&
      (this.row === pos.row ||
        this.column === pos.column ||
        this.box === pos.box)
    );
  }

  equals(obj) {
    return this.row === obj.row && this.column === obj.column;
  }

  toString() {
    return "Position(" + this.column + "," + this.row + ")";
  }
}

class Positions extends Array {
  constructor() {
    super();
    this.sudoku = null;
  }

  filterPositions(condition) {
    let ret = this.filter(condition);
    ret.sudoku = this.sudoku;
    return ret;
    // for (let i = this.length - 1; i >= 0; i--) {
    //   if (!condition(this[i])) {
    //     this.splice(i, 1);
    //   }
    // }
    // return this;
  }

  sortPositions() {
    let ret = this.sort((a, b) => b.row * 9 + b.column - a.row * 9 - a.column);
    ret.sudoku = this.sudoku;
    return ret;
  }

  static all() {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        ret.push(new Position(i, j));
      }
    }
    return ret;
  }

  static column(index) {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      ret.push(new Position(index, i));
    }
    return ret;
  }

  column(index) {
    if (index instanceof Array) {
      return this.filterPositions((x) => index.includes(x.column));
    } else {
      return this.filterPositions((x) => x.column === index);
    }
  }

  static columns() {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      ret.push(this.column(i));
    }
    return ret;
  }

  static row(index) {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      ret.push(new Position(i, index));
    }
    return ret;
  }

  row(index) {
    if (index instanceof Array) {
      return this.filterPositions((x) => index.includes(x.row));
    } else {
      return this.filterPositions((x) => x.row === index);
    }
  }

  static rows() {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      ret.push(this.row(i));
    }
    return ret;
  }

  static box(index) {
    let ret = new Positions();
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        ret.push(
          new Position(
            ((index - 1) % 3) * 3 + j,
            Math.floor((index - 1) / 3) * 3 + i
          )
        );
      }
    }
    return ret;
  }

  box(index) {
    if (index instanceof Array) {
      return this.filterPositions((x) => index.includes(x.box));
    } else {
      return this.filterPositions((x) => x.box === index);
    }
  }

  static boxes() {
    let ret = new Positions();
    for (let i = 1; i <= 9; i++) {
      ret.push(this.box(i));
    }
    return ret;
  }

  static seenBy(pos) {
    return Positions.all().seenBy(pos);
  }

  seenBy(pos) {
    if (pos instanceof Array) {
      return this.filterPositions((x) => pos.some((p) => p.canSee(x)));
    } else {
      return this.filterPositions((x) => pos.canSee(x));
    }
  }

  of(sudoku) {
    this.sudoku = sudoku;
    return this;
  }

  static of(sudoku) {
    return Positions.all().of(sudoku);
  }

  _assertHasSudoku() {
    console.assert(
      this.sudoku !== null,
      "This position collection is not assigned a sudoku board yet"
    );
  }

  filterCells(condition) {
    this._assertHasSudoku();
    return this.filterPositions((x) => condition(this.sudoku.at(x), x));
  }

  containsNumber(number) {
    this._assertHasSudoku();
    if (number === undefined) {
      return this.filterCells((x) => x.number !== null);
    } else if (number instanceof Array) {
      return this.filterCells((x) => number.includes(x.number));
    } else {
      return this.filterCells((x) => x.number === number);
    }
  }

  empty() {
    this._assertHasSudoku();
    return this.filterCells((x) => x.number === null);
  }

  containsPossibilities(number) {
    this._assertHasSudoku();
    if (number instanceof Array) {
      return this.filterCells((x) =>
        number.some((num) => x.possibilities[num])
      );
    } else {
      return this.filterCells((x) => x.possibilities[number]);
    }
  }

  forEachCell(action) {
    this._assertHasSudoku();
    this.forEach((x) => action(this.sudoku.at(x), x));
    return this;
  }

  setNumber(number) {
    this._assertHasSudoku();
    if (number instanceof Function) {
      this.forEachCell((cell, pos) => (cell.number = number(cell, pos)));
    } else {
      this.forEachCell((x) => (x.number = number));
    }
    return this;
  }

  setPossibilities(number, isPossible) {
    this._assertHasSudoku();
    if (number instanceof Array) {
      if (isPossible instanceof Function) {
        this.forEachCell((cell, pos) =>
          number.forEach(
            (num) => (cell.possibilities[num] = isPossible(cell, pos, num))
          )
        );
      } else {
        this.forEachCell((x) =>
          number.forEach((num) => (x.possibilities[num] = isPossible))
        );
      }
    } else {
      if (isPossible instanceof Function) {
        this.forEachCell(
          (cell, pos) =>
            (cell.possibilities[number] = isPossible(cell, pos, number))
        );
      } else {
        this.forEachCell((x) => (x.possibilities[number] = isPossible));
      }
    }
    return this;
  }

  countPossibilities(count) {
    this._assertHasSudoku();
    return this.filterCells((x) => x.possibilities.numbers.length === count);
  }

  isInSameRow() {
    if (this.length === 0) return false;
    if (this.length === 1) return true;
    return !this.some((x) => x.row !== this[0].row);
  }

  isInSameColumn() {
    if (this.length === 0) return false;
    if (this.length === 1) return true;
    return !this.some((x) => x.column !== this[0].column);
  }

  isInSameBox() {
    if (this.length === 0) return false;
    if (this.length === 1) return true;
    return !this.some((x) => x.box !== this[0].box);
  }

  isInSameBoxRow() {
    if (this.length === 0) return false;
    if (this.length === 1) return true;
    return !this.some((x) => x.boxRow !== this[0].boxRow);
  }

  isInSameBoxColumn() {
    if (this.length === 0) return false;
    if (this.length === 1) return true;
    return !this.some((x) => x.boxColumn !== this[0].boxColumn);
  }

  exclude(position) {
    if (position instanceof Array) {
      return this.filterPositions((x) => !position.some((y) => x.equals(y)));
    } else {
      return this.filterPositions((x) => !x.equals(position));
    }
  }

  and(positions) {
    let res = this.concat(positions);
    var newArray = new Positions();
    label: for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < newArray.length; j++) {
        if (newArray[j].equals(res[i])) continue label;
      }
      newArray.push(res[i]);
    }
    newArray.sudoku = this.sudoku;
    return newArray;
  }

  equals(positions) {
    if (this === positions) return true;
    if (positions == null) return false;
    if (this.length !== positions.length) return false;

    let arrA = this.sortPositions();
    let arrB = positions.sortPositions();

    for (var i = 0; i < arrA.length; ++i) {
      if (!arrA[i].equals(arrB[i])) return false;
    }
    return true;
  }
}

class Solver {
  constructor(sudoku) {
    this.sudoku = sudoku;
  }

  // if a cell is filled, there are no other possibilities
  filledCellsReducer() {
    Positions.of(this.sudoku)
      .containsNumber()
      .setPossibilities(Sudoku.allNumbers(), false)
      .forEachCell((x) => (x.possibilities[x.number] = true));
  }

  // remove possibilities from cells seen by a number
  seenNumbersReducer() {
    for (let i = 1; i <= 9; i++) {
      // for each number
      let numberedCells = Positions.of(this.sudoku).containsNumber(i);
      Positions.of(this.sudoku)
        .seenBy(numberedCells)
        .setPossibilities(i, false);
    }
  }

  // remove all other possibilities from cells when they form a pair
  pairReducer() {
    for (let i = 1; i <= 9; i++) {
      // for each box
      if (
        Positions.box(i)
          .of(this.sudoku)
          .containsNumber().length === 9
      )
        continue;
      let cornerMarks = [];
      for (let j = 1; j <= 9; j++) {
        // for each number
        let choices = Positions.box(i)
          .of(this.sudoku)
          .empty()
          .containsPossibilities(j);
        if (choices.length === 2) {
          cornerMarks.push({ num: j, pos: choices });
        }
      }
      if (cornerMarks.length < 2) continue;
      for (let j = 0; j < cornerMarks.length; j++) {
        for (let k = j + 1; k < cornerMarks.length; k++) {
          if (cornerMarks[j].pos.equals(cornerMarks[k].pos)) {
            cornerMarks[j].pos.setPossibilities(
              Sudoku.allNumbers().filter(
                (x) => ![cornerMarks[j].num, cornerMarks[k].num].includes(x)
              ),
              false
            );
          }
        }
      }
    }
  }

  // remove all other possibilities from cells when they form a triple
  tripleReducer() {
    // TODO: debug
    for (let i = 1; i <= 9; i++) {
      // for each box
      if (
        Positions.box(i)
          .of(this.sudoku)
          .containsNumber().length === 9
      )
        continue;
      let cornerMarks = [];
      for (let j = 1; j <= 9; j++) {
        // for each number
        let choices = Positions.box(i)
          .of(this.sudoku)
          .empty()
          .containsPossibilities(j);
        if (choices.length >= 2 && choices.length <= 3) {
          cornerMarks.push({ num: j, pos: choices });
        }
      }
      if (cornerMarks.length < 3) continue;
      for (let j = 0; j < cornerMarks.length; j++) {
        for (let k = j + 1; k < cornerMarks.length; k++) {
          for (let l = k + 1; l < cornerMarks.length; l++) {
            let union = cornerMarks[j].pos
              .and(cornerMarks[k].pos)
              .and(cornerMarks[l].pos);
            if (union.length === 3) {
              union.setPossibilities(
                Sudoku.allNumbers().filter(
                  (x) =>
                    ![
                      cornerMarks[j].num,
                      cornerMarks[k].num,
                      cornerMarks[l].num,
                    ].includes(x)
                ),
                false
              );
            }
          }
        }
      }
    }
  }

  // remove possibilities from rows and columns
  // when a number is sure to be in a particular box
  cornerMarkReducer() {
    for (let i = 1; i <= 9; i++) {
      // for each box
      for (let j = 1; j <= 9; j++) {
        // for each number
        if (
          Positions.box(i)
            .of(this.sudoku)
            .containsNumber(j).length > 0
        )
          continue;
        let choices = Positions.box(i)
          .of(this.sudoku)
          .empty()
          .containsPossibilities(j);
        if (choices.length === 0) continue;
        if (choices.isInSameRow())
          Positions.row(choices[0].row)
            .of(this.sudoku)
            .exclude(Positions.box(i))
            .setPossibilities(j, false);
        if (choices.isInSameColumn())
          Positions.column(choices[0].column)
            .of(this.sudoku)
            .exclude(Positions.box(i))
            .setPossibilities(j, false);
      }
    }
  }

  // remove possibilities with X Wing logic on rows
  rowXWingReducer() {
    for (let i = 1; i <= 9; i++) {
      // for each number
      for (let j = 1; j <= 9; j++) {
        // for each row
        if (
          Positions.row(j)
            .of(this.sudoku)
            .containsNumber(i).length > 0
        )
          continue;
        let row1 = Positions.row(j)
          .of(this.sudoku)
          .empty()
          .containsPossibilities(i);
        if (row1.length !== 2) continue;
        for (let k = j + 1; k <= 9; k++) {
          // for each remaining row
          if (
            Positions.row(k)
              .of(this.sudoku)
              .containsNumber(i).length > 0
          )
            continue;
          let row2 = Positions.row(k)
            .of(this.sudoku)
            .empty()
            .containsPossibilities(i);
          if (row2.length !== 2) continue;
          if (
            (row1[0].column === row2[0].column &&
              row1[1].column === row2[1].column) ||
            (row1[0].column === row2[1].column &&
              row1[1].column === row2[0].column)
          ) {
            Positions.column(row1[0].column)
              .of(this.sudoku)
              .exclude(row1)
              .exclude(row2)
              .setPossibilities(i, false);
            Positions.column(row1[1].column)
              .of(this.sudoku)
              .exclude(row1)
              .exclude(row2)
              .setPossibilities(i, false);
          }
        }
      }
    }
  }

  // remove possibilities with X Wing logic on columns
  columnXWingReducer() {
    for (let i = 1; i <= 9; i++) {
      // for each number
      for (let j = 1; j <= 9; j++) {
        // for each column
        if (
          Positions.column(j)
            .of(this.sudoku)
            .containsNumber(i).length > 0
        )
          continue;
        let column1 = Positions.column(j)
          .of(this.sudoku)
          .empty()
          .containsPossibilities(i);
        if (column1.length !== 2) continue;
        for (let k = j + 1; k <= 9; k++) {
          // for each remaining column
          if (
            Positions.column(k)
              .of(this.sudoku)
              .containsNumber(i).length > 0
          )
            continue;
          let column2 = Positions.column(k)
            .of(this.sudoku)
            .empty()
            .containsPossibilities(i);
          if (column2.length !== 2) continue;
          if (
            (column1[0].row === column2[0].row &&
              column1[1].row === column2[1].row) ||
            (column1[0].row === column2[1].row &&
              column1[1].row === column2[0].row)
          ) {
            Positions.row(column1[0].row)
              .of(this.sudoku)
              .exclude(column1)
              .exclude(column2)
              .setPossibilities(i, false);
            Positions.row(column1[1].row)
              .of(this.sudoku)
              .exclude(column1)
              .exclude(column2)
              .setPossibilities(i, false);
          }
        }
      }
    }
  }

  // TODO: swordfish
  #possibilitiesReducer = [
    this.filledCellsReducer,
    this.seenNumbersReducer,
    this.pairReducer,
    this.tripleReducer,
    this.cornerMarkReducer,
    this.rowXWingReducer,
    this.columnXWingReducer,
  ];

  updatePossibilities() {
    this.#possibilitiesReducer.forEach((x) => x.call(this));
  }

  singlePossibility() {
    let changed = false;
    Positions.of(this.sudoku)
      .empty()
      .countPossibilities(1)
      .setNumber((x) => {
        changed = true;
        return x.possibilities.numbers[0];
      });
    return changed;
  }

  singleLocationChoice() {
    let changed = false;
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        let setNum = (choices) => {
          if (choices.containsNumber(j).length === 0) {
            choices = choices.containsPossibilities(j);
            if (choices.length === 1) {
              choices.setNumber(j);
              changed = true;
            }
          }
        };
        setNum(Positions.of(this.sudoku).row(i));
        setNum(Positions.of(this.sudoku).column(i));
        setNum(Positions.of(this.sudoku).box(i));
      }
    }
    return changed;
  }

  #numberFiller = [this.singlePossibility, this.singleLocationChoice];

  fillNumbers() {
    return this.#numberFiller.reduce(
      (sum, x) => (sum = x.call(this) || sum),
      false
    );
  }

  solve() {
    let steps = 0;
    do {
      this.updatePossibilities();
      steps++;
    } while (this.fillNumbers());
    console.log("Steps used: " + steps);
  }
}

export { Sudoku, Cell, Position, Positions, Solver };
