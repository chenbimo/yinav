import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
            limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
            pid: yiapi.utils.fnSchema(yiapi.schemaField.pid, '分类ID')
        }
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let categoryModel = fastify.mysql //
                    .table('navigation')
                    .where({
                        user_id: req.session.id
                    })
                    .modify(function (db) {
                        if (req.body.pid > 0) db.where({ pid: req.body.pid });
                    });

                let { total } = await categoryModel.clone().count('id', { as: 'total' }).first();
                let rows = await categoryModel
                    //
                    .clone()
                    .offset(yiapi.utils.fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
