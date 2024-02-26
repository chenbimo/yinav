import { fnSchema, fnMeta } from '@yicode/yiapi/fn.js';
import { schemaField } from '@yicode/yiapi/config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '导航分类',
    pid: fnSchema(schemaField.pid, '父级分类ID'),
    name: fnSchema(null, '分类名称', 'string', 1, 30),
    icon: fnSchema(schemaField.image, '分类图标'),
    sort: fnSchema(schemaField.min1, '分类排序'),
    is_private: fnSchema(schemaField.boolEnum, '是否私有'),
    describe: fnSchema(null, '分类描述', 'string', 0, 200, ''),
    type: fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default']),
    mode: fnSchema(null, '数据模式', 'string', null, null, ['k', 's']),
    level: fnSchema(null, '数据等级', 'string', null, null, ['mini', 'medium', 'large']),
    keyword: fnSchema(null, '关键字', 'string', 0, 20, '')
});
