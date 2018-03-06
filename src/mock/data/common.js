const data = {
    result: 1,
    body: '我是读取的按钮'
}

export default {
    getPaymentPlan: config => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([200, data])
            }, 200)
        })
    }
}
