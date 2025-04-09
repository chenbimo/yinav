export const tableName = '分类表';
export const tableData = {
    user_id: {
        type: 'bigInt',
        name: '所属用户',
        default: 0,
        index: true
    },
    pid: {
        type: 'bigInt',
        name: '父级 ID',
        default: 0,
        index: true
    },
    pids: {
        type: 'string',
        name: '父级 ID 链',
        length: 10000,
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
        length: 100,
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
        length: 500,
        default: ''
    },
    is_private: {
        type: 'tinyInt',
        name: '是否私密',
        length: 1,
        default: 0
    }
};
