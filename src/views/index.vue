<template>
  <div class="app-container" bubble="true">
    <text class="title">weex-template</text>
    <img class="logo" src="https://sfault-image.b0.upaiyun.com/316/440/3164400520-5a5f200cd55d8_articlex" alt="logo">
    <div class="btn-group">
      <text class="btn" @click="onVueRouterJump">vue-router跳转</text>
      <text class="btn" @click="onWeexRouterJump">weex-router跳转</text>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { initIconfont, setBundleUrl } from '../tools/utils'
const navigator = weex.requireModule('navigator')
export default {
  name: 'app',
  created () {
    initIconfont()
  },
  methods: {
    onWeexRouterJump () {
      navigator.push({
        url: setBundleUrl(weex.config.bundleUrl, 'test.js'),
        animated: 'true'
      })
    },
    onVueRouterJump () {
      this.$router.push('/page2')
    }
  }
}
</script>

<style scoped>
.app-container {
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 50px;
  text-align: center;
}
.logo {
  height: 120px;
  width: 242px;
  margin-top: 80px;
  margin-bottom: 80px;
}
.btn-group {
  flex-direction: row;
}
.btn {
  color: #ffffff;
  background-color: #46b4ff;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
}
</style>
