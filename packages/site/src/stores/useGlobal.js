export let useGlobal = Pinia.defineStore('global', () => {
    // 全局数据
    let $GlobalData = $ref({
        // 用户令牌
        token: yite.getCookie('token') || '',
        // 用户数据
        userData: $Storage.local.get('userData') || {},
        defaultAvatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9123.png~tplv-uwbnlip3yd-webp.webp'
    });

    // 全局计算数据
    let $GlobalComputed = {};

    // 全局方法
    let $GlobalMethod = {
        // 查询用户详情
        async apiGetUserDetail() {
            try {
                let res = await $Http({
                    url: '/user/detail',
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
