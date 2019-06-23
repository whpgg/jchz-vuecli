import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  counter: 0
}
const actions = {
  addContener: ({commit}) => {
    return commit('add')
  }
}
const mutations = {
  add: (state) => {
    state.counter++
  }
}
const getters = {
  Counters (state) {
    return state.counter
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})