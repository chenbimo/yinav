import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新导航';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id,
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
                const navigationModel = fastify.mysql.table('navigation');
                const categoryModel = fastify.mysql.table('category');

                let parentData = {};

                // 如果需要更换父级
                if (req.body.pid) {
                    parentData = await categoryModel.clone().where('id', req.body.pid).selectOne();
                    if (!parentData.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '分类不存在'
                        };
                    }
                }

                const result = await navigationModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        pid: req.body.pid,
                        name: req.body.name,
                        link: req.body.link,
                        sort: req.body.sort,
                        describe: req.body.describe
                    });

                // let rows = await navigationModel.clone().select(
                //     //
                //     'navigation.id',
                //     'navigation.pid',
                //     'navigation.pids',
                //     'navigation.sort',
                //     'navigation.user_id'
                // );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows);
                return {
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
