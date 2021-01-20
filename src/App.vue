<template>
  <div id="app">
    <b-container class="h-100">
      <b-row align-v="center" class="h-100">
        <b-col
          ><sudoku-board
            :gameObj="store.sudoku"
            :selectedCells="store.selectedCells"
            :showInternal="showInternal"
            @select="select"
            @deselect="deselect"
        /></b-col>
        <b-col class="mh-100 overflow-auto"
          ><control-panel ref="controlPanel" class="my-4"></control-panel
        ></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SudokuBoard from "./components/SudokuBoard.vue";
import ControlPanel from "./layouts/ControlPanel.vue";
import store from "./store.js";
import { Sudoku } from "./sudoku/sudoku.js";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

export default {
  name: "App",
  components: {
    SudokuBoard,
    ControlPanel,
  },
  data() {
    return {
      store,
      showInternal: false,
    };
  },
  created() {
    //// prettier-ignore
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
    //// prettier-ignore
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

    // prettier-ignore
    this.store.sudoku = new Sudoku([
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
  },
  mounted() {
    disableBodyScroll(this.$refs["controlPanel"].$el);
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    select(item) {
      this.store.selectedCells.push(item);
    },
    deselect() {
      this.store.selectedCells = [];
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
}
</style>
