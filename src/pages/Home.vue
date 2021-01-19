<template>
  <div>
    <b-nav vertical>
      <b-nav-item active to="/manual-input">Manual input</b-nav-item>
      <b-nav-item to="/generate">Generate</b-nav-item>
      <b-nav-item to="/save-load">Save/Load code</b-nav-item>
      <b-nav-item active to="/analyze">Analyze</b-nav-item>
      <b-nav-item to="/play">Play</b-nav-item>
      <b-nav-item to="/solve">Solve</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
