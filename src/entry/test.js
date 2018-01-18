import App from '@/views/test.vue'
import router from '@/router/test-router'
import store from '@/store/test-store'
import * as filters from '@/tools/filters'
import http from '@/tools/http'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$http = http

new Vue({ el: '#root', store, router, render: h => h(App) })

router.push('/')
