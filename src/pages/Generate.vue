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

      <b-form-group
        id="input-group-2"
        label="Given digits:"
        label-for="input-2"
      >
        <b-form-input
          id="input-2"
          type="number"
          max="80"
          min="17"
          v-model="givenDigits"
          placeholder="Enter a number"
          required
        ></b-form-input>
      </b-form-group>

      <b-button
        type="submit"
        :variant="isLoading ? 'danger' : 'primary'"
        >{{ isLoading ? "Cancel" : "Generate" }}</b-button
      >
    </b-form>
    <b-progress
      v-if="isLoading"
      class="mt-3"
      :value="progress"
      :max="81 - givenDigits"
      show-progress
      animated
    ></b-progress>
    <b-card class="mt-3" header="Form Data Result (Debug)">
      <pre class="m-0">{{ { solver, givenDigits } }}</pre>
    </b-card>
  </div>
</template>

<script>
import worker from "workerize-loader!../sudoku/worker.js";
import { Sudoku, Solver } from "../sudoku/sudoku.js";
import store from "../store.js";

export default {
  name: "Generate",
  components: {},
  data() {
    return {
      store,
      givenDigits: 17,
      progress: 0,
      isLoading: false,
      genWorker: null,
      intervalId: undefined,
      solver: new Solver(),
    };
  },
  props: {},
  beforeDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.genWorker) this.genWorker.terminate();
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.generate();
    },
    async generate() {
      if (this.isLoading) {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.genWorker) this.genWorker.terminate();
        this.isLoading = false;
      } else {
        this.isLoading = true;
        this.genWorker = new worker();
        this.progress = 0;
        this.intervalId = setInterval(
          async () => (this.progress = await this.genWorker.getProgress()),
          500
        );
        this.genWorker
          .generate(this.givenDigits, this.solver.EnabledTechniques)
          .then((res) => {
            this.store.sudoku = Sudoku.fromObject(res);
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            this.isLoading = false;
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
