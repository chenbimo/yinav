import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: yiapi.utils.fnSchema(yiapi.schemaField.id, '自增ID'),
            pid: yiapi.utils.fnSchema(yiapi.schemaField.pid, '分类ID'),
            name: yiapi.utils.fnSchema(null, '导航名称', 'string', 1, 30),
            link: yiapi.utils.fnSchema(null, '导航链接', 'string', 0, 300),
            sort: yiapi.utils.fnSchema(yiapi.schemaField.min1, '导航排序'),
            describe: yiapi.utils.fnSchema(yiapi.schemaField.describe, '导航描述')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let navigationModel = fastify.mysql.table('nav_navigation').where({ user_id: req.session.id });
                let categoryModel = fastify.mysql.table('nav_category').where({ user_id: req.session.id });

                let parentData = undefined;

                // 如果需要更换父级
                if (req.body.pid) {
                    parentData = await categoryModel.clone().where('id', req.body.pid).first();
                    if (!parentData) {
                        return {
                            ...yiapi.codeConfig.FAIL,
                            msg: '分类不存在'
                        };
                    }
                }

                // 需要更新的数据
                let updateData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    link: req.body.link,
                    sort: req.body.sort,
                    describe: req.body.describe
                };

                let updateResult = await navigationModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(yiapi.utils.fnDbUpdateData(updateData));

                let rows = await navigationModel.clone().select(
                    //
                    'nav_navigation.id',
                    'nav_navigation.pid',
                    'nav_navigation.pids',
                    'nav_navigation.sort',
                    'nav_navigation.user_id'
                );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);
                return {
                    ...yiapi.codeConfig.UPDATE_SUCCESS,
                    data: updateResult
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.UPDATE_FAIL;
            }
        }
    });
}
