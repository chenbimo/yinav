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
    name: {
        type: 'string',
        name: '导航名称',
        max: 20,
        default: ''
    },
    link: {
        type: 'string',
        name: '导航链接',
        max: 500,
        default: ''
    },
    level: {
        type: 'string',
        name: '导航级别',
        max: 20,
        default: ''
    },
    mode: {
        type: 'string',
        name: '导航模式',
        default: 'k',
        enum: ['k', 's']
    },
    type: {
        type: 'string',
        name: '导航类型',
        default: 'default',
        enum: ['mine', 'default']
    },
    sort: {
        type: 'bigInt',
        name: '导航排序',
        default: 1
    },
    describe: {
        type: 'string',
        name: '导航描述',
        max: 500,
        default: ''
    },
    thumbnail: {
        type: 'string',
        name: '导航缩略图',
        max: 300,
        default: ''
    },
    is_dev: {
        type: 'tinyInt',
        name: '是否开发',
        default: 0,
        enum: [0, 1]
    },
    is_private: {
        type: 'tinyInt',
        name: '是否私密',
        default: 0,
        enum: [0, 1]
    },
    is_home: {
        type: 'tinyInt',
        name: '是否主页显示',
        default: 0,
        enum: [0, 1]
    }
};
