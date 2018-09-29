import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'element-ui/lib/theme-chalk/index.css'
// import 'material-design-icons/iconfont/material-icons.css'
// import ElementUI from 'element-ui'
// import VueCookies from 'vue-cookies'
import VueResource from 'vue-resource'

// Vue.use(ElementUI)
// Vue.use(VueCookies)
Vue.use(VueResource)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
