<template>
    <div class="page-nav-manage-site">
        <div class="page-menu">
            <div class="add-category">
                <a-button v-if="$GlobalData.token && $Data.dataType === 'mine'" type="primary" size="mini" long @click="$Method.onExecCatetoryAction('insertCategory', { id: 0 })">添加分类</a-button>
                <a-button v-else type="primary" size="mini" long>导航分类</a-button>
            </div>
            <a-scrollbar style="height: calc(100vh - 100px); overflow: auto">
                <div class="page-menu-inner">
                    <template v-if="$Data.categoryData.length <= 0">
                        <a-empty>暂无分类数据</a-empty>
                    </template>
                    <a-tree :data="$Data.categoryTree" :field-names="$Data.treeFieldNames" size="medium" showLine blockNode action-on-node-click="expand" @select="$Method.onSelectCategory">
                        <template #switcher-icon="node, { isLeaf }">
                            <IconDown v-if="!isLeaf" />
                            <icon-common v-if="isLeaf" />
                        </template>
                        <template #title="item">
                            <div class="tree-title">
                                {{ item.name }}
                                <span class="child-count">({{ item.count }})</span>
                            </div>
                        </template>
                    </a-tree>
                </div>
            </a-scrollbar>
        </div>

        <div class="page-bodyer">
            <div class="table-filter">
                <div class="left">
                    <template v-if="$Data.categoryItem?.id">
                        {{ $Data.categoryItem?.name }}
                        <a-link status="danger" @click="$Method.onResetCategory">
                            <template #icon>
                                <icon-close-circle />
                            </template>
                            重置
                        </a-link>
                    </template>
                </div>
                <div class="right">
                    <a-space>
                        <a-switch v-if="$GlobalData.token" v-model="$Data.dataType" type="round" checked-value="mine" unchecked-value="default" size="medium" checked-color="#165dff" unchecked-color="#165dff" :default-checked="true" @change="$Method.onChagneDataType">
                            <template #checked> 我的 </template>
                            <template #unchecked> 默认 </template>
                            <template #checked-icon>
                                <icon-user />
                            </template>
                            <template #unchecked-icon>
                                <icon-home class="text-blue-600" />
                            </template>
                        </a-switch>
                        <a-switch v-model="$Data.dataMode" type="round" checked-value="k" unchecked-value="s" checked-color="#165dff" unchecked-color="#165dff" :default-checked="true" @change="$Method.onChagneDataMode">
                            <template #checked> 扩散 </template>
                            <template #unchecked> 收敛 </template>
                            <template #checked-icon> K </template>
                            <template #unchecked-icon> S </template>
                        </a-switch>
                        <a-tag size="medium">分类：{{ $Data.categoryTotal }}个</a-tag>
                        <a-tag size="medium">导航：{{ $Data.navigationTotal }}个</a-tag>
                        <a-input-search v-model="$Data.keyword" :style="{ width: '150px' }" placeholder="搜索关键字" button-text="搜索" search-button allow-clear size="mini" @search="$Method.fnFreshData" />
                    </a-space>
                </div>
            </div>
            <div class="table-data">
                <a-table :data="$Data.navigationData" :pagination="false" size="mini" :scroll="$Data.tableScroll" :bordered="{ cell: true, bodyCell: false }">
                    <template #columns>
                        <a-table-column title="名称" data-index="name" :width="200" ellipsis> </a-table-column>
                        <a-table-column title="分类" data-index="category_name" :width="120" ellipsis></a-table-column>
                        <a-table-column title="链接" data-index="link" ellipsis>
                            <template #cell="{ record }">
                                <a-link :href="record.link" target="_blank">{{ record.link }}</a-link>
                            </template>
                        </a-table-column>
                        <a-table-column title="描述" data-index="describe" ellipsis> </a-table-column>
                        <a-table-column v-if="$GlobalData.token && $Data.dataType === 'mine'" title="操作" fixed="right" :width="100" align="right">
                            <template #cell="{ record }">
                                <a-dropdown position="br" size="mini" @select="$Method.onExecAction($event, record)">
                                    <a-button size="mini">操作<icon-down /></a-button>
                                    <template #content>
                                        <a-doption value="homeData"><icon-home />{{ record.is_home === 1 ? '下架首页' : '上架首页' }}</a-doption>
                                        <a-doption value="updateData"><icon-edit />编辑网址</a-doption>
                                        <a-doption value="deleteData"> <icon-delete />删除网址</a-doption>
                                    </template>
                                </a-dropdown>
                            </template>
                        </a-table-column>
                    </template>
                </a-table>
            </div>
            <div class="table-page">
                <div class="left"></div>
                <div class="center"></div>
                <div class="right">
                    <a-pagination v-model:current="$Data.pagination.page" :default-page-size="$Data.pagination.limit" :total="$Data.pagination.total" size="mini" show-total @change="$Method.fnFreshData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 外部集
import { format } from 'date-fns';

// 内部集

// 组件集

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false,
        editCategoryDrawer: false,
        deleteDataDialog: false,
        deleteCategoryDialog: false
    },
    // 操作类型
    actionType: '',
    // 行数据
    rowData: {},
    rowCategory: {},
    treeFieldNames: {
        key: 'id',
        title: 'name'
    },
    tableScroll: {
        x: '100%',
        y: '100%'
    },
    categoryData: [],
    categoryTree: [],
    categoryDataById: {},
    categoryItem: {
        id: 0
    },
    navigationData: [],
    pagination: {
        page: 1,
        limit: 30,
        total: 0
    },
    keyword: '',
    // 导航类型
    dataType: $GlobalData.token ? 'mine' : 'default',
    // 导航模式
    dataMode: 'k',
    // 分类总数
    categoryTotal: '',
    // 导航总数
    navigationTotal: ''
});

// 方法集
const $Method = {
    // 初始化数据
    async initData() {
        $Data.dataType = 'mine';
        await $Method.fnFreshData();
    },
    // 切换数据类型
    async onChagneDataType() {
        $Data.categoryItem = { id: 0 };
        $Method.fnFreshData();
    },
    // 切换数据类型
    async onChagneDataMode() {
        $Method.fnFreshData();
    },
    onResetCategory() {
        $Data.categoryItem = {
            id: 0
        };
        $Method.fnFreshData();
    },
    // 刷新所有数据
    async fnFreshData() {
        $Method.apiGetCategoryTotal();
        $Method.apiGetNavigationTotal();
        await $Method.apiGetCategoryAll();
        await $Method.apiGetNavigation();
    },
    // 触发表格行事件
    onExecAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowData = rowData;
        if ($Data.actionType === 'homeData') {
            $Method.apiHomeNavigation();
        }
        if ($Data.actionType === 'updateData') {
            $Data.isShow.editDataDrawer = true;
        }
        if ($Data.actionType === 'insertData') {
            $Data.isShow.editDataDrawer = true;
        }
        if ($Data.actionType === 'deleteData') {
            $Data.isShow.deleteDataDialog = true;
        }
    },
    // 触发分类事件
    onExecCatetoryAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowCategory = rowData;
        if ($Data.actionType === 'insertCategory') {
            $Data.isShow.editCategoryDrawer = true;
        }
        if ($Data.actionType === 'updateCategory') {
            $Data.isShow.editCategoryDrawer = true;
        }
        if ($Data.actionType === 'deleteCategory') {
            $Data.isShow.deleteCategoryDialog = true;
        }
    },
    // 选择分类
    async onSelectCategory(keys, data, cc) {
        $Data.categoryItem = _.omit(data.node, ['children']);
        await $Method.apiGetNavigation();
    },
    // 首页导航
    async apiHomeNavigation() {
        try {
            const res = await $Http({
                url: '/navigation/home',
                data: {
                    id: $Data.rowData.id
                }
            });
            Message.success({
                content: res.msg
            });
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    },
    // 删除分类
    async apiDeleteCategory() {
        try {
            const res = await $Http({
                url: '/category/delete',
                data: {
                    id: $Data.rowCategory.id
                }
            });
            await $Method.fnFreshData();
            Message.success({
                content: res.msg
            });
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    },
    // 删除导航
    async apiDeleteData() {
        try {
            const res = await $Http({
                url: '/navigation/delete',
                data: {
                    id: $Data.rowData.id
                }
            });
            await $Method.fnFreshData();
            Message.success({
                content: res.msg
            });
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    },
    // 查询分类总数
    async apiGetCategoryTotal() {
        try {
            const res = await $Http({
                url: '/category/count',
                data: {
                    type: $Data.dataType
                }
            });
            $Data.categoryTotal = res.data.total;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:224 ~ apiGeetCategoryTotal ~ err:', err);
        } finally {
        }
    },
    // 查询导航总数
    async apiGetNavigationTotal() {
        try {
            const res = await $Http({
                url: '/navigation/count',
                data: {
                    type: $Data.dataType
                }
            });
            $Data.navigationTotal = res.data.total;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:224 ~ apiGeetCategoryTotal ~ err:', err);
        } finally {
        }
    },
    // 查询分类
    async apiGetCategoryAll() {
        // 处理导航
        const navigationByPid = {
            0: 0
        };

        const resultNavigation = await $Http({
            url: '/navigation/selectAll',
            data: {
                type: $Data.dataType,
                mode: $Data.dataMode,
                page: $Data.pagination.page,
                limit: $Data.pagination.limit,
                keyword: $Data.keyword,
                level: 'mini'
            }
        });

        resultNavigation.data.rows.forEach((item) => {
            // 收敛模式
            if ($Data.dataMode === 's') {
                if (navigationByPid[item.pid] !== undefined) {
                    navigationByPid[item.pid] = navigationByPid[item.pid] + 1;
                } else {
                    navigationByPid[item.pid] = 1;
                }
            }

            // 扩散模式
            if ($Data.dataMode === 'k') {
                // 如果不是顶级分类下，则将自身的pid加到pids后面
                let pids = '';
                if (item.pid !== 0) {
                    pids = item.pids + ',' + item.pid;
                } else {
                    pids = item.pids;
                }
                let pidsArray = pids.split(',');
                pidsArray.forEach((id) => {
                    if (navigationByPid[id] !== undefined) {
                        navigationByPid[id] = navigationByPid[id] + 1;
                    } else {
                        navigationByPid[id] = 1;
                    }
                });
            }
        });

        // 处理分类
        const res = await $Http({
            url: '/category/selectAll',
            data: {
                type: $Data.dataType,
                level: 'mini'
            }
        });
        res.data.rows.forEach((item, index) => {
            const count = navigationByPid[item.id] || 0;
            item.count = count;
            item.label = `${item.name} (${count})`;
            if (index === 0 && _.isEmpty($Data.categoryItem) === true) {
                $Data.categoryItem = _.cloneDeep(item);
            }
        });
        $Data.categoryDataById = _.keyBy(res.data.rows, 'id');
        $Data.categoryData = _.cloneDeep(res.data.rows);
        $Data.categoryTree = tree_array2Tree(res.data.rows);
    },
    // 查询导航
    async apiGetNavigation() {
        try {
            const res = await $Http({
                url: '/navigation/list',
                data: {
                    type: $Data.dataType,
                    mode: $Data.dataMode,
                    pid: $Data.categoryItem.id,
                    page: $Data.pagination.page,
                    limit: $Data.pagination.limit,
                    keyword: $Data.keyword
                }
            });
            $Data.navigationData = res.data.rows.map((item) => {
                item.category_name = $Data.categoryDataById?.[item.pid]?.name || '根导航';
                item.created_at = format(item.created_at, 'yyyy-MM-dd HH:mm:ss');
                item.updated_at = format(item.updated_at, 'yyyy-MM-dd HH:mm:ss');
                return item;
            });
            $Data.pagination.total = res.data.total;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:251 ~ apiGetNavigation ~ err:', err);
        } finally {
        }
    }
};

$Method.initData();
</script>

<style lang="scss">
.page-nav-manage-site {
    $page-menu-width: 240px;
    $table-filter-height: 50px;
    $table-page-height: 40px;
    $page-header-height: 60px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    .arco-switch {
        height: 22px;
        line-height: 22px;
        .arco-switch-handle {
            height: 15px;
            width: 15px;
            top: 3px;
            color: #165dff;
            font-size: 13px;
            left: calc(100% - 16px - 2px);

            &.arco-switch-checked {
            }
            .arco-icon {
                color: inherit;
            }
        }
        .arco-switch-text {
            left: 8px;
        }
    }

    .page-menu {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: $page-menu-width;
        background-color: #fff;
        .add-category {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            padding: 9px 10px 0;
        }
        .page-menu-inner {
            padding: 10px;
        }
        .tree-title {
            .child-count {
                font-size: 12px;
                color: #ccc;
            }
        }
        .arco-tree-node-title:hover {
            background-color: transparent !important;
        }
        .tree-action {
            overflow: hidden;
            width: 0px;
            height: 0px;
        }
        .arco-tree-node:hover {
            background-color: #f2f3f5;
            padding-right: 6px;
            border-radius: 4px;
            .tree-action {
                width: auto;
                height: auto;
                display: flex;
            }
        }
        .arco-tooltip-mini {
            font-size: 12px !important;
        }
    }
    .page-bodyer {
        position: absolute;
        top: 0;
        left: $page-menu-width;
        bottom: 0;
        right: 0;
        border-left: 1px solid #eee;
        .table-filter {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: $table-filter-height;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            .arco-switch-handle {
                color: #165dff !important;
            }
            .right {
                display: flex;
                align-items: center;
            }
        }
        .table-data {
            position: absolute;
            top: $table-filter-height + 10px;
            left: 10px;
            right: 10px;
            bottom: $table-page-height + 10px;
            .arco-table .arco-table-cell {
                padding: 6px 16px;
            }
        }
        .table-page {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: $table-page-height;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #eee;
            background-color: #fafafa;
            .left {
                padding-left: 10px;
            }
        }
    }
}
</style>
