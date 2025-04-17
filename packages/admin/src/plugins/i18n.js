import { createI18n } from 'vue-i18n';
import { yiteMessages } from 'virtual:yite-messages';

const $I18n = createI18n({
    legacy: false,
    locale: 'zh',
    messages: await yiteMessages()
});

export { $I18n };
