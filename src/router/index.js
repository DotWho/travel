import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

import Index from './routes/index'

import Errors from './routes/errors'

// 在按下 后退/前进 按钮时，简单地让页面滚动到顶部或原来的位置
// const scrollBehavior = (to, from, savedPosition) => {
//     if (savedPosition) {
//         return savedPosition
//     } else {
//         return {
//             x: 0,
//             y: 0
//         }
//     }
// }

const router = new Router({
    mode: 'history',
    //scrollBehavior,
    routes: [
        Index,
        ...Errors
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

//
//     if(store.getters.token){
//         next()
//     }
//
//     // if (to.meta.requireAuth) {
//     //     if (store.getters.token) {
//     //         next()
//     //     } else {
//     //         next({
//     //             path: '/login',
//     //             query: {// 将跳转的路由path作为参数，登录成功后跳转到该路由
//     //                 redirect: to.fullPath
//     //             },
//     //             replace: true
//     //         })
//     //     }
//     // } else {
//     // }


export default router
