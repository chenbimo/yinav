export const $InternalConfig = {
    // 用户令牌
    token: $Storage.local.get('token') || '',
    // 用户数据
    userData: $Storage.local.get('userData') || {},
    // 表格边框
    tableBordered: {
        cell: true
    },
    // 表格滚动
    tableScroll: {
        x: '100%',
        y: '100%',
        maxHeight: '100%'
    },
    modalShortWidth: 600,
    modalLongWidth: 1200,
    // 抽屉默认宽度
    drawerWidth: 400,
    // 每页显示数量
    pageLimit: 30
};
