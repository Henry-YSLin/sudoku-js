<template>
  <div>
    <p>More features coming soon!</p>
    <num-pad @numpress="numpress"></num-pad>
  </div>
</template>

<script>
import NumPad from "../components/NumPad.vue";
import store from "../store.js";

export default {
  name: "Play",
  components: { NumPad },
  props: {},
  data() {
    return {
      store,
    };
  },
  methods: {
    numpress(num) {
      this.store.selectedCells.forEach((x) => {
        if (x.fixed) return;
        x.number = num;
        for (let i = 1; i <= 9; i++)
          x.possibilities[i] = !x.number || i == x.number;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
