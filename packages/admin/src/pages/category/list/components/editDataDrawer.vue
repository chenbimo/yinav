<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="name" label="分类名称">
                    <a-input v-model="$Data.formData.name" placeholder="请输入分类名称..." />
                </a-form-item>
                <a-form-item field="describe" label="分类描述">
                    <a-input v-model="$Data.formData.describe" placeholder="请输入分类描述..." />
                </a-form-item>
                <a-form-item field="describe" label="是否私有">
                    <a-radio-group v-model="$Data.formData.is_private">
                        <a-radio :value="1">私有分类</a-radio>
                        <a-radio :value="0">公开分类</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集
import { merge as _merge } from 'es-toolkit';

// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
    pageConfig: {
        type: Object
    },
    modelValue: {
        type: Boolean
    },
    actionType: {
        type: String,
        default: 'insertCategory'
    },
    rowData: {
        type: Object,
        default: {}
    },
    categoryItem: {
        type: Object,
        default: {}
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
        is_private: 0,
        describe: ''
    }
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        if ($Prop.actionType === 'updateData') {
            $Data.formData = _merge($Data.formData, $Prop.rowData);
        }
        if ($Prop.actionType === 'insertData') {
            $Data.formData.pid = $Prop.rowData.id;
        }
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },

    // 编辑
    async apiEditData() {
        try {
            const url = {
                insertData: '/app/category/insert',
                updateData: '/app/category/update'
            }[$Prop.actionType];
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
