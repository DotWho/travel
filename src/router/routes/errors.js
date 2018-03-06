import createRoute from '../create'

const router = [
    {
        path: '/timeout',
        component: createRoute('errors/timeout'),
        meta: {
            title: '无网络'
        }
    },
    {
        path: '/error/login',
        component: createRoute('errors/login'),
        meta: {
            title: '登录失效'
        }
    },
    {
        path: '*',
        component: createRoute('errors/404'),
        meta: {
            title: '404'
        }
    }
]

export default router
