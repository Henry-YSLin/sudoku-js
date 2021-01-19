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
  </div>
</template>

<script>
import store from "../store.js";
import { Sudoku } from "../sudoku/sudoku.js";

export default {
  name: "SaveLoad",
  components: {},
  data() {
    return {
      store,
      code: "",
    };
  },
  props: {},
  created() {
    this.code = this.store.sudoku.getCode().slice(2);
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.store.sudoku = Sudoku.loadCode("0x" + this.code);
    },
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
