import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let navigationModel = fastify.mysql.table(metaConfig.tableName).where('user_id', req.session.id);

                let result = await navigationModel.clone().where({ id: req.body.id }).delete();

                // let rows = await navigationModel.clone().select(
                //     //
                //     'nav_navigation.id',
                //     'nav_navigation.pid',
                //     'nav_navigation.pids',
                //     'nav_navigation.sort',
                //     'nav_navigation.user_id'
                // );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);

                return {
                    ...yiapi.codeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.DELETE_FAIL;
            }
        }
    });
}
