<template>
  <div id="app">
    <SudokuComp :gameObj="gameObj" :showInternal="showInternal" />
    <div id="internal-checkbox">
      <input type="checkbox" id="toggle" v-model="showInternal" />
      <label for="toggle">Show all possibilities</label>
      <button @click="solve()">Solve</button>
      <button @click="generate()">Generate</button>
    </div>
  </div>
</template>

<script>
import SudokuComp from "./components/Sudoku.vue";
import { Sudoku, Position, Positions, Solver, Generator } from "./sudoku.js";

export default {
  name: "App",
  components: {
    SudokuComp,
  },
  data() {
    return {
      gameObj: null,
      showInternal: false,
    };
  },
  created() {
    // this.gameObj = new Sudoku([
    //   0,0,1,2,0,3,4,0,0,
    //   0,0,0,6,0,7,0,0,0,
    //   5,0,0,0,0,0,0,0,3,
    //   3,7,0,0,0,0,0,8,1,
    //   0,0,0,0,0,0,0,0,0,
    //   6,2,0,0,0,0,0,3,7,
    //   1,0,0,0,0,0,0,0,8,
    //   0,0,0,8,0,5,0,0,0,
    //   0,0,6,4,0,2,5,0,0,
    // ]);
    // this.gameObj = new Sudoku([
    //   6,0,9,1,0,2,0,8,0,
    //   0,0,0,0,0,0,4,0,0,
    //   5,0,2,0,0,0,0,0,0,
    //   0,0,0,0,2,0,3,0,4,
    //   1,0,0,0,0,5,0,0,0,
    //   0,2,0,0,0,0,5,0,6,
    //   0,0,0,8,0,1,0,0,0,
    //   0,0,0,0,0,0,0,0,9,
    //   8,0,5,9,0,7,0,4,0,
    // ]);
     this.gameObj = new Sudoku([
      6,0,9,1,0,2,0,8,0,
      0,0,0,0,0,0,4,0,0,
      5,0,2,0,0,0,0,0,0,
      0,0,0,0,2,0,3,0,4,
      1,0,0,0,0,5,0,0,0,
      0,2,0,0,0,0,5,0,6,
      0,0,0,8,0,1,0,0,0,
      0,0,0,0,0,0,0,0,9,
      8,0,5,9,0,7,0,4,0,
    ]);

    // library tests
    console.log(new Positions());
    console.table(Positions.all());
    console.log(
      Positions.all().seenBy(new Position(1, 9)).column(2).of(this.gameObj)
    );
    console.log(
      Positions.all()
        .seenBy(new Position(1, 2))
        .box(4)
        .of(this.gameObj)
        .containsNumber(5, 6, 7, 8, 9)
    );
    console.log(Positions.all().exclude(Positions.all()));
    console.log(Positions.all().exclude(Positions.seenBy(new Position(1, 2))));
  },
  methods: {
    solve() {
      let solver = new Solver(this.gameObj);
      solver.solve();
    },
    generate() {
      let generator = new Generator(null);
      generator.fillGrid();
      this.gameObj = generator.maskGrid(60);
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#internal-checkbox {
  position: absolute;
  left: 0px;
  width: auto;
}
</style>
