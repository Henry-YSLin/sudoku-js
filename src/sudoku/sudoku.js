/*
  TODO:
    finish Analyze and Play UI
    add more solving techniques
 */

/**
 * A function for converting hex <-> dec w/o loss of precision.
 *
 * The problem is that parseInt("0x12345...") isn't precise enough to convert
 * 64-bit integers correctly.
 *
 * Internally, this uses arrays to encode decimal digits starting with the least
 * significant:
 * 8 = [8]
 * 16 = [6, 1]
 * 1024 = [4, 2, 0, 1]
 */

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length);
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  for (;;) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str, base) {
  var digits = str.split("");
  var ary = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = parseInt(digits[i], base);
    if (isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
}

function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (let i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(
        outArray,
        multiplyByNumber(digits[i], power, toBase),
        toBase
      );
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = "";
  for (let i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}

function decToHex(decStr) {
  var hex = convertBase(decStr, 10, 16);
  return hex;
}

function hexToDec(hexStr) {
  if (hexStr.substring(0, 2) === "0x") hexStr = hexStr.substring(2);
  hexStr = hexStr.toLowerCase();
  return convertBase(hexStr, 16, 10);
}

export class Sudoku {
  at(position) {
    return this.board[position.row - 1][position.column - 1];
  }

  static fromObject(obj) {
    let ret = new Sudoku();
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        ret.board[i][j] = Cell.fromObject(obj.board[i][j]);
      }
    }
    return ret;
  }

  positionOf(cell) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (this.board[i][j] === cell) {
          return new Position(j + 1, i + 1);
        }
      }
    }
  }

  get boardFlat() {
    return this.board.map((x) => x.map((y) => y.number)).flat();
  }

  static allNumbers() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  getCode() {
    return decToHex(
      this.board
        .map((x) => x.map((y) => (y.fixed ? y.number : null)))
        .flat()
        .reduce((str, num) => (str += num ?? 0), "")
    );
  }

  static loadCode(code) {
    let dec = hexToDec(code).padStart(81, "0");
    let arr = [];
    for (let i = 0; i < dec.length; i++) {
      arr.push(parseInt(dec.charAt(i)));
    }
    return new Sudoku(arr);
  }

  verify() {
    let sudoku = this;
    return !Positions.of(this).some(
      (pos) =>
        sudoku.at(pos).possibilities.numbers.length === 0 ||
        (!!sudoku.at(pos).number &&
          Positions.seenBy(pos)
            .of(sudoku)
            .containsNumber(sudoku.at(pos).number).length > 0)
    );
  }

  constructor(board) {
    if (board) {
      board = board.flat();
    }
    this.board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        this.board[i][j] = new Cell(i + "" + j);
        if (board) {
          let num = board[i * 9 + j];
          if (!num) {
            this.board[i][j].number = null;
          } else {
            this.board[i][j].number = num;
            this.board[i][j].fixed = true;
          }
        } else {
          this.board[i][j].number = null;
        }
      }
    }
  }
}

export class Possibilities {
  constructor() {
    for (let i = 1; i <= 9; i++) this[i] = true;
  }

  static fromObject(obj) {
    let ret = new Possibilities();
    for (let i = 1; i <= 9; i++) ret[i] = obj[i];
    return ret;
  }

  get numbers() {
    let ret = [];
    for (let i = 1; i <= 9; i++) if (this[i]) ret.push(i);
    return ret;
  }

  get length() {
    let ret = 0;
    for (let i = 1; i <= 9; i++) if (this[i]) ret++;
    return ret;
  }
}

export class Cell {
  constructor(id) {
    this.id = id;
    this.number = null;
    this.fixed = false;
    this.possibilities = new Possibilities();
  }

  static fromObject(obj) {
    let ret = new Cell();
    ret.id = obj.id;
    ret.number = obj.number;
    ret.fixed = obj.fixed;
    ret.possibilities = Possibilities.fromObject(obj.possibilities);
    return ret;
  }
}

export class Position {
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

export class Positions extends Array {
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
      return this.filterCells((x) => !!x.number);
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

  setNumber(number, trackChanges) {
    this._assertHasSudoku();
    let changed = false;
    if (number instanceof Function) {
      this.forEachCell((cell, pos) => {
        let val = number(cell, pos);
        if (cell.number !== val) {
          cell.number = val;
          changed = true;
        }
      });
    } else {
      this.forEachCell((x) => {
        if (x.number !== number) {
          x.number = number;
          changed = true;
        }
      });
    }
    if (trackChanges) trackChanges.changed = changed;
    return this;
  }

  setPossibilities(number, isPossible, trackChanges) {
    this._assertHasSudoku();
    let changed = false;
    if (number instanceof Array) {
      if (isPossible instanceof Function) {
        this.forEachCell((cell, pos) =>
          number.forEach((num) => {
            let val = isPossible(cell, pos, num);
            if (cell.possibilities[num] !== val) {
              cell.possibilities[num] = val;
              changed = true;
            }
          })
        );
      } else {
        this.forEachCell((x) =>
          number.forEach((num) => {
            if (x.possibilities[num] !== isPossible) {
              x.possibilities[num] = isPossible;
              changed = true;
            }
          })
        );
      }
    } else {
      if (isPossible instanceof Function) {
        this.forEachCell((cell, pos) => {
          let val = isPossible(cell, pos, number);
          if (cell.possibilities[number] !== val) {
            cell.possibilities[number] = val;
            changed = true;
          }
        });
      } else {
        this.forEachCell((x) => {
          if (x.possibilities[number] !== isPossible) {
            x.possibilities[number] = isPossible;
            changed = true;
          }
        });
      }
    }
    if (trackChanges) trackChanges.changed = changed;
    return this;
  }

  countPossibilities(count) {
    this._assertHasSudoku();
    return this.filterCells((x) => x.possibilities.length === count);
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

class ChangeTracker {
  #changed;
  constructor() {
    this.#changed = false;
  }
  set changed(val) {
    this.#changed ||= val;
  }
  get changed() {
    return this.#changed;
  }
}

export class Solver {
  #techniqueCache;
  constructor() {
    this.sudoku = null;
    this.EnabledTechniques = this.Techniques.map((x) => x.id);
    this.#techniqueCache = [...this.Techniques];
  }

  // fill in the number for naked singles
  nakedSingleTechnique() {
    let tracker = new ChangeTracker();
    Positions.of(this.sudoku)
      .empty()
      .countPossibilities(1)
      .setNumber((x) => x.possibilities.numbers[0], tracker);
    return tracker.changed;
  }

  // fill in a number if it can only go in one place
  singleCandidateTechnique() {
    let tracker = new ChangeTracker();
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        let setNum = (choices) => {
          if (choices.containsNumber(j).length === 0) {
            choices = choices.containsPossibilities(j);
            if (choices.length === 1) {
              choices.setNumber(j, tracker);
              choices.setPossibilities(Sudoku.allNumbers(), false);
              choices.forEachCell((x) => (x.possibilities[x.number] = true));
            }
          }
        };
        setNum(Positions.of(this.sudoku).row(i));
        setNum(Positions.of(this.sudoku).column(i));
        setNum(Positions.of(this.sudoku).box(i));
      }
    }
    return tracker.changed;
  }

  // if a cell is filled, there are no other possibilities
  filledCellsTechnique() {
    let changed = false;
    Positions.of(this.sudoku)
      .containsNumber()
      .filterCells((x) => x.possibilities.length > 1)
      .setPossibilities(Sudoku.allNumbers(), false)
      .forEachCell((x) => {
        x.possibilities[x.number] = true;
        changed = true;
      });
    return changed;
  }

  // remove possibilities from cells seen by a number
  directEliminationTechnique() {
    let tracker = new ChangeTracker();
    for (let i = 1; i <= 9; i++) {
      // for each number
      let numberedCells = Positions.of(this.sudoku).containsNumber(i);
      Positions.of(this.sudoku)
        .seenBy(numberedCells)
        .setPossibilities(i, false, tracker);
    }
    return tracker.changed;
  }

  // remove all other possibilities from cells when they form a pair
  pairsTechnique() {
    let tracker = new ChangeTracker();
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
        if (choices.length === 2 && choices.countPossibilities(2).length < 2) {
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
              false,
              tracker
            );
          }
        }
      }
    }
    return tracker.changed;
  }

  // remove all other possibilities from cells when they form a triple
  triplesTechnique() {
    let tracker = new ChangeTracker();
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
                false,
                tracker
              );
              Positions.of(this.sudoku)
                .seenBy(union[0])
                .seenBy(union[1])
                .seenBy(union[2])
                .setPossibilities(
                  [cornerMarks[j].num, cornerMarks[k].num, cornerMarks[l].num],
                  false,
                  tracker
                );
            }
          }
        }
      }
    }
    return tracker.changed;
  }

  // remove possibilities from rows and columns
  // when a number is sure to be in a particular box
  pencilMarkEliminationTechnique() {
    let tracker = new ChangeTracker();
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
        if (choices.isInSameRow()) {
          Positions.row(choices[0].row)
            .of(this.sudoku)
            .exclude(Positions.box(i))
            .setPossibilities(j, false, tracker);
        }
        if (choices.isInSameColumn())
          Positions.column(choices[0].column)
            .of(this.sudoku)
            .exclude(Positions.box(i))
            .setPossibilities(j, false, tracker);
      }
    }
    return tracker.changed;
  }

  // remove possibilities with X Wing logic on rows
  rowXWingTechnique() {
    let tracker = new ChangeTracker();
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
              .setPossibilities(i, false, tracker);
            Positions.column(row1[1].column)
              .of(this.sudoku)
              .exclude(row1)
              .exclude(row2)
              .setPossibilities(i, false, tracker);
          }
        }
      }
    }
    return tracker.changed;
  }

  // remove possibilities with X Wing logic on columns
  columnXWingTechnique() {
    let tracker = new ChangeTracker();
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
              .setPossibilities(i, false, tracker);
            Positions.row(column1[1].row)
              .of(this.sudoku)
              .exclude(column1)
              .exclude(column2)
              .setPossibilities(i, false, tracker);
          }
        }
      }
    }
    return tracker.changed;
  }

  #techniques = Object.freeze([
    {
      name: "Direct Elimination",
      id: "direct-elimination",
      actions: [this.directEliminationTechnique],
    },
    {
      name: "Single Candidate",
      id: "single-candidate",
      actions: [this.singleCandidateTechnique],
    },
    {
      name: "Eliminate by Pencil Mark",
      id: "pencil-mark-elimination",
      actions: [this.pencilMarkEliminationTechnique],
    },
    { name: "Pairs", id: "pairs", actions: [this.pairsTechnique] },
    { name: "Triples", id: "triples", actions: [this.triplesTechnique] },
    {
      name: "X Wing",
      id: "x-wing",
      actions: [this.rowXWingTechnique, this.columnXWingTechnique],
    },
  ]);

  get Techniques() {
    return this.#techniques;
  }

  getTechniqueById(id) {
    return this.Techniques.find((x) => x.id === id);
  }

  setup(sudoku) {
    this.sudoku = sudoku;
    this.filledCellsTechnique();
    this.#techniqueCache = this.Techniques.filter((x) =>
      this.EnabledTechniques.includes(x.id)
    );
  }

  step() {
    for (let i = 0; i < this.#techniqueCache.length; i++) {
      let technique = this.#techniqueCache[i];
      let ref = this;
      if (
        technique.actions.reduce(
          (changed, x) => (changed = x.call(ref) || changed),
          false
        )
      ) {
        this.nakedSingleTechnique();
        return { changed: true, technique: technique.id };
      }
    }
    return { changed: false };
  }

  solve() {
    let steps = [];
    let res;
    do {
      res = this.step();
      if (res.changed) steps.push(res.technique);
    } while (res.changed);
    return steps;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Generator {
  #progress;
  constructor(solver) {
    this.sudoku = new Sudoku();
    this.solver = solver ?? new Solver();
    this.#progress = 0;
  }

  fillGrid() {
    let positions = Positions.all();
    let c = 0;
    do {
      let currentCell = positions[c].of(this.sudoku);
      if (currentCell.possibilities.length !== 0) {
        let choices = currentCell.possibilities.numbers;
        currentCell.number =
          choices[Math.floor(Math.random() * choices.length)];
        currentCell.possibilities[currentCell.number] = false;
        if (
          Positions.seenBy(positions[c])
            .of(this.sudoku)
            .containsNumber(currentCell.number).length === 0
        ) {
          c++;
        }
      } else {
        currentCell.possibilities = new Possibilities();
        currentCell.number = null;
        c--;
      }
    } while (c < 81);
    Positions.of(this.sudoku).setPossibilities(Sudoku.allNumbers(), true);
    Positions.of(this.sudoku).forEachCell((x) => (x.fixed = true));
    return this.sudoku;
  }

  get progress() {
    return this.#progress;
  }

  async maskGrid(count) {
    let c = 0;
    let choices = null;
    let choice = null;
    let tmp = null;
    this.#progress = 0;
    outer: do {
      choices = Positions.of(this.sudoku).containsNumber();
      let maxChoices = choices.length;
      do {
        if (choices.length === 0) break outer;
        tmp = new Sudoku(this.sudoku.boardFlat);
        choice = choices[Math.floor(Math.random() * choices.length)];
        choices.splice(choices.indexOf(choice), 1);
        tmp.at(choice).number = null;
        this.solver.setup(tmp);
        while (
          this.solver.step().changed &&
          tmp.at(choice).number !== this.sudoku.at(choice).number
        );
        this.#progress = c + 1 - choices.length / maxChoices;
        await sleep(0);
      } while (tmp.at(choice).number !== this.sudoku.at(choice).number);
      this.sudoku.at(choice).number = null;
      c++;
    } while (c < count);
    Positions.of(this.sudoku).forEachCell((x) => (x.fixed = x.number !== null));
    return this.sudoku;
  }
}
