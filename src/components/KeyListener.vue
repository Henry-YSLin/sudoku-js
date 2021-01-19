<template>
  <div></div>
</template>

<script>
export default {
  name: "KeyListener",
  components: {},
  props: {},
  created() {
    const component = this;
    this.keypressHandler = function (e) {
      component.$emit("keypress", e);
    };
    this.keydownHandler = function (e) {
      component.$emit("keydown", e);
    };
    this.keyupHandler = function (e) {
      component.$emit("keyup", e);
    };
    window.addEventListener("keypress", this.keypressHandler);
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.keypressHandler);
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  },
};
</script>

<style scoped>
div {
  display: none;
}
</style>