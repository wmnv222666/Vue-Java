import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import warehouse from './module/warehouse'
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    warehouse
  }
})
