import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询首页导航';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                page: metaConfig.page,
                limit: metaConfig.limit
            },
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql.table('navigation');
                const categoryModel = fastify.mysql.table('category');

                const rows = await navigationModel.clone().where({ is_home: 1 }).selectAll();

                // 处理分类
                const categoryIds = [];
                rows.forEach((item) => {
                    item.pids.split(',').forEach((id) => {
                        id = Number(id);
                        if (categoryIds.includes(id) === false && id !== 0) {
                            categoryIds.push(id);
                        }
                    });
                    if (categoryIds.includes(item.pid) === false && item.pid !== 0) {
                        categoryIds.push(item.pid);
                    }
                });

                const categoryRows = await categoryModel.clone().whereIn('id', categoryIds);

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows,
                        categoryRows: categoryRows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
