import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '添加导航';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                pid: metaConfig.pid,
                name: metaConfig.name,
                link: metaConfig.link,
                sort: metaConfig.sort,
                describe: metaConfig.describe
            },
            required: ['pid', 'name', 'link']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql.table('navigation').modify(function (qb) {});
                const categoryModel = fastify.mysql.table('category');

                let categoryData = {};

                if (req.body.pid > 0) {
                    // 分类数据
                    categoryData = await categoryModel.clone().where({ id: req.body.pid }).selectOne();

                    if (!categoryData) {
                        return {
                            ...httpConfig.INSERT_FAIL,
                            msg: '分类不存在'
                        };
                    }
                }
                const result = await navigationModel.clone().insertData({
                    user_id: req.session.id,
                    pid: req.body.pid,
                    pids: req.body.pid > 0 ? categoryData.pids : '0',
                    name: req.body.name,
                    link: req.body.link,
                    sort: req.body.sort,
                    describe: req.body.describe
                });

                // 缓存全部导航
                // let rows = await navigationModel.clone().where({ user_id: req.session.id }).select(
                //     //
                //     'navigation.id',
                //     'navigation.pid',
                //     'navigation.pids',
                //     'navigation.sort',
                //     'navigation.user_id'
                // );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows);
                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
