import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询分类';

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
                pid: metaConfig.pid,
                is_private: metaConfig.is_private,
                keyword: metaConfig.keyword
            },
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const categoryModel = fastify.mysql //
                    .table('category')
                    .modify(function (qb) {
                        if (req.body.keyword) {
                            qb.where('name', 'like', `%${req.body.keyword}%`);
                        }
                        if (req.session?.role_codes !== 'dev') {
                            qb.where('is_private', 0);
                        } else {
                            if (req.body.is_private !== undefined) {
                                qb.where('is_private', req.body.is_private);
                            }
                        }
                    });

                // 记录总数
                const { totalCount } = await categoryModel.clone().selectCount();

                // 记录列表
                const rows = await categoryModel
                    .clone() //
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit);
                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
