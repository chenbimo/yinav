export const mysqlConfig = {
    // 开发环境配置
    development: {
        host: '127.0.0.1',
        port: 3306,
        db: 'yinav',
        username: 'root',
        password: 'root'
    },
    // 生产环境配置
    production: {
        host: '10.0.4.6',
        port: 3306,
        db: 'yinav',
        username: 'yinav',
        password: 'yinav123456'
    }
}[process.env.NODE_ENV];
