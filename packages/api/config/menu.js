// 自定义菜单
export const menuConfig = [
    {
        name: '导航分类',
        path: '/category',
        children: [
            {
                path: '/category/list',
                name: '分类列表'
            }
        ]
    },
    {
        name: '导航管理',
        path: '/navigation',
        children: [
            {
                name: '导航列表',
                path: '/navigation/list'
            }
        ]
    }
];
