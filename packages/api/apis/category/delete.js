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
            id: yiapi.utils.fnSchema(yiapi.schemaField.id, '唯一ID')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                if (req.body.id <= 0) {
                    return {
                        ...yiapi.codeConfig.DELETE_FAIL,
                        msg: '根导航不能删除'
                    };
                }
                let categoryModel = fastify.mysql.table('nav_category').where({ user_id: req.session.id });

                // 判断是否有下级分类
                let childCategoryData = await categoryModel.clone().where({ pid: req.body.id }).first();
                if (childCategoryData) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '该分类存在下级分类，请将下级分类转移后操作'
                    };
                }

                let deleteResult = await categoryModel.clone().where({ id: req.body.id }).delete();

                let rows = await categoryModel.clone().select(
                    //
                    'nav_category.name',
                    'nav_category.id',
                    'nav_category.pid',
                    'nav_category.pids',
                    'nav_category.sort',
                    'nav_category.user_id'
                );

                await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);

                return {
                    ...yiapi.codeConfig.DELETE_SUCCESS,
                    data: deleteResult
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.DELETE_FAIL;
            }
        }
    });
}
