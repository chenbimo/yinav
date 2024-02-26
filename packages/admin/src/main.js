import App from '@/App.vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';

import 'virtual:uno.css';

const app = createApp(App);

const $Pinia = Pinia.createPinia();

app.use($Router);
app.use($Pinia);
app.use($I18n);
app.use(ArcoVueIcon);

app.mount('#app');
