import fetch from '../utils/fetch'

export default {
    getPaymentPlan: (data) => {
        return fetch({
            url: '/api/mineInvest/paymentPlan.do',
            method: 'post',
            data: {
                page: 1
            }
        })
    }
}
