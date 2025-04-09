import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/category.js';

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
                const categoryModel = fastify.mysql //
                    .table('category')
                    .modify(function (qb) {
                        if (req.session?.role_codes !== 'dev') {
                            qb.where('is_private', 0);
                        } else {
                            if (req.body.is_private !== undefined) {
                                qb.where('is_private', req.body.is_private);
                            }
                        }
                    });

                // 记录总数
                const { totalCount } = await categoryModel
                    .clone() //
                    .selectCount();

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
