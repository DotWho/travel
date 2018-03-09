import createRoute from '../create'
import store from '../../store'

// 首屏优化
import Home from '@/views/index'

const Test = r => require.ensure([], () => r(require('@/views/test.vue')), 'chunkname1')
const Test1 = r => require.ensure([], () => r(require('@/views/test1.vue')), 'chunkname2')

const router = [
    {
        path: '/',
        name: 'index',
        component: Home,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/test',
        name: 'test',
        component: createRoute('test'),
        meta: {
            title: '测试'
        }
    },
    {
        path: '/test1',
        name: 'test1',
        component: createRoute('test1'),
        meta: {
            title: '测试1'
        }
    }
]

export default router
