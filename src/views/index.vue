<template>
    <scroll
        ref="scroll"
        :data="items"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp">
        <van-search placeholder="请输入商品名称" slot="nav" />
        <!-- <transition name="slide"> -->
            <ul class="my" slot="main" v-if="active === 0">
                <li v-for="i in items" :key="i.key" :class="i">{{i}}</li>
            </ul>
            <ul class="my" slot="main" v-if="active === 1">
                <li v-for="k in items1" :key="k.key" :class="k">{{k}}</li>
            </ul>
        <!-- </transition> -->
        <van-tabbar slot="footer" v-model="active">
            <van-tabbar-item icon="shop">标签</van-tabbar-item>
            <van-tabbar-item icon="chat" dot>标签</van-tabbar-item>
            <van-tabbar-item icon="records" info="5">标签</van-tabbar-item>
            <van-tabbar-item icon="gold-coin" info="20">标签</van-tabbar-item>
        </van-tabbar>
    </scroll>
</template>

<script>
import scroll from '../bscroll'
export default {
    data() {
        return {
            active: 0,
            items: ['我是第1行', '我是第2行', '我是第3行'],
            items1: ['我是第1行', '我是第2行', '我是第3行','我是第4行', '我是第5行', '我是第6行','我是第7行', '我是第8行'],
            itemIndex: 4
        }
    },
    methods: {
        onPullingDown() {
            // 模拟更新数据 - 下拉刷新
            setTimeout(() => {
                if (this._isDestroyed) {
                    return
                }
                if (Math.random() > 0.5) {
                    // 如果有新数据
                    this.items.unshift('更新')
                } else {
                    // 如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            }, 2000)
        },
        onPullingUp() {
            // 更新数据 - 上拉刷新
            setTimeout(() => {
                if (this._isDestroyed) {
                    return
                }
                if (this.itemIndex < 4) {
                    // 如果有新数据
                    let newPage = []
                    for (let i = 0; i < 10; i++) {
                        newPage.push(`我是第${this.itemIndex}行`)
                        this.itemIndex++
                    }

                    this.items = this.items.concat(newPage)
                } else {
                    // 如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            }, 1500)
        }
    }
}
</script>

<style scoped>
.my li {
    padding-left: 30px;
    display: block;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #000;
}
</style>
