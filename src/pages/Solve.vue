<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Techniques:"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-checkbox-group
          v-model="solver.EnabledTechniques"
          id="checkboxes-1"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-checkbox
            :value="item.id"
            v-for="item in solver.Techniques"
            :key="item.id"
            >{{ item.name }}</b-form-checkbox
          >
        </b-form-checkbox-group>
      </b-form-group>

      <b-button
        class="m-1"
        :disabled="isSolveLoading"
        :variant="isStepLoading ? 'danger' : 'primary'"
        @click="step()"
        >{{ isStepLoading ? "Cancel" : "Step" }}</b-button
      >
      <b-button
        class="m-1"
        type="submit"
        :disabled="isStepLoading"
        :variant="isSolveLoading ? 'danger' : 'primary'"
        >{{ isSolveLoading ? "Cancel" : "Solve" }}</b-button
      >
    </b-form>
    <b-card class="mt-3" header="Action Details">
      <pre class="m-0">{{ result }}</pre>
    </b-card>
  </div>
</template>

<script>
import worker from "workerize-loader!../sudoku/worker.js";
import { Sudoku, Solver } from "../sudoku/sudoku.js";
import store from "../store.js";

export default {
  name: "Solve",
  components: {},
  data() {
    return {
      store,
      isStepLoading: false,
      isSolveLoading: false,
      solveWorker: null,
      solver: new Solver(),
      result: null,
    };
  },
  props: {},
  beforeDestroy() {
    if (this.solveWorker) this.solveWorker.terminate();
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.solve();
    },
    async step() {
      if (this.isSolveLoading) return;
      if (this.isStepLoading) {
        if (this.solveWorker) this.solveWorker.terminate();
        this.isSolveLoading = false;
        this.isStepLoading = false;
      } else {
        this.isStepLoading = true;
        this.solveWorker = new worker();
        this.solveWorker
          .step(this.store.sudoku, this.solver.EnabledTechniques)
          .then((res) => {
            this.store.sudoku = Sudoku.fromObject(res.sudoku);
            this.result = res.result;
            this.isStepLoading = false;
          });
      }
    },
    async solve() {
      if (this.isStepLoading) return;
      if (this.isSolveLoading) {
        if (this.solveWorker) this.solveWorker.terminate();
        this.isSolveLoading = false;
        this.isStepLoading = false;
      } else {
        this.isSolveLoading = true;
        this.solveWorker = new worker();
        this.solveWorker
          .solve(this.store.sudoku, this.solver.EnabledTechniques)
          .then((res) => {
            this.store.sudoku = Sudoku.fromObject(res.sudoku);
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
