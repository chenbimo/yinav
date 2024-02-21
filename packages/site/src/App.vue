<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<script setup>
let { $GlobalData } = useGlobal();

onMounted(() => {});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
