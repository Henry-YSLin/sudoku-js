<template>
  <div>
    <num-pad></num-pad>
  </div>
</template>

<script>
import NumPad from "../components/NumPad.vue";

export default {
  name: "ManualInput",
  components: { NumPad },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
