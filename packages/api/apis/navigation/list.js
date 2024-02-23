import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询所有导航';

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
                limit: metaConfig.limit,
                pid: metaConfig.pid,
                mode: metaConfig.mode,
                keyword: metaConfig.keyword,
                level: metaConfig.level
            },
            required: ['mode']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql //
                    .table('navigation')
                    .modify(function (qb) {
                        if (req.body.keyword) {
                            qb.where('name', 'like', `%${req.body.keyword}%`);
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
