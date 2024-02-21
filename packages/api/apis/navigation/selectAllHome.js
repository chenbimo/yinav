import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `查询所有首页${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有首页${metaConfig.name}接口`,
        type: 'object',
        properties: {},
        required: []
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let navigationModel = fastify.mysql.table('nav_navigation');
                let categoryModel = fastify.mysql.table('nav_category');

                let rows = await navigationModel.clone().where({ is_home: 1, user_id: req.session.id }).select();

                // 处理分类
                let categoryIds = [];
                rows.forEach((item) => {
                    item.pids.split(',').forEach((id) => {
                        id = Number(id);
                        if (categoryIds.includes(id) === false && id !== 0) {
                            categoryIds.push(id);
                        }
                    });
                    if (categoryIds.includes(item.pid) === false && item.pid !== 0) {
                        categoryIds.push(item.pid);
                    }
                });

                let categoryRows = await categoryModel.clone().whereIn('id', categoryIds);

                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows,
                        categoryRows: categoryRows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
