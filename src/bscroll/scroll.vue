<template>
  <div class="wrapper">
    <header>
        <slot name="nav"></slot>
    </header>
    <main ref="wrapper">
        <div>
            <div ref="listWrapper">
                <slot name="main"></slot>
            </div>
            <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
                <div class="pullup-wrapper" v-if="pullUpLoad">
                    <div class="before-trigger" v-if="!isPullUpLoad">
                        <span>{{pullUpTxt}}</span>
                    </div>
                    <div class="after-trigger" v-else>
                        loading
                    </div>
                </div>
            </slot>
        </div>
        <slot name="pulldown"
            :pullDownRefresh="pullDownRefresh"
            :pullDownStyle="pullDownStyle"
            :beforePullDown="beforePullDown"
            :isPullingDown="isPullingDown">
            <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
                <div class="before-trigger" v-if="beforePullDown">
                    bubble
                </div>
                <div class="after-trigger" v-else>
                    <div v-if="isPullingDown" class="loading">
                        loading
                    </div>
                    <div v-else>
                        <span>{{refreshTxt}}</span>
                    </div>
                </div>
            </div>
        </slot>
    </main>
    <footer>
        <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
function getRect(el) {
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect()
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }
    } else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
    }
}

const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
    name: COMPONENT_NAME,
    props: {
        data: {
            type: Array,
            default: function() {
                return []
            }
        },
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        listenBeforeScroll: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        scrollbar: {
            type: null,
            default: false
        },
        pullDownRefresh: {
            type: null,
            default: function () {
                return {
                    threshold: 90,
                    stop: 40
                }
            }
        },
        pullUpLoad: {
            type: null,
            default: true
        },
        startY: {
            type: Number,
            default: 0
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        freeScroll: {
            type: Boolean,
            default: false
        },
        mouseWheel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            beforePullDown: true,
            isRebounding: false,
            isPullingDown: false,
            isPullUpLoad: false,
            pullUpDirty: true,
            pullDownStyle: ''
        }
    },
    computed: {
        pullUpTxt() {
            const moreTxt =
                (this.pullUpLoad &&
                    this.pullUpLoad.txt &&
                    this.pullUpLoad.txt.more) ||
                '上拉刷新'

            const noMoreTxt =
                (this.pullUpLoad &&
                    this.pullUpLoad.txt &&
                    this.pullUpLoad.txt.noMore) ||
                '没有更多数据'

            return this.pullUpDirty ? moreTxt : noMoreTxt
        },
        refreshTxt() {
            return (
                (this.pullDownRefresh && this.pullDownRefresh.txt) ||
                '刷新完成'
            )
        }
    },
    created() {
        this.pullDownInitTop = -50
    },
    mounted() {
        setTimeout(() => {
            this.initScroll()
        }, 20)
    },
    methods: {
        initScroll() {
            if (!this.$refs.wrapper) {
                return
            }
            if (
                this.$refs.listWrapper &&
                (this.pullDownRefresh || this.pullUpLoad)
            ) {
                this.$refs.listWrapper.style.minHeight = `${getRect(
                    this.$refs.wrapper
                ).height + 1}px`
            }

            let options = {
                probeType: this.probeType,
                click: this.click,
                scrollY: this.freeScroll || this.direction === DIRECTION_V,
                scrollX: this.freeScroll || this.direction === DIRECTION_H,
                scrollbar: this.scrollbar,
                pullDownRefresh: this.pullDownRefresh,
                pullUpLoad: this.pullUpLoad,
                startY: this.startY,
                freeScroll: this.freeScroll,
                mouseWheel: this.mouseWheel
            }

            this.scroll = new BScroll(this.$refs.wrapper, options)

            if (this.listenScroll) {
                this.scroll.on('scroll', pos => {
                    this.$emit('scroll', pos)
                })
            }

            if (this.listenBeforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScrollStart')
                })
            }

            if (this.pullDownRefresh) {
                this._initPullDownRefresh()
            }

            if (this.pullUpLoad) {
                this._initPullUpLoad()
            }
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll &&
                this.scroll.scrollToElement.apply(this.scroll, arguments)
        },
        destroy() {
            this.scroll.destroy()
        },
        forceUpdate(dirty) {
            if (this.pullDownRefresh && this.isPullingDown) {
                this.isPullingDown = false
                this._reboundPullDown().then(() => {
                    this._afterPullDown()
                })
            } else if (this.pullUpLoad && this.isPullUpLoad) {
                this.isPullUpLoad = false
                this.scroll.finishPullUp()
                this.pullUpDirty = dirty
                this.refresh()
            } else {
                this.refresh()
            }
        },
        _initPullDownRefresh() {
            this.scroll.on('pullingDown', () => {
                this.beforePullDown = false
                this.isPullingDown = true
                this.$emit('pullingDown')
            })

            this.scroll.on('scroll', pos => {
                if (this.beforePullDown) {
                    this.pullDownStyle = `top:${Math.min(
                        pos.y + this.pullDownInitTop,
                        10
                    )}px`
                }

                if (this.isRebounding) {
                    this.pullDownStyle = `top:${10 -
                        (this.pullDownRefresh.stop - pos.y)}px`
                }
            })
        },
        _initPullUpLoad() {
            this.scroll.on('pullingUp', () => {
                this.isPullUpLoad = true
                this.$emit('pullingUp')
            })
        },
        _reboundPullDown() {
            const { stopTime = 600 } = this.pullDownRefresh
            return new Promise(resolve => {
                setTimeout(() => {
                    this.isRebounding = true
                    this.scroll.finishPullDown()
                    resolve()
                }, stopTime)
            })
        },
        _afterPullDown() {
            setTimeout(() => {
                this.pullDownStyle = `top:${this.pullDownInitTop}px`
                this.beforePullDown = true
                this.isRebounding = false
                this.refresh()
            }, this.scroll.options.bounceTime)
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this.forceUpdate(true)
            }, this.refreshDelay)
        }
    }
}
</script>

<style scoped>
.pullup-wrapper {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
}
.pulldown-wrapper {
    position: absolute;
    left: 0;
    z-index: -1;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    transition: all;
}
</style>
