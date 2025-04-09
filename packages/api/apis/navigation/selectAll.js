import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/navigation.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                pid: fnSchema(tableData.pid),
                type: fnSchema(tableData.type),
                mode: fnSchema(tableData.mode),
                keyword: fnSchema('keyword'),
                level: fnSchema(tableData.level),
                is_private: fnSchema(tableData.is_private)
            },
            required: ['type', 'mode']
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
                            if (req.body.pid > 0) {
                                qb.where(function () {
                                    this.where(fastify.mysql.raw(`FIND_IN_SET('${req.body.pid}',\`pids\`)`)).orWhere('pid', req.body.pid);
                                });
                            }
                        }

                        // 收敛模式
                        if (req.body.mode === 's') {
                            if (req.body.pid > 0) {
                                qb.where('pid', req.body.pid);
                            }
                        }
                    });

                // 获取导航数据
                let rows = [];
                if (req.body.level === 'mini') {
                    rows = await navigationModel.clone().selectAll('id', 'pid', 'pids', 'sort', 'user_id');
                } else {
                    rows = await navigationModel.clone().selectAll();
                }

                // 设置缓存
                //     await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows);
                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
