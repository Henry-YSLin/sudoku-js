<template>
  <div class="cell noselect">
    <div
      class="corner-mark"
      v-if="cellObj.number === null"
      :class="cellObj.fixed ? 'fixed-number' : null"
    >
      <div class="top-left">{{ cornerMarks[0] }}</div>
      <div class="top-middle">{{ cornerMarks[4] }}</div>
      <div class="top-right">{{ cornerMarks[1] }}</div>
      <div class="middle-left">{{ cornerMarks[6] }}</div>
      <div class="middle-middle">{{ cornerMarks[8] }}</div>
      <div class="middle-right">{{ cornerMarks[7] }}</div>
      <div class="bottom-left">{{ cornerMarks[2] }}</div>
      <div class="bottom-middle">{{ cornerMarks[5] }}</div>
      <div class="bottom-right">{{ cornerMarks[3] }}</div>
    </div>
    <div
      class="center-mark"
      :class="cellObj.fixed ? 'fixed-number' : null"
      v-if="
        cellObj.number === null && cellObj.possibilities.numbers.length <= 3
      "
    >
      {{ cellObj.possibilities.numbers.reduce((sum, x) => (sum += x), "") }}
    </div>
    <div class="big-number" :class="cellObj.fixed ? 'fixed-number' : null">
      {{ cellObj.number }}
    </div>
  </div>
</template>

<script>
import { Positions } from "../sudoku/sudoku.js";

export default {
  name: "SudokuCell",
  props: {
    cellObj: Object,
    sudoku: Object,
  },
  computed: {
    cornerMarks() {
      if (this.cellObj.possibilities.numbers.length === 9) return [];
      let pos = this.sudoku.positionOf(this.cellObj);
      return this.cellObj.possibilities.numbers.filter(
        (x) =>
          Positions.box(pos.box)
            .of(this.sudoku)
            .filterCells((y) => y.possibilities[x] && !y.number).length === 2
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cell {
  width: 50px;
  height: 50px;
  position: relative;
}
.possibilities {
  font-size: 0.5em;
  margin-top: 0px;
  font-family: Consolas, monospace;
}
.corner-mark {
  color: blue;
}
.center-mark {
  color: blue;
  font-size: 1em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  text-align: center;
  line-height: 50px;
}
.big-number {
  color: blue;
  font-size: 2em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  text-align: center;
  line-height: 50px;
}
.fixed-number {
  color: black;
}
.top-left {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  left: 0px;
}
.top-middle {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  text-align: center;
}
.top-right {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  right: 0px;
}
.middle-left {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  line-height: 50px;
}
.middle-middle {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  text-align: center;
  line-height: 50px;
}
.middle-right {
  font-size: 0.7em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  line-height: 50px;
}
.bottom-left {
  font-size: 0.7em;
  position: absolute;
  bottom: 0px;
  left: 0px;
}
.bottom-middle {
  font-size: 0.7em;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  text-align: center;
}
.bottom-right {
  font-size: 0.7em;
  position: absolute;
  bottom: 0px;
  right: 0px;
}
</style>
