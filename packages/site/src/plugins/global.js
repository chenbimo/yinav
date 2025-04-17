export const useGlobal = defineStore('global', () => {
    // 全局数据
    const $GlobalData = $ref({
        // 项目配置
        uploadUrl: import.meta.env.VITE_HOST + '/upload/local',
        uploadHeaders: {
            authorization: 'Bearer ' + $Storage.local.get('token') || ''
        },
        // 用户令牌
        token: '',
        // 用户数据
        userData: $Storage.local.get('userData') || {},
        defaultAvatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9123.png~tplv-uwbnlip3yd-webp.webp'
    });

    // 全局计算数据
    const $GlobalComputed = {};

    // 全局方法
    const $GlobalMethod = {
        // 查询用户详情
        async apiGetUserDetail() {
            try {
                const res = await $Http({
                    url: '/app/user/detail',
                    data: {}
                });
                $GlobalData.userData = res.data;
                $Storage.local.set('userData', res.data);
            } catch (err) {
                await $Storage.clearAll();
                $GlobalData.userData = {};
            }
        }
    };

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
