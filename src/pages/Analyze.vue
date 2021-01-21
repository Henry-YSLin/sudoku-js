<template>
  <div>
    <p>More features coming soon!</p>
    <b-list-group>
      <b-list-group-item
        v-for="item in solver.Techniques"
        :key="item.id"
        :disabled="!techniques.includes(item.id)"
        >{{ item.name }}</b-list-group-item
      >
    </b-list-group>
    <b-button
      id="analyze"
      class="m-1 mt-3"
      @click="btnClick"
      :disabled="isInvalid"
      :variant="isSolveLoading ? 'danger' : 'primary'"
      >{{ isSolveLoading ? "Cancel" : "Analyze" }}</b-button
    >
    <b-popover
      :show="isInvalid"
      disabled
      target="analyze"
      title="Invalid sudoku!"
      ref="popover"
    ></b-popover>
    <b-card class="mt-3" header="Action Details">
      <pre class="m-0">{{ result }}</pre>
    </b-card>
  </div>
</template>

<script>
import worker from "workerize-loader!../sudoku/worker.js";
import { Solver } from "../sudoku/sudoku.js";
import store from "../store.js";

export default {
  name: "Analyze",
  components: {},
  data() {
    return {
      store,
      isSolveLoading: false,
      solveWorker: null,
      result: null,
      solver: new Solver(),
      isInvalid: false,
    };
  },
  created() {
    this.isInvalid = !this.store.sudoku.verify();
  },
  props: {},
  beforeDestroy() {
    if (this.solveWorker) this.solveWorker.terminate();
  },
  computed: {
    techniques() {
      if (!this.result) return [];
      return this.result.filter((x, idx, self) => self.indexOf(x) === idx);
    },
  },
  methods: {
    btnClick() {
      this.solve();
    },
    async solve() {
      if (this.isSolveLoading) {
        if (this.solveWorker) this.solveWorker.terminate();
        this.isSolveLoading = false;
      } else {
        this.isSolveLoading = true;
        this.solveWorker = new worker();
        this.solveWorker.solve(this.store.sudoku).then((res) => {
          this.result = res.result;
          this.isSolveLoading = false;
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
