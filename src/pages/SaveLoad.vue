<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="Code:" label-for="code">
        <b-form-textarea
          id="code"
          v-model="code"
          placeholder="Enter a code..."
          rows="3"
          max-rows="6"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-button
        class="m-1"
        variant="primary"
        @click="copyText(code)"
        v-b-tooltip.click="'Copied!'"
        >Copy</b-button
      >
      <b-button class="m-1" type="submit" variant="primary">Load</b-button>
    </b-form>
    <b-form @submit="onCtcSubmit" class="mt-4">
      <b-form-group
        id="input-group-2"
        label="CTC Puzzle ID:"
        label-for="ctc-id"
      >
        <b-form-input
          id="ctc-id"
          v-model="puzzleId"
          placeholder="Enter a puzzle ID..."
          required
        ></b-form-input>
      </b-form-group>

      <b-popover
        :show="showFailed"
        disabled
        target="load-ctc"
        title="Load failed!"
        ref="popover"
      ></b-popover>

      <b-button
        class="m-1"
        type="submit"
        variant="primary"
        id="load-ctc"
        :disabled="!ctcEnabled"
        >Load</b-button
      >
    </b-form>
  </div>
</template>

<script>
import store from "../store.js";
import { Sudoku } from "../sudoku/sudoku.js";
import jsonic from "jsonic";

export default {
  name: "SaveLoad",
  components: {},
  data() {
    return {
      store,
      code: "",
      puzzleId: "",
      showFailed: false,
      ctcEnabled: true,
    };
  },
  props: {},
  created() {
    this.code = this.store.sudoku.getCode();
    this.fetchCtc();
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.store.sudoku = Sudoku.loadCode(this.code);
      this.store.selectedCells = [];
    },
    onCtcSubmit(event) {
      event.preventDefault();
      if (!this.ctcEnabled) return;
      this.ctcEnabled = false;
      this.store.selectedCells = [];
      fetch(
        "https://cors-anywhere.herokuapp.com/" +
          "https://app.crackingthecryptic.com/api/puzzle/" +
          this.puzzleId
      )
        .then((response) => response.text())
        .then((data) => {
          let s = data;
          s = s.replace(/(?<=\[|,)(?=,|\])/g, "null");
          let obj = jsonic(s);
          this.store.sudoku = new Sudoku(obj.ce.flat().map((x) => x?.v));
          this.showFailed = false;
          this.ctcEnabled = true;
        })
        .catch((e) => {
          console.log(e);
          this.showFailed = true;
          this.ctcEnabled = true;
        });
    },
    fetchCtc() {},
    copyText(text) {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
