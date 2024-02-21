import { fnSchema, fnMeta } from '@yicode/yiapi/fn.js';
import { schemaField } from '@yicode/yiapi/config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '导航分类',
    pid: fnSchema(schemaField.pid, '分类ID'),
    name: fnSchema(null, '导航名称', 'string', 1, 30),
    keyword: fnSchema(null, '关键字', 'string', 0, 20, ''),
    link: fnSchema(null, '导航链接', 'string', 0, 300),
    sort: fnSchema(schemaField.min1, '导航排序'),
    describe: fnSchema(null, '导航描述', 'string', 0, 200, ''),
    type: fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default']),
    mode: fnSchema(null, '数据模式', 'string', null, null, ['k', 's']),
    level: fnSchema(null, '数据等级', 'string', null, null, ['mini', 'medium', 'large'])
});
