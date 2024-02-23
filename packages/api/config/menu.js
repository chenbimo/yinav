// 自定义菜单
const menuConfig = {
    // 自定义菜单演示
    // '/keyword': {
    //     name: '关键字',
    //     sort: 2,
    //     children: {
    //         '/keyword/list': {
    //             name: '关键字列表',
    //             sort: 1
    //         }
    //     }
    // }
    '/category': {
        name: '导航分类',
        sort: 2,
        children: {
            '/category/list': {
                name: '分类列表',
                sort: 1
            }
        }
    },
    '/navigation': {
        name: '导航管理',
        sort: 3,
        children: {
            '/navigation/list': {
                name: '导航列表',
                sort: 2
            }
        }
    }
};

export { menuConfig };
