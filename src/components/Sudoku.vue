<template>
  <div>
    <table border="1">
      <tr v-for="row in gameObj.board" :key="row[0].id">
        <td v-for="item in row" :key="item.id" class="sudoku-cell">
          <SudokuCell :cellObj="item" :sudoku="gameObj" v-if="!showInternal"/>
          <InternalSudokuCell :cellObj="item" v-if="showInternal"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import SudokuCell from "./SudokuCell.vue";
import InternalSudokuCell from "./InternalSudokuCell.vue";

export default {
  name: 'Sudoku',
  components: {
    SudokuCell,
    InternalSudokuCell
  },
  props: {
    gameObj: Object,
    showInternal: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.sudoku-cell {
  text-align: center;
  vertical-align: top;
}
</style>
