<template>
  <div>
    <table border="1" cellspacing="0">
      <tr v-for="row in gameObj.board" :key="row[0].id">
        <td v-for="item in row" :key="item.id" class="sudoku-cell">
          <sudoku-cell :cellObj="item" :sudoku="gameObj" v-if="!showInternal" />
          <internal-sudoku-cell :cellObj="item" v-if="showInternal" />
        </td>
      </tr>
    </table>

    <div class="mt-4">
      <b-form-checkbox
        id="showInternalCheckbox"
        v-model="showInternal"
        >Show all possibilities</b-form-checkbox
      >
      <b-button @click="step()" class="m-1">Step</b-button>
      <b-button @click="solve()" class="m-1">Solve</b-button>
    </div>
  </div>
</template>

<script>
import SudokuCell from "./SudokuCell.vue";
import InternalSudokuCell from "./InternalSudokuCell.vue";
import store from "../store.js";
import { Sudoku, Solver } from "../sudoku/sudoku.js";
import worker from "workerize-loader!../sudoku/worker.js";

export default {
  name: "SudokuBoard",
  components: {
    SudokuCell,
    InternalSudokuCell,
  },
  props: {
    gameObj: Object,
  },
  data() {
    return {
      store,
      showInternal: false,
      solveWorker: new worker(),
    };
  },
  methods: {
    step() {
      let solver = new Solver(this.store.sudoku);
      solver.step();
    },
    solve() {
      this.solveWorker.solve(this.store.sudoku).then((res) => {
        this.store.sudoku = Sudoku.fromObject(res);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.sudoku-cell {
  text-align: center;
  vertical-align: top;
}
td {
  border: 1px solid;
  text-align: center;
}
td:first-child {
  border-left: solid;
}
td:nth-child(3n) {
  border-right: solid;
}
tr:first-child td {
  border-top: solid;
}
tr:nth-child(3n) td {
  border-bottom: solid;
}
</style>
