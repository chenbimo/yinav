export const tableName = '分类表';
export const tableData = {
    user_id: {
        type: 'bigInt',
        name: '所属用户',
        default: 0,
        isIndex: true
    },
    pid: {
        type: 'bigInt',
        name: '父级 ID',
        default: 0,
        isIndex: true
    },
    pids: {
        type: 'string',
        name: '父级 ID 链',
        max: 10000,
        default: '0'
    },
    level: {
        type: 'tinyInt',
        name: '目录层级',
        default: 1
    },
    name: {
        type: 'string',
        name: '名称',
        max: 100,
        default: ''
    },
    icon: {
        type: 'string',
        name: '图标',
        max: 300,
        default: ''
    },
    sort: {
        type: 'bigInt',
        name: '字典排序',
        default: 1
    },
    describe: {
        type: 'string',
        name: '描述',
        max: 500,
        default: ''
    },
    is_private: {
        type: 'tinyInt',
        name: '是否私密',
        max: 1,
        default: 0
    }
};
