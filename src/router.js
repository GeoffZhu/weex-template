import Router from 'vue-router'
import Home from './views/home.vue'
import Page2 from './views/page2.vue'

Vue.use(Router)

export default new Router({
  // mode: 'abstract',
  routes: [
    { path: '/', component: Home },
    { path: '/page2', component: Page2 }
  ]
})
