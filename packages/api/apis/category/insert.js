import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '添加分类';

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
                icon: metaConfig.icon,
                sort: metaConfig.sort,
                is_private: metaConfig.is_private,
                describe: metaConfig.describe
            },
            required: ['pid', 'name', 'is_private']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const categoryModel = fastify.mysql.table('category').modify(function (qb) {});

                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    const parentData = await categoryModel.clone().where('id', req.body.pid).selectOne();
                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级分类不存在'
                        };
                    }
                    req.body.pids = `${parentData.pids},${parentData.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                if (req.body.level > 3) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '分类层级不能超过3层'
                    };
                }

                const insertData = {
                    user_id: req.session?.id,
                    pid: req.body.pid,
                    name: req.body.name,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    level: req.body.level,
                    is_private: req.body.is_private
                };
                const result = await categoryModel.clone().insertData(insertData);

                // 缓存全部分类
                // let rows = await categoryModel.clone().where({ user_id: req.session.id }).select(
                //     //
                //     'category.name',
                //     'category.id',
                //     'category.pid',
                //     'category.pids',
                //     'category.sort',
                //     'category.user_id'
                // );

                // await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows);

                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result?.[0] || 0
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
