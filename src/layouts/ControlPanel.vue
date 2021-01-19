<template>
  <div>
    <b-card :title="this.$route.meta.pageTitle" style="min-width:400px;">
      <div class="panel-content">
      <router-view></router-view>
      </div>
      <b-link class="card-link" v-if="this.$route.meta.backAction" @click="goBack()">Back</b-link>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "ControlPanel",
  components: {},
  props: {},
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel-content{
  padding: 8px;
}
</style>
