<template>
  <div id="cell" class="noselect">
    <pre class="possibilities">{{
      [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
        (sum, x) => (sum += cellObj.possibilities[x] ? x : " "),
        ""
      )
    }}</pre>
    <div class="big-number" :class="cellObj.fixed ? 'fixed-number' : null">
      {{ cellObj.number }}
    </div>
  </div>
</template>

<script>
export default {
  name: "InternalSudokuCell",
  props: {
    cellObj: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#cell {
  width: 50px;
  height: 50px;
  position: relative;
}
.possibilities {
  font-size: 0.5em;
  margin-top: 0px;
  font-family: Consolas, monospace;
}
.big-number {
  color: blue;
  font-size: 2em;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  text-align: center;
  line-height: 50px;
}
.fixed-number {
  color: black;
}
</style>
