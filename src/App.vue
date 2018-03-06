<template>
    <div class="app">
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            const _loading = document.querySelector('.nloging')
            _loading.remove()
        }
    }
</script>
