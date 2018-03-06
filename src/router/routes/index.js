import createRoute from '../create'
import store from '../../store'

// 首屏优化
//import Home from '../../views/home/index'

const router = {
    path: '/',
    name: 'index',
    component: createRoute('index'),
    meta: {
        title: '首页'
    }
}

export default router
