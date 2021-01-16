<template>
  <div>
    <table id="table">
      <tr>
        <td>
          <b-button variant="outline-primary">1</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">2</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">3</b-button>
        </td>
      </tr>
      <tr>
        <td>
          <b-button variant="outline-primary">4</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">5</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">6</b-button>
        </td>
      </tr>
      <tr>
        <td>
          <b-button variant="outline-primary">7</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">8</b-button>
        </td>
        <td>
          <b-button variant="outline-primary">9</b-button>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <b-button class="w-full btn-block" variant="outline-primary">Delete</b-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "NumPad",
  components: {},
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#table td {
  padding: 4px;
}
</style>
