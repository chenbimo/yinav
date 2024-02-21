import App from '@/App.vue';
import 'virtual:uno.css';

let app = createApp(App);

let $Pinia = Pinia.createPinia();

app.use($Router);
app.use($Pinia);
app.use($I18n);

export { app };
