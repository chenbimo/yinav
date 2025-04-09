// 外部集
import axios from 'axios';

// 内部集

let $Http = axios.create({
    method: 'POST',
    baseURL: import.meta.env.VITE_HOST,
    timeout: 1000 * 60,
    withCredentials: false,
    responseType: 'json',
    responseEncoding: 'utf8',
    headers: {}
});
// 添加请求拦截器
$Http.interceptors.request.use(
    function (config) {
        if (!config.data) {
            config.data = {};
        }

        let token = '';
        if (token) {
            config.headers.authorization = 'Bearer ' + token;
        }

        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
$Http.interceptors.response.use(
    function (res) {
        if (res.data.code === 0) {
            return Promise.resolve(res.data);
        }

        return Promise.reject(res.data);
    },
    function (err) {
        Message.error({
            content: err?.message || err
        });
    }
);
export { $Http };
