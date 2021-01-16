<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="Analyses:" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="form.analyses"
          id="checkboxes-1"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-checkbox value="DirectElimination">Direct elimination</b-form-checkbox>
          <b-form-checkbox value="NakedSingle">Naked single</b-form-checkbox>
          <b-form-checkbox value="Pairs">Pairs</b-form-checkbox>
          <b-form-checkbox value="Triples">Triples</b-form-checkbox>
          <b-form-checkbox value="XWing">X Wing</b-form-checkbox>
          <b-form-checkbox value="Swordfish">Swordfish</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <b-form-group id="input-group-2" label="Given digits:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          max="81"
          min="17"
          v-model="form.givenDigits"
          placeholder="Enter a number"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Generate</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Generate",
  components: { },
  data() {
    return {
      form: {
        analyses: [],
        givenDigits: 17
      }
    }
  },
  props: {},
  methods: {
    onSubmit(event) {
      event.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
