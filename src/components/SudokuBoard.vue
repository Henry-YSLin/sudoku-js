<template>
  <div>
    <table border="1" cellspacing="0">
      <tr v-for="row in gameObj.board" :key="row[0].id">
        <td
          v-for="item in row"
          :key="item.id"
          class="sudoku-cell"
          :class="selectedCells.includes(item) ? 'selected-cell' : null"
        >
          <sudoku-cell
            :cellObj="item"
            :sudoku="gameObj"
            v-if="!showInternal"
            @mousedown.native="(e) => mousedown(e, item)"
            @click.native="(e) => click(e, item)"
            @mouseover.native="(e) => mouseover(e, item)"
          />
          <internal-sudoku-cell
            :cellObj="item"
            v-if="showInternal"
            @mousedown.native="(e) => mousedown(e, item)"
            @click.native="(e) => click(e, item)"
            @mouseover.native="(e) => mouseover(e, item)"
          />
        </td>
      </tr>
    </table>

    <div class="mt-4">
      <b-form-checkbox id="showInternalCheckbox" v-model="showInternal"
        >Show all possibilities</b-form-checkbox
      >
    </div>
  </div>
</template>

<script>
import SudokuCell from "./SudokuCell.vue";
import InternalSudokuCell from "./InternalSudokuCell.vue";

export default {
  name: "SudokuBoard",
  components: {
    SudokuCell,
    InternalSudokuCell,
  },
  props: {
    gameObj: Object,
    selectedCells: Array,
  },
  data() {
    return {
      showInternal: false,
    };
  },
  methods: {
    mousedown(e, item) {
      if (!e.ctrlKey) this.$emit("deselect");
      this.$emit("select", item);
    },
    click(e, item) {
      if (!e.ctrlKey) this.$emit("deselect");
      this.$emit("select", item);
    },
    mouseover(e, item) {
      if (e.buttons === 1) {
        if (!this.selectedCells.includes(item)) this.$emit("select", item);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.selected-cell {
  background-color: burlywood;
}
.sudoku-cell {
  text-align: center;
  vertical-align: top;
}
td {
  border: 1px solid;
  text-align: center;
}
td:first-child {
  border-left: solid;
}
td:nth-child(3n) {
  border-right: solid;
}
tr:first-child td {
  border-top: solid;
}
tr:nth-child(3n) td {
  border-bottom: solid;
}
</style>
