<template>
  <div>
    <key-listener @keypress="keypress" @keydown="keydown"></key-listener>
    <table id="table">
      <tr>
        <td>
          <b-button variant="outline-primary" @click="click(1)">1</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(2)">2</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(3)">3</b-button>
        </td>
      </tr>
      <tr>
        <td>
          <b-button variant="outline-primary" @click="click(4)">4</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(5)">5</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(6)">6</b-button>
        </td>
      </tr>
      <tr>
        <td>
          <b-button variant="outline-primary" @click="click(7)">7</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(8)">8</b-button>
        </td>
        <td>
          <b-button variant="outline-primary" @click="click(9)">9</b-button>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <b-button
            class="w-full btn-block"
            variant="outline-primary"
            @click="click(null)"
            >Delete</b-button
          >
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import KeyListener from "./KeyListener.vue";
export default {
  name: "NumPad",
  components: {
    KeyListener,
  },
  props: {},
  methods: {
    click(e) {
      this.$emit("numpress", e);
    },
    keypress(e) {
      if (/^[1-9]$/i.test(e.key)) {
        this.$emit("numpress", e.key);
      }
    },
    keydown(e) {
      var key = e.keyCode || e.charCode;
      if (key == 8 || key == 46) this.$emit("numpress", null);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#table td {
  padding: 4px;
}
</style>
