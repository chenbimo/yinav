import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '删除导航分类';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.body.id <= 0) {
                    return {
                        ...httpConfig.DELETE_FAIL,
                        msg: '根导航分类不能删除'
                    };
                }
                const categoryModel = fastify.mysql.table('category');

                // 判断是否有下级分类
                const childCategoryData = await categoryModel.clone().where({ pid: req.body.id }).first();
                if (childCategoryData) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '该分类存在下级分类，请将下级分类转移后操作'
                    };
                }

                const result = await categoryModel.clone().where({ id: req.body.id }).delete();

                const rows = await categoryModel.clone().select(
                    //
                    'category.name',
                    'category.id',
                    'category.pid',
                    'category.pids',
                    'category.sort',
                    'category.user_id'
                );

                await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows);

                return {
                    ...httpConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
