export const useGlobal = defineStore('global', () => {
    // 全局数据
    const $GlobalData = $ref({
        // 内置配置，不要修改
        ...$InternalConfig,
        // 项目配置
        uploadUrl: import.meta.env.VITE_HOST + '/upload/local',
        uploadHeaders: {
            authorization: 'Bearer ' + $Storage.local.get('token') || ''
        }
    });

    // 全局计算数据
    const $GlobalComputed = {};

    // 全局方法
    const $GlobalMethod = {
        setRoutePath(id_path) {
            if (Number.isInteger(id_path)) {
                const childItem = $GlobalData.menuObject[id_path];
                const parentItem = $GlobalData.menuObject[childItem.pid];
                $GlobalData.openKeys = [parentItem.id];
                $GlobalData.selectedKeys = [childItem.id];
            } else {
                for (let key in $GlobalData.menuObject) {
                    if (Object.prototype.hasOwnProperty.call($GlobalData.menuObject, key)) {
                        const item = $GlobalData.menuObject[key];
                        if (item.value === id_path) {
                            const parentItem = $GlobalData.menuObject[item.pid];
                            $GlobalData.openKeys = [parentItem.id];
                            $GlobalData.selectedKeys = [item.id];
                            break;
                        }
                    }
                }
            }
        }
    };

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
