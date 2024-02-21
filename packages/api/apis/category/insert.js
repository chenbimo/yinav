import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

let apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export let apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            pid: metaConfig.schema.pid,
            name: metaConfig.schema.name,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            describe: metaConfig.schema.describe
        },
        required: ['pid', 'name']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let categoryModel = fastify.mysql.table('nav_category').modify(function (qb) {});
                let userModel = fastify.mysql.table('sys_user');

                // 用户数据
                let userData = await userModel.clone().where({ id: req.session.id }).first();

                if ([0, 1, 2, 3].includes(userData.nav_level) === false) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '无效的用户等级，请联系管理员'
                    };
                }

                let { categoryCount } = await categoryModel.clone().where({ user_id: req.session.id }).count('id', { as: 'categoryCount' }).first();

                if (userData.nav_level === 0 && categoryCount >= 10) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '普通用户最多创建10个分类'
                    };
                }

                if (userData.nav_level === 1 && categoryCount >= 100) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '白银用户最多创建100个分类'
                    };
                }

                if (userData.nav_level === 2 && categoryCount >= 1000) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '黄金用户最多创建1000个分类'
                    };
                }

                if (userData.nav_level === 3 && categoryCount >= 10000) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '钻石用户最多创建10000个分类'
                    };
                }

                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    let parentData = await categoryModel.clone().where('id', req.body.pid).first();
                    if (!parentData?.id) {
                        return {
                            ...yiapi.codeConfig.FAIL,
                            msg: '父级分类不存在'
                        };
                    }
                    req.body.pids = `${parentData.pids},${parentData.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                if (req.body.level > 3) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '分类层级不能超过3层'
                    };
                }

                let insertData = {
                    user_id: req.session.id,
                    pid: req.body.pid,
                    name: req.body.name,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    level: req.body.level
                };
                let result = await categoryModel.clone().insert(yiapi.utils.fnDbInsertData(insertData));

                // 缓存全部分类
                // let rows = await categoryModel.clone().where({ user_id: req.session.id }).select(
                //     //
                //     'nav_category.name',
                //     'nav_category.id',
                //     'nav_category.pid',
                //     'nav_category.pids',
                //     'nav_category.sort',
                //     'nav_category.user_id'
                // );

                // await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);

                return {
                    ...yiapi.codeConfig.INSERT_SUCCESS,
                    data: result?.[0] || 0
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.INSERT_FAIL;
            }
        }
    });
}
