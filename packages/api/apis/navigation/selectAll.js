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
                pid: metaConfig.pid,
                type: metaConfig.type,
                mode: metaConfig.mode,
                keyword: metaConfig.keyword,
                level: metaConfig.level
            },
            required: ['type', 'mode']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql //
                    .table('navigation')
                    .modify(function (db) {
                        if (req.body.keyword) {
                            db.where('name', 'like', `%${req.body.keyword}%`);
                        }

                        // 扩散模式
                        if (req.body.mode === 'k') {
                            if (req.body.pid > 0) {
                                db.where(function () {
                                    this.where(fastify.mysql.raw(`FIND_IN_SET('${req.body.pid}',\`pids\`)`)).orWhere('pid', req.body.pid);
                                });
                            }
                        }

                        // 收敛模式
                        if (req.body.mode === 's') {
                            if (req.body.pid > 0) {
                                db.where('pid', req.body.pid);
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
