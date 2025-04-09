import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/navigation.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                page: fnSchema('page'),
                limit: fnSchema('limit'),
                pid: fnSchema(tableData.pid),
                mode: fnSchema(tableData.mode),
                is_private: fnSchema(tableData.is_private),
                keyword: fnSchema('keyword'),
                level: fnSchema(tableData.level)
            },
            required: ['mode']
        },
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql //
                    .table('navigation')
                    .modify(function (qb) {
                        if (req.body.keyword) {
                            qb.where('name', 'like', `%${req.body.keyword}%`);
                        }

                        if (req.session?.role_codes !== 'dev') {
                            qb.where('is_private', 0);
                        } else {
                            if (req.body.is_private !== undefined) {
                                qb.where('is_private', req.body.is_private);
                            }
                        }
                        // 扩散模式
                        if (req.body.mode === 'k') {
                            if (req.body.pid !== undefined) {
                                qb.where(function () {
                                    this.where(fastify.mysql.raw(`FIND_IN_SET('${req.body.pid}',\`pids\`)`)).orWhere('pid', req.body.pid);
                                });
                            }
                        }
                        // 收敛模式
                        if (req.body.mode === 's') {
                            if (req.body.pid !== undefined) {
                                qb.where({ pid: req.body.pid });
                            }
                        }
                    });

                // 记录总数
                const { totalCount } = await navigationModel.clone().selectCount();

                // 记录列表
                const rows = await navigationModel
                    .clone() //
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit);
                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
