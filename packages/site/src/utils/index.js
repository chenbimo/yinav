import * as _ from 'lodash-es';
import md5 from 'blueimp-md5';

// 合并数据
export function utilMerge(...obj) {
    return mergeAny(..._.cloneDeep(obj));
}

export function utilMd5(...options) {
    return md5(...options);
}

// 获取资源
export function utilGetAssets(name) {
    return new URL(`../assets/${name}`, import.meta.url).href;
}

export function apiParamsSign(params) {
    let fieldsArray = [];
    _.forOwn(_.omit(params, ['sign']), (value, key) => {
        if (value !== undefined && value !== null && String(value).length < 1000) {
            fieldsArray.push(`${key}=${value}`);
        }
    });

    let fieldsSort = fieldsArray.sort().join('&');

    let fieldsMd5 = utilMd5(fieldsSort);
    return { sign: fieldsMd5, sort: fieldsSort };
}
