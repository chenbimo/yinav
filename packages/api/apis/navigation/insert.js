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
            link: metaConfig.schema.link,
            sort: metaConfig.schema.sort,
            describe: metaConfig.schema.describe
        },
        required: ['pid', 'name', 'link']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let navigationModel = fastify.mysql.table('nav_navigation').modify(function (qb) {});
                let userModel = fastify.mysql.table('sys_user');

                let categoryModel = fastify.mysql
                    .table('nav_category')
                    .where({ user_id: req.session.id })
                    .modify(function (qb) {});

                // 用户数据
                let userData = await userModel.clone().where({ id: req.session.id }).first();

                if ([0, 1, 2, 3].includes(userData.nav_level) === false) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '无效的用户等级，请联系管理员'
                    };
                }

                let { navigationCount } = await navigationModel.clone().where({ user_id: req.session.id }).count('id', { as: 'navigationCount' }).first();

                if (userData.nav_level === 0 && navigationCount >= 100) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '普通用户最多创建100个导航'
                    };
                }

                if (userData.nav_level === 1 && navigationCount >= 1000) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '白银用户最多创建1000个导航'
                    };
                }

                if (userData.nav_level === 2 && navigationCount >= 10000) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '黄金用户最多创建10000个导航'
                    };
                }

                if (userData.nav_level === 3 && navigationCount >= 100000) {
                    return {
                        ...yiapi.codeConfig.FAIL,
                        msg: '钻石用户最多创建100000个导航'
                    };
                }

                let categoryData = {};

                if (req.body.pid > 0) {
                    // 分类数据
                    categoryData = await categoryModel.clone().where({ id: req.body.pid }).first();

                    if (!categoryData) {
                        return {
                            ...yiapi.codeConfig.INSERT_FAIL,
                            msg: '分类不存在'
                        };
                    }
                }
                let insertData = {
                    user_id: req.session.id,
                    pid: req.body.pid,
                    pids: req.body.pid > 0 ? categoryData.pids : '0',
                    name: req.body.name,
                    link: req.body.link,
                    sort: req.body.sort,
                    describe: req.body.describe
                };
                let result = await navigationModel.clone().insert(yiapi.utils.fnDbInsertData(insertData));

                // 缓存全部导航
                // let rows = await navigationModel.clone().where({ user_id: req.session.id }).select(
                //     //
                //     'nav_navigation.id',
                //     'nav_navigation.pid',
                //     'nav_navigation.pids',
                //     'nav_navigation.sort',
                //     'nav_navigation.user_id'
                // );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows, yiapi.appConfig.redis.ex);
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
