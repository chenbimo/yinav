import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/navigation.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                page: fnSchema('page'),
                limit: fnSchema('limit')
            },
            required: []
        },
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
