<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Code:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.code"
          placeholder="Enter a code"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Load</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Load",
  components: {},
  data() {
    return {
      form: {
        code: "",
      },
    };
  },
  props: {},
  methods: {
    onSubmit(event) {
      event.preventDefault();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
