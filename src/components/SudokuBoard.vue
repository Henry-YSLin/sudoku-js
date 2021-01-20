<template>
  <div>
    <table
      border="1"
      cellspacing="0"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      @touchcancel="touchcancel"
    >
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
      ongoingTouches: [],
    };
  },
  methods: {
    copyTouch(touch) {
      return {
        identifier: touch.identifier,
        screenX: touch.screenX,
        screenY: touch.screenY,
        clientX: touch.clientX,
        clientY: touch.clientY,
        pageX: touch.pageX,
        pageY: touch.pageY,
        target: touch.target,
        radiusX: touch.radiusX,
        radiusY: touch.radiusY,
        rotationAngle: touch.rotationAngle,
        force: touch.force,
      };
    },
    touchstart(e) {
      e.preventDefault();
      if (this.ongoingTouches.length === 0 && !e.ctrlKey)
        this.$emit("deselect");
      var touches = e.changedTouches;

      for (var i = 0; i < touches.length; i++) {
        this.ongoingTouches.push(this.copyTouch(touches[i]));
        let elm = document.elementFromPoint(
          touches[i].clientX,
          touches[i].clientY
        );
        let inst = elm.__vue__;
        if (!inst) inst = elm.closest(".sudoku-cell > .cell")?.__vue__;
        if (!inst) continue;
        let item = inst.cellObj;
        if (!!item && !this.selectedCells.includes(item))
          this.$emit("select", item);
      }
    },
    touchmove(e) {
      e.preventDefault();
      var touches = e.changedTouches;

      for (var i = 0; i < touches.length; i++) {
        var idx = this.ongoingTouches.findIndex(
          (x) => x.identifier === touches[i].identifier
        );

        if (idx >= 0) {
          this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
          let elm = document.elementFromPoint(
            this.ongoingTouches[idx].clientX,
            this.ongoingTouches[idx].clientY
          );
          let inst = elm.__vue__;
          if (!inst) inst = elm.closest(".sudoku-cell > .cell")?.__vue__;
          if (!inst) continue;
          let item = inst.cellObj;
          if (!!item && !this.selectedCells.includes(item))
            this.$emit("select", item);
        } else {
          console.log("can't figure out which touch to continue");
        }
      }
    },
    touchend(e) {
      e.preventDefault();
      var touches = e.changedTouches;

      for (var i = 0; i < touches.length; i++) {
        var idx = this.ongoingTouches.findIndex(
          (x) => x.identifier === touches[i].identifier
        );

        if (idx >= 0) {
          this.ongoingTouches.splice(idx, 1);
        } else {
          console.log("can't figure out which touch to end");
        }
      }
    },
    touchcancel(e) {
      e.preventDefault();
      var touches = e.changedTouches;

      for (var i = 0; i < touches.length; i++) {
        var idx = this.ongoingTouches.findIndex(
          (x) => x.identifier === touches[i].identifier
        );
        this.ongoingTouches.splice(idx, 1);
      }
    },
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
