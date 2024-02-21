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
            page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
            limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
            pid: yiapi.utils.fnSchema(yiapi.schemaField.pid, '分类ID'),
            type: yiapi.utils.fnSchema(null, '数据类型', 'string', null, null, ['mine', 'default']),
            mode: yiapi.utils.fnSchema(null, '数据模式', 'string', null, null, ['k', 's']),
            keyword: yiapi.utils.fnSchema(yiapi.schemaField.string0to20, '分类ID')
        },
        required: ['type', 'mode']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                if (req.body.type === 'mine' && !req.session.id) {
                    return yiapi.codeConfig.NOT_LOGIN;
                }

                let navigationModel = fastify.mysql //
                    .table('nav_navigation')
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
                            if (req.body.pid !== undefined) {
                                db.where(function () {
                                    this.where(fastify.mysql.raw(`FIND_IN_SET('${req.body.pid}',\`pids\`)`)).orWhere('pid', req.body.pid);
                                });
                            }
                        }
                        // 收敛模式
                        if (req.body.mode === 's') {
                            if (req.body.pid !== undefined) {
                                db.where({ pid: req.body.pid });
                            }
                        }
                    });

                let { total } = await navigationModel.clone().count('id', { as: 'total' }).first();
                let rows = await navigationModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(yiapi.utils.fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select(selectKeys);
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
