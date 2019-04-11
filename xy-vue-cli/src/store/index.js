import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 自动引入 modules 文件夹下的 js 文件，以文件名字作为对象的key
const modulesContext = require.context('./modules', false, /.*\.js/)
const modules = modulesContext.keys().reduce((prev, cur) => {
  const key = cur.match(/(\w+)\.js/)[1]
  prev[key] = modulesContext(cur).default
  return prev
}, {})

export default new Vuex.Store({
  modules
})
