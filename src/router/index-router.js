import Router from 'vue-router'
import Page1 from '@/views/index/router-page1.vue'
import Page2 from '@/views/index/router-page2.vue'

Vue.use(Router)

export default new Router({
  // mode: 'abstract',
  routes: [
    { path: '/page1', component: Page1 },
    { path: '/page2', component: Page2 }
  ]
})
