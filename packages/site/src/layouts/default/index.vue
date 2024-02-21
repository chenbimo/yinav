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
let $Router = useRouter();
let $Route = useRoute();

let $Data = $ref({
    collapsed: false,
    menuTree: []
});

let $RefLogin = $ref(null);
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
        left: $layout-menu-width;
        right: 0;
        height: $layout-header-height;
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
        top: $layout-header-height;
        right: 0;
        bottom: 0;
        left: $layout-menu-width;
        z-index: 1;
        min-height: calc(100vh - $layout-header-height);
    }
}
</style>
