import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/navigation.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema('tableData.id'),
                pid: fnSchema(tableData.pid),
                name: fnSchema(tableData.name),
                link: fnSchema(tableData.link),
                sort: fnSchema(tableData.sort),
                is_private: fnSchema(tableData.is_private),
                describe: fnSchema(tableData.describe)
            },
            required: ['pid', 'name', 'link']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const navigationModel = fastify.mysql.table('navigation');
                const categoryModel = fastify.mysql.table('category');

                let parentData = {};

                // 如果需要更换父级
                if (req.body.pid) {
                    parentData = await categoryModel.clone().where('id', req.body.pid).selectOne();
                    if (!parentData.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '分类不存在'
                        };
                    }
                }

                const result = await navigationModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        pid: req.body.pid,
                        name: req.body.name,
                        link: req.body.link,
                        sort: req.body.sort,
                        is_private: req.bdoy.is_private,
                        describe: req.body.describe
                    });

                // let rows = await navigationModel.clone().select(
                //     //
                //     'navigation.id',
                //     'navigation.pid',
                //     'navigation.pids',
                //     'navigation.sort',
                //     'navigation.user_id'
                // );

                // await fastify.redisSet(`cacheData:navigationAll_${req.session.id}`, rows);
                return {
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
