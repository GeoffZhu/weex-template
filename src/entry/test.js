import App from '@/views/test/index.vue'
import * as filters from '@/tools/filters'
import http from '@/tools/http'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(http)

new Vue({ el: '#root', render: h => h(App) })
