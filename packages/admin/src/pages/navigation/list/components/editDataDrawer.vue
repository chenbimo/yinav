<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditNavigation">
        <template #title>
            {{ $Prop.actionType === 'insertData' ? '添加导航' : '编辑导航' }}
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="category" label="站点分类">
                    <a-tree-select v-model="$Data.formData.pid" :data="$Data.categoryTree" :field-names="{ title: 'name', key: 'id' }" allow-search allow-clear placeholder="请选择站点分类"></a-tree-select>
                </a-form-item>
                <a-form-item field="name" label="站点名称">
                    <a-input v-model="$Data.formData.name" placeholder="请输入站点名称" />
                </a-form-item>
                <a-form-item field="link" label="站点链接">
                    <a-input v-model="$Data.formData.link" placeholder="请输入站点链接" />
                </a-form-item>
                <a-form-item field="describe" label="站点描述">
                    <a-input v-model="$Data.formData.describe" placeholder="请输入站点描述" />
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集

// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
    modelValue: {
        type: Boolean
    },
    actionType: {
        type: String,
        default: 'insertData'
    },
    rowData: {
        type: Object,
        default: {}
    },
    categoryItem: {
        type: Object,
        default: {}
    },
    menuObject: {
        type: Object,
        default: {}
    },
    categoryTree: {
        type: Array,
        default: []
    }
});

// 事件集
const $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        pid: '',
        name: '',
        link: '',
        sort: 1,
        describe: ''
    },
    categoryTree: []
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData.pid = $Prop.categoryItem.id || '';
        $Data.formData = _.merge($Data.formData, $Prop.rowData);
        $Method.apiSelectAllCategory();
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 编辑
    async apiSelectAllCategory() {
        try {
            const res = await $Http({
                url: '/category/selectAll',
                data: {}
            });
            $Data.categoryTree = tree_array2Tree(res.data.rows);
        } catch (err) {
            Message.warning({
                content: err.msg || err
            });
        }
    },
    // 编辑
    async apiEditNavigation() {
        try {
            if (!$Data.formData.pid) {
                Message.warning({
                    content: '请先选择左侧分类'
                });
                return;
            }
            const url = {
                insertData: '/navigation/insert',
                updateData: '/navigation/update'
            }[$Prop.actionType];
            if (!url) {
                Message.warning({
                    content: '无效的操作类型'
                });
                return;
            }
            const res = await $Http({
                url: url,
                data: $Data.formData
            });
            $Method.onCloseDrawer();
            $Emit('success');
        } catch (err) {
            Message.warning({
                content: err.msg || err
            });
        }
    }
};

$Method.initData();
</script>
