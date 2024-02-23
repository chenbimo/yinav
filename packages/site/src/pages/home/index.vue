<template>
    <div class="page-index" :style="{ backgroundImage: 'url(' + utilGetAssets('back1.jpg') + ')' }">
        <div class="wrapper" :class="{ is_edit: $Data.isEdit === true }">
            <div class="logo-img" @click="gotoDashboard">
                <img :src="utilGetAssets('site.png')" />
            </div>
            <div class="logo-text">{{ $GlobalData.userData.nickname }}</div>
            <!-- <div class="search">
                <a-input-search :style="{ width: '420px' }" placeholder="请输入搜索内容" size="large" search-button>
                    <template #prepend>
                        <a-select :style="{ width: '80px' }">
                            <a-option>百度</a-option>
                            <a-option>谷歌</a-option>
                            <a-option>搜狗</a-option>
                        </a-select>
                    </template>
                    <template #button-icon>
                        <icon-search />
                    </template>
                    <template #button-default> 搜索 </template>
                </a-input-search>
            </div> -->
            <div class="tabs">
                <div class="tab-line">
                    <div class="tab" :class="{ active: item.id === $Data.category1Item.id }" v-for="item in $Computed.category1Data" :key="item.id" @click="$Method.onChangeCategory1(item)">{{ item.name }}</div>
                </div>
                <div class="tab-line" v-if="$Computed.category2Data.length > 0">
                    <div class="tab" :class="{ active: item.id === $Data.category2Item.id }" v-for="item in $Computed.category2Data" :key="item.id" @click="$Method.onChangeCategory2(item)">{{ item.name }}</div>
                </div>
                <div class="tab-line" v-if="$Computed.category3Data.length > 0">
                    <div class="tab" :class="{ active: item.id === $Data.category3Item.id }" v-for="item in $Computed.category3Data" :key="item.id" @click="$Method.onChangeCategory3(item)">{{ item.name }}</div>
                </div>
            </div>
            <div class="navs">
                <a-row class="nav-row" :gutter="20" justify="center">
                    <a-col :xs="8" :sm="6" :md="5" :lg="4" :xl="3" :xxl="2" v-for="item in $Computed.navigationData" :key="item.id">
                        <div class="box">
                            <div class="img bg-contain" :style="{ backgroundImage: 'url(' + utilGetAssets('site2.png') + ')' }"></div>
                            <div class="txt">{{ item.name }}</div>
                            <div class="close" :class="{ is_edit: $Data.isEdit === true }" @click="$Method.apiDownHome(item)">
                                <icon-close />
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="footer">
                <a-button-group size="mini">
                    <a-tooltip content="随易科技官网">
                        <a-button @click="$Method.gotoYicodeTech"> <icon-home /> </a-button>
                    </a-tooltip>
                    <template v-if="$GlobalData.userData.id">
                        <a-tooltip content="编辑网址导航">
                            <a-button @click="$Data.isEdit = !$Data.isEdit"> <icon-edit /> </a-button>
                        </a-tooltip>
                    </template>
                    <a-tooltip content="访问个人中心">
                        <a-button @click="$Method.gotoUserCenter"> <icon-user /> </a-button>
                    </a-tooltip>
                </a-button-group>
            </div>
        </div>
    </div>
</template>

<script setup>
// 外部集

// 外部集

// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();
const $Router = useRouter();

// 数据集
const $Data = $ref({
    isEdit: false,
    categoryTree: [],
    categoryRows: [],
    navigationRows: [],
    categoryObject: {},
    category1Item: {},
    category2Item: {},
    category3Item: {}
});

// 计算集
const $Computed = $ref({
    category1Data: computed(() => {
        return $Data.categoryRows.filter((item) => {
            return item.pid === 0;
        });
    }),
    category2Data: computed(() => {
        if ($Data?.category1Item?.id) {
            return $Data.categoryRows.filter((item) => {
                return item.pid === $Data.category1Item.id;
            });
        } else {
            return [];
        }
    }),
    category3Data: computed(() => {
        if ($Data?.category2Item?.id) {
            return $Data.categoryRows.filter((item) => {
                return item.pid === $Data.category2Item.id;
            });
        } else {
            return [];
        }
    }),
    navigationData: computed(() => {
        let pid = $Data.category1Item?.id || $Data.category2Item?.id || $Data.category3Item?.id;
        if (pid) {
            return $Data.navigationRows.filter((item) => {
                return item.pids.indexOf(String(pid)) !== -1;
            });
        } else {
            return [];
        }
    })
});

// 方法集
const $Method = {
    // 初始化数据
    async initData() {
        await $GlobalMethod.apiGetUserDetail();
        $Method.apiGetAllHomeNavigation();
    },
    // 跳到随易科技首页
    gotoYicodeTech() {
        window.open('https://yicode.tech', '_blank');
    },
    // 跳到个人中心
    gotoUserCenter() {
        window.open('https://user.yicode.tech', '_blank');
    },
    // 跳到管理中心
    gotoAdminCenter() {
        window.open('https://nav.yicode.tech/#/admin', '_blank');
    },
    // 改变分类1
    onChangeCategory1(item) {
        $Data.category1Item = item || {};
        $Data.category2Item = $Data.category1Item?.children?.[0] || {};
        $Data.category3Item = $Data.category2Item?.children?.[0] || {};
    },
    // 改变分类2
    onChangeCategory2(item) {
        $Data.category2Item = item || {};
        $Data.category3Item = $Data.category2Item?.children?.[0] || {};
    },
    // 改变分类3
    onChangeCategory3(item) {
        $Data.category3Item = item || {};
    },
    // 下架首页
    async apiDownHome(item) {
        try {
            let res = await $Http({
                url: '/nav/navigation/home',
                data: {
                    id: item.id
                }
            });
            Message.success({
                content: res.msg
            });
        } catch (err) {
            console.log('🚀 ~ file: index.vue:224 ~ apiGeetCategoryTotal ~ err:', err);
        }
    },
    // 查询所有首页导航
    async apiGetAllHomeNavigation() {
        try {
            let res = await $Http({
                url: '/nav/navigation/selectAllHome',
                data: {}
            });

            $Data.categoryRows = res.data.categoryRows;
            $Data.navigationRows = _.cloneDeep(res.data.rows);
            $Data.categoryTree = tree_array2Tree(res.data.categoryRows);
            $Data.categoryObject = _.keyBy(res.data.categoryRows, 'id');
            $Data.category1Item = $Data.categoryTree?.[0] || {};
            $Data.category2Item = $Data.category1Item?.children?.[0] || {};
            $Data.category3Item = $Data.category2Item?.children?.[0] || {};
        } catch (err) {
            console.log('🚀 ~ file: index.vue:224 ~ apiGeetCategoryTotal ~ err:', err);
        }
    }
};

$Method.initData();
</script>

<style scoped lang="scss">
.page-index {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    .wrapper {
        display: flex;
        flex-direction: column;
        width: 60vw;
        height: 70vh;
        background-color: rgba(255, 255, 255, 0.3);
        padding: 30px 80px 15px;
        border-radius: 6px;
        position: relative;
        // &::after {
        //     content: '';
        //     width: 50vw;
        //     height: 70vh;
        //     background: inherit;
        //     position: absolute;
        //     left: 0;
        //     right: 0;
        //     top: -25px;
        //     bottom: 0;
        //     box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.05);
        //     filter: blur(10px);
        // }
        .logo-img {
            position: absolute;
            height: 80px;
            top: -50px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;

            img {
                max-height: 100%;
                border-radius: 6px;
                overflow: hidden;
            }
        }
        .logo-text {
            text-align: center;
            font-size: 26px;
            flex: 0 0 auto;
            margin-top: 20px;
            color: #fff;
        }
        .search {
            flex: 0 0 auto;
            flex: 0 0 auto;
            margin: 30px 0 10px;
            display: flex;
            justify-content: center;
            .search-group {
                border: 1px solid #ddd;
            }
            :deep(.arco-input-append) {
                padding: 0 0;
            }
        }
        .tabs {
            flex: 0 0 auto;
            margin: 20px 0 20px;
            .tab-line {
                overflow-x: auto;
                text-align: center;
                display: flex;
                justify-content: center;

                .tab {
                    height: 26px;
                    line-height: 24px;
                    background-color: rgba(255, 255, 255, 0.6);
                    padding: 0 8px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    font-size: 13px;
                    margin-bottom: -1px;
                    cursor: pointer;
                    transition: all 0.2s;
                    // border-radius: 2px;
                    &.active {
                        color: #e33;
                    }
                    &:hover {
                        background-color: #eee;
                    }
                }
                &::-webkit-scrollbar-thumb {
                    // border-radius: 0px;
                    // border: 4px solid transparent;
                    // background-color: rgba(120, 120, 120, 0.4);
                    background-clip: padding-box;
                }

                &::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
            }
        }
        .navs {
            flex: 1 1 100%;
            // background-color: #f9f9f9;
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: flex-start;
            width: 100%;
            .nav-row {
                width: 100%;
            }
            .box {
                position: relative;
                .close {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 16px;
                    height: 16px;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                    border-radius: 2px;
                    transition: all 0.2s;
                    cursor: pointer;
                    color: #999;
                    &.is_edit {
                        display: flex;
                    }
                    &:hover {
                        background-color: #eee;
                    }
                }
                .img {
                    height: 50px;
                    opacity: 0.6;
                    border-radius: 4px;
                    overflow: hidden;
                    background-color: #fff;
                    background-size: 60% auto;
                }
                .txt {
                    height: 32px;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                    margin-top: 5px;
                    overflow: hidden;
                    color: #fff;
                    text-shadow: 0px 0px 1px #000;
                }
            }
        }
        .footer {
            flex: 0 0 auto;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
