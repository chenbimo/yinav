import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `查询${metaConfig.name}总数`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}总数接口`,
        type: 'object',
        properties: {
            type: yiapi.utils.fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default'])
        },
        required: ['type']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let categoryModel = fastify.mysql.table('nav_category').modify(function (db) {
                    if (req.body.type === 'mine') {
                        db.where({ user_id: req.session.id });
                    }
                    if (req.body.type === 'default') {
                        db.where({ user_id: yiapi.appConfig.custom.nav.defaultId });
                    }
                });

                let { total } = await categoryModel.clone().count('id', { as: 'total' }).first();
                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
