import * as yiapi from '@yicode/yiapi';

export const metaConfig = {
    _name: '导航分类',
    tableName: 'nav_category',
    schema: {
        id: yiapi.utils.fnSchema(yiapi.schemaField.id, '自增ID'),
        page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
        limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
        pid: yiapi.utils.fnSchema(yiapi.schemaField.pid, '父级分类ID'),
        name: yiapi.utils.fnSchema(null, '分类名称', 'string', 1, 30),
        icon: yiapi.utils.fnSchema(yiapi.schemaField.image, '分类图标'),
        sort: yiapi.utils.fnSchema(yiapi.schemaField.min1, '分类排序'),
        describe: yiapi.utils.fnSchema(yiapi.schemaField.describe, '分类描述'),
        type: yiapi.utils.fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default']),
        mode: yiapi.utils.fnSchema(null, '数据模式', 'string', null, null, ['k', 's']),
        level: yiapi.utils.fnSchema(null, '数据等级', 'string', null, null, ['mini', 'medium', 'large'])
    }
};
