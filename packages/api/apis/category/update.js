import { fnRoute, fnSchema, httpConfig } from 'funpi';
import { tableData } from '../../tables/category.js';

export default async (fastify) => {
    fnRoute(import.meta.url, fastify, {
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema('id'),
                pid: fnSchema(tableData.pid),
                name: fnSchema(tableData.name),
                icon: fnSchema(tableData.icon),
                sort: fnSchema(tableData.sort),
                is_private: fnSchema(tableData.is_private),
                describe: fnSchema(tableData.describe)
            },
            required: ['id']
        },
        apiHandler: async (req, res) => {
            try {
                if (req.body.id <= 0) {
                    return {
                        ...httpConfig.UPDATE_FAIL,
                        msg: '根导航不能修改'
                    };
                }
                const categoryModel = fastify.mysql.table('category');

                // 如果需要更换父级
                let parentData = {};
                if (req.body.pid) {
                    parentData = await categoryModel.clone().where('id', req.body.pid).selectOne();
                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                }

                // 查询我的菜单数据
                const selfData = await categoryModel.clone().where({ id: req.body.id }).selectOne();
                if (!selfData) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '分类不存在'
                    };
                }

                // 需要更新的数据
                const updateData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_private: req.body.is_private,
                    describe: req.body.describe
                };

                if (parentData?.id) {
                    updateData.pids = [parentData.pids, parentData.id].join(',');
                }
                const result = await categoryModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData(updateData);

                // 如果更新成功，则更新所有子级
                if (result) {
                    const childrenPids = [updateData.pids || selfData.pid, selfData.id];
                    await categoryModel
                        .clone()
                        .where({ pid: selfData.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length
                        });
                }

                // const rows = await categoryModel.clone().select(
                //     //
                //     'category.name',
                //     'category.id',
                //     'category.pid',
                //     'category.pids',
                //     'category.sort',
                //     'category.user_id'
                // );

                // await fastify.redisSet(`cacheData:navCategoryAll_${req.session.id}`, rows);

                return {
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
