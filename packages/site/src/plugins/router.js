import { yiteRoutes } from 'virtual:yite-router';

// 创建路由
let $Router = createRouter({
    routes: yiteRoutes(),
    history: createWebHashHistory()
});

export { $Router };
