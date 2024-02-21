import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);
let selectKeys = yiapi.utils.fnSelectFields('./tables/nav_navigation.json', 'user');

export let apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            pid: metaConfig.schema.pid,
            type: metaConfig.schema.type,
            mode: metaConfig.schema.mode,
            keyword: metaConfig.schema.keyword,
            level: metaConfig.schema.level
        },
        required: ['type', 'mode']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // 如果缓存命中，则读取缓存
                // if (req.body.type === 'default') {
                //     let cacheDataNavigationAll = await fastify.redisGet(`cacheData:navigationAll_${yiapi.appConfig.custom.nav.defaultId}`);
                //     if (cacheDataNavigationAll) {
                //         return {
                //             ...yiapi.codeConfig.SELECT_SUCCESS,
                //             data: {
                //                 rows: cacheDataNavigationAll
                //             }
                //         };
                //     }
                // } else {
                //     let cacheDataNavigationAll = await fastify.redisGet(`cacheData:navigationAll_${req.session.id}`);
                //     if (cacheDataNavigationAll) {
                //         return {
                //             ...yiapi.codeConfig.SELECT_SUCCESS,
                //             data: {
                //                 rows: cacheDataNavigationAll
                //             }
                //         };
                //     }
                // }

                let navigationModel = fastify.mysql //
                    .table(metaConfig.tableName)
                    .modify(function (db) {
                        if (req.body.type === 'mine') {
                            db.where('user_id', req.session.id);
                        }

                        if (req.body.type === 'default') {
                            db.where('user_id', yiapi.appConfig.custom.nav.defaultId);
                        }

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
                    rows = await navigationModel.clone().select('id', 'pid', 'pids', 'sort', 'user_id');
                } else {
                    rows = await navigationModel.clone().select(selectKeys);
                }

                // 设置缓存
                // if (req.body.type === 'default') {
                //     await fastify.redisSet(`cacheData:navigationAll_${yiapi.appConfig.custom.nav.defaultId}`, rows, yiapi.appConfig.redis.ex);
                // } else {
                //     await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);
                // }
                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
