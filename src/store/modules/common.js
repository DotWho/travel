import * as types from '../mutation-types'
import Api from '../../api/common'

const user = {
    state: {
        bidding: '',
        bidding_load: true
    },
    getters: {
        bidding: state => state.bidding,
        bidding_load: state => state.bidding_load
    },
    mutations: {
        [types.SET_CMTEMP](state, data) {
            state.bidding = data
            state.bidding_load = false
        }
    },
    actions: {
        setCmtemp({ commit }, data) {
            return new Promise((resolve, reject) => {
                Api.getPaymentPlan(1).then(response => {
                    console.log(response);
                    commit(types.SET_CMTEMP, response)
                    resolve()
                }).catch(error => {
                    reject('error')
                })
            })
        }
    }
}

export default user
