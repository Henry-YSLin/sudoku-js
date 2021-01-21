<template>
  <div>
    <b-container class="m-0 p-0">
      <b-row no-gutters>
        <b-col>
          <num-pad @numpress="numpress"></num-pad>
        </b-col>
        <b-col>
          <ul class="m-0 p-0">
            <li>Click/tap to select a cell</li>
            <li>Click/tap and hold to select multiple cells</li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NumPad from "../components/NumPad.vue";
import store from "../store.js";

export default {
  name: "ManualInput",
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
        x.number = num;
        for (let i = 1; i <= 9; i++)
          x.possibilities[i] = !x.number || i == x.number;
        x.fixed = !!x.number;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
