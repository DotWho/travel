import axios from 'axios'
import store from '../store'
import router from '../router'
import qs from 'qs'

export default function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            baseURL: process.env.BASE_API,
            timeout: 5000
        })

        instance.interceptors.request.use(config => {
            // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
            //     // 序列化
            //     config.data = qs.stringify(config.data)
            // }

            let token = store.getters.token
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            if (token) {
                config.headers.token = token
            }

            return config
        }, error => {
            return Promise.reject(error)
        })

        instance.interceptors.response.use(response => {
            return response
        }, error => {
            // 拦截错误：比如token过期
            return Promise.reject(error)
        })

        instance(options).then(response => {
            console.log(response);
            const res = response.data
            if (res.result === 1) {
                resolve(res.body)
            } else {
                if (res.result === -3) {
                    router.replace({ path: '/error/login' })
                }
                reject(res.message)
            }
        }).catch(error => {
            if(!error.response) {
                reject('网络请求超时，请重试。')
                router.replace({ path: '/timeout' })
            }else{
                reject(`网络不给力，请重试(${error.response.status})`)
            }
            if (error.response.status === 404) {
                router.replace({ path: '/error/404' })
            }
        })
    })
}
