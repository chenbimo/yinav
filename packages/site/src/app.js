import App from '@/App.vue';

let app = createApp(App);

let $Pinia = Pinia.createPinia();

app.use($Router);
app.use($Pinia);
app.use($I18n);

export { app };
