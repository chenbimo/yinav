import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `${metaConfig.name}放到首页`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `${metaConfig.name}放到首页接口`,
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
                let navigationModel = fastify.mysql.table('nav_navigation').where({ id: req.body.id, user_id: req.session.id });
                let navigationData = await navigationModel.clone().first();
                if (navigationData) {
                    let updateResult = await navigationModel
                        //
                        .clone()
                        .where({ id: req.body.id })
                        .update({
                            is_home: navigationData.is_home === 0 ? 1 : 0
                        });

                    return {
                        ...yiapi.codeConfig.UPDATE_SUCCESS,
                        data: updateResult,
                        msg: navigationData.is_home === 0 ? '上架首页成功' : '下架首页成功'
                    };
                } else {
                    return yiapi.codeConfig.UPDATE_FAIL;
                }
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.UPDATE_FAIL;
            }
        }
    });
}
