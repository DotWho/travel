import Mock from 'mockjs'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
const mock = new MockAdapter(axios)
//['get', 'post', 'delete', 'put']

import commonAPI from './data/common'

// https://github.com/ctimmerm/axios-mock-adapter
// Mock any GET request to /users
// arguments for reply are (status, data, headers)

// commonAPI
mock.onPost('/api/mineInvest/paymentPlan.do').reply(commonAPI.getPaymentPlan)

export default Mock
