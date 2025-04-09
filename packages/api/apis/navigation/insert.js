import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/navigation.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                pid: fnSchema(tableData.pid),
                name: fnSchema(tableData.name),
                link: fnSchema(tableData.link),
                sort: fnSchema(tableData.sort),
                is_private: fnSchema(tableData.is_private),
                describe: fnSchema(tableData.describe)
            },
            required: ['pid', 'name', 'link', 'is_private']
        },
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
                    is_private: req.body.is_private,
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
