import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);
let selectKeys = yiapi.utils.fnSelectFields('./tables/nav_category.json', 'user');

export let apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {
            type: metaConfig.schema.type,
            level: metaConfig.schema.level
        },
        required: ['type']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // 如果缓存命中，则读取缓存
                // if (req.body.type === 'default') {
                //     let cacheDataCategoryAll = await fastify.redisGet(`cacheData:navCategoryAll_${yiapi.appConfig.custom.nav.defaultId}`);
                //     if (cacheDataCategoryAll) {
                //         return {
                //             ...yiapi.codeConfig.SELECT_SUCCESS,
                //             data: {
                //                 rows: cacheDataCategoryAll
                //             }
                //         };
                //     }
                // } else {
                //     let cacheDataCategoryAll = await fastify.redisGet(`cacheData:navCategoryAll_${req.session.id}`);
                //     if (cacheDataCategoryAll) {
                //         return {
                //             ...yiapi.codeConfig.SELECT_SUCCESS,
                //             data: {
                //                 rows: cacheDataCategoryAll
                //             }
                //         };
                //     }
                // }
                let categoryModel = fastify.mysql.table(metaConfig.tableName).modify(function (db) {
                    if (req.body.type === 'mine') {
                        db.where({ user_id: req.session.id });
                    }
                    if (req.body.type === 'default') {
                        db.where({ user_id: yiapi.appConfig.custom.nav.defaultId });
                    }
                });

                let rows = [];
                if (req.body.level === 'mini') {
                    rows = await categoryModel.clone().select(
                        //
                        'name',
                        'id',
                        'pid',
                        'pids',
                        'sort',
                        'user_id',
                        'level'
                    );
                } else {
                    rows = await categoryModel.clone().select(selectKeys);
                }
                // 设置缓存
                // if (req.body.type === 'default') {
                //     await fastify.redisSet(`cacheData:navCategoryAll_${yiapi.appConfig.custom.nav.defaultId}`, rows, yiapi.appConfig.redis.ex);
                // } else {
                //     await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);
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
