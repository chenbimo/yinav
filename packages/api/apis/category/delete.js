import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/category.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema('id')
            },
            required: ['id']
        },
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

                await fastify.redisSet(`cacheData:navCategoryAll_${req.session?.id}`, rows);

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
