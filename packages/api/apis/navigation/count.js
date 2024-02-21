import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { customConfig } from '../../config/custom.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询导航列表';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                page: metaConfig.page,
                limit: metaConfig.limit,
                type: metaConfig.type
            },
            required: ['type']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql //
                    .table('navigation')
                    .modify(function (qb) {
                        if (req.body.type === 'mine') {
                            qb.where({ user_id: req.session.id });
                        }
                        if (req.body.type === 'default') {
                            qb.where({ user_id: customConfig.navDefaultId });
                        }
                    });

                // 记录总数
                const { totalCount } = await navigationModel
                    .clone() //
                    .selectCount();

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
