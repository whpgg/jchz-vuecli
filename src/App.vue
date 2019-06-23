<template>
  <div class="App">
    <div>
      <router-link to="/Home">Home</router-link>
      <router-link to="/About">About</router-link>
    </div>
    <div>
      <p>{{Counters}}</p>
      <button @click="add">add</button>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['Counters'])
  },
  methods: {
    ...mapActions(['addContener'])
  }
};
</script>
<style lang="scss" scoped>
.App {
}
</style>