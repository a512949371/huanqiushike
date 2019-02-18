import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import api from './modules/api'
import user from './modules/user'
import myuser from './modules/myuser'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    api,
    user,
    tagsView,
    permission,
    myuser
  },
  getters
})

export default store
