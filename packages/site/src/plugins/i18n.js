import { yiteMessages } from 'virtual:yite-messages';

let $I18n = createI18n({
    locale: 'zh',
    messages: await yiteMessages()
});

export { $I18n };
