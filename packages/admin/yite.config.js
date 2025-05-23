import { vitePluginForArco } from '@arco-plugins/vite-vue';
export const yiteConfig = {
    devtool: false,
    imagemin: false,
    // 自动导入解析
    autoImport: {
        resolvers: [
            {
                name: 'ArcoResolver',
                options: {}
            }
        ],
        imports: [
            {
                '@arco-design/web-vue': [
                    //
                    'Message',
                    'Modal',
                    'Notification',
                    'Drawer'
                ]
            }
        ]
    },
    // 自动组件解析
    autoComponent: {
        resolvers: [
            {
                name: 'ArcoResolver',
                options: {
                    sideEffect: true
                }
            }
        ]
    },
    // webpack 配置
    viteConfig: {
        plugins: [
            vitePluginForArco({
                style: 'css'
            })
        ],
        optimizeDeps: {
            include: [
                //
                'lodash-es',
                'vue-i18n',
                'js-md5',
                'axios',
                'date-fns',
                'es-toolkit',
                'date-fns/locale',
                '@arco-design/web-vue/es/icon',
                'store2',
                '@arco-design/web-vue'
            ]
        }
    }
};
