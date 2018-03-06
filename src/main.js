// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// components
import components from './components'

// router
import router from './router'

//添加mockjs拦截请求，模拟返回服务器数据
import mock from './mock'

// vuex-router-sync
import { sync } from 'vuex-router-sync'
sync(store, router)

// MuseUI
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'
Vue.use(Vant)

import BScroll from './bscroll'
Vue.component('scroll', BScroll)

Vue.config.productionTip = false

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     console.log(`${msg}[${lineNo}:${columnNo}]`);
// };
//
// console.error = (function (origin) {
//     return function (errorlog) {
//         console.log('console'+errorlog);
//         origin.call(console, errorlog);
//     };
// })(console.error);

import './style/base.css'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})
