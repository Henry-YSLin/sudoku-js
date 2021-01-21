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
        :disabled="isSolveLoading || isInvalid"
        :variant="isStepLoading ? 'danger' : 'primary'"
        @click="step()"
        >{{ isStepLoading ? "Cancel" : "Step" }}</b-button
      >
      <b-button
        class="m-1"
        type="submit"
        id="solve"
        :disabled="isStepLoading || isInvalid"
        :variant="isSolveLoading ? 'danger' : 'primary'"
        >{{ isSolveLoading ? "Cancel" : "Solve" }}</b-button
      >
      <b-popover
        :show="isInvalid"
        disabled
        target="solve"
        title="Invalid sudoku!"
        ref="popover"
      ></b-popover>
    </b-form>
    <b-card class="mt-3" header="Action Details">
      <div class="m-0 text-monospace" style="white-space: pre-line">
        {{ actionDetails }}
      </div>
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
      isInvalid: false,
    };
  },
  props: {},
  beforeDestroy() {
    if (this.solveWorker) this.solveWorker.terminate();
  },
  created() {
    this.isInvalid = !this.store.sudoku.verify();
  },
  computed: {
    actionDetails() {
      if (this.result?.message) {
        return this.result.message;
      } else if (this.result instanceof Array) {
        if (this.result.length === 0) return "Nothing is done";
        return this.result
          .map(
            (itm, idx) =>
              idx + 1 + ". " + this.solver.getTechniqueById(itm).name
          )
          .reduce((acc, cur) => acc + "\n" + cur, "")
          .substring(1);
      } else {
        return this.result?.changed
          ? "Technique used: " +
              this.solver.getTechniqueById(this.result.technique).name
          : "Nothing is done";
      }
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.solve();
    },
    async step() {
      if (this.isInvalid) return;
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
            this.isInvalid = !this.store.sudoku.verify();
            return res;
          })
          .then((res) => {
            let sudoku = Sudoku.fromObject(res.sudoku);
            this.isInvalid = !sudoku.verify();
            if (this.isInvalid) {
              this.result = {
                message: "Solver discovered that this sudoku has no solution",
              };
            } else {
              this.result = res.result;
              this.store.sudoku = sudoku;
            }
            this.isStepLoading = false;
          });
      }
    },
    async solve() {
      if (this.isInvalid) return;
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
            let sudoku = Sudoku.fromObject(res.sudoku);
            this.isInvalid = !sudoku.verify();
            if (this.isInvalid) {
              this.result = {
                message: "Solver discovered that this sudoku has no solution",
              };
            } else {
              this.result = res.result;
              this.store.sudoku = sudoku;
            }
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
