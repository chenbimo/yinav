<template>
    <div class="layout-default">
        <div class="layout-header">
            <div class="header-left"></div>
            <div class="header-right"></div>
        </div>
        <div class="layout-main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
const $Router = useRouter();
const $Route = useRoute();

const $Data = $ref({
    collapsed: false,
    menuTree: []
});

const $RefLogin = $ref(null);
</script>

<style lang="scss" scoped>
.layout-default {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f8fa;
    .layout-header {
        position: absolute;
        top: 0;
        left: 240px;
        right: 0;
        height: 54px;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        z-index: 3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
            flex: 0 0 auto;
        }
        .header-right {
            flex: 0 0 auto;
        }
    }
    .layout-main {
        position: absolute;
        top: 54px;
        right: 0;
        bottom: 0;
        left: 240px;
        z-index: 1;
        min-height: calc(100vh - 54px);
    }
}
</style>
