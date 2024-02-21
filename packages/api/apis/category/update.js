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
            id: metaConfig.schema.id,
            pid: metaConfig.schema.pid,
            name: metaConfig.schema.name,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            describe: metaConfig.schema.describe
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            if (req.body.id <= 0) {
                return {
                    ...yiapi.codeConfig.UPDATE_FAIL,
                    msg: '根导航不能修改'
                };
            }
            try {
                let categoryModel = fastify.mysql.table('nav_category').where({ user_id: req.session.id });

                // 如果需要更换父级
                let parentData = {};
                if (req.body.pid) {
                    parentData = await categoryModel.clone().where('id', req.body.pid).first();
                    if (!parentData?.id) {
                        return {
                            ...yiapi.codeConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                }

                // 查询我的菜单数据
                let selfData = await categoryModel.clone().where({ id: req.body.id }).first();
                if (!selfData) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '分类不存在'
                    };
                }

                // 需要更新的数据
                let updateData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    describe: req.body.describe
                };

                if (parentData?.id) {
                    updateData.pids = [parentData.pids, parentData.id].join(',');
                }
                let updateResult = await categoryModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(yiapi.utils.fnDbUpdateData(updateData));

                // 如果更新成功，则更新所有子级
                if (updateResult) {
                    let childrenPids = [updateData.pids || selfData.pid, selfData.id];
                    await categoryModel
                        .clone()
                        .where({ pid: selfData.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length
                        });
                }

                let rows = await categoryModel.clone().select(
                    //
                    'nav_category.name',
                    'nav_category.id',
                    'nav_category.pid',
                    'nav_category.pids',
                    'nav_category.sort',
                    'nav_category.user_id'
                );

                // await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);

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
