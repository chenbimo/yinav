import * as yiapi from '@yicode/yiapi';

export const metaConfig = {
    _name: '导航网址',
    tableName: 'nav_navigation',
    schema: {
        id: yiapi.utils.fnSchema(yiapi.schemaField.id, '自增ID'),
        page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
        limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
        keyword: yiapi.utils.fnSchema(yiapi.schemaField.keyword, '关键字'),
        pid: yiapi.utils.fnSchema(yiapi.schemaField.pid, '分类ID'),
        name: yiapi.utils.fnSchema(null, '导航名称', 'string', 1, 30),
        link: yiapi.utils.fnSchema(null, '导航链接', 'string', 0, 300),
        sort: yiapi.utils.fnSchema(yiapi.schemaField.min1, '导航排序'),
        describe: yiapi.utils.fnSchema(yiapi.schemaField.describe, '导航描述'),
        type: yiapi.utils.fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default']),
        mode: yiapi.utils.fnSchema(null, '数据模式', 'string', null, null, ['k', 's']),
        level: yiapi.utils.fnSchema(null, '数据等级', 'string', null, null, ['mini', 'medium', 'large'])
    }
};
