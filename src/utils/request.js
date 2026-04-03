import axios from "axios";
import { error } from "console";
import querystring from "querystring"


const ErrorHandle = (status, other) => {
    switch (status) {
        case 400:
            console.log('请求错误');
            break;
        case 401:
            console.log('未授权，请登录');
            break;
        case 403:
            console.log('拒绝访问');
            break;
        case 404:
            console.log('请求地址出错');
            break;
        case 408:
            console.log('请求超时');
            break;
        default:
            console.log(other);
    }
}

const instance = axios.create({
  timeout: 5000,
})

// 发送数据之前
instance.interceptors.request.use(
    // 成功
    config => {
        if (config.method === 'post') {
            config.data = querystring.stringify(config.data)
        }
        return config // 这里面是网络请求的所有信息
    },
    // 失败
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    // 成功
    response => {
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response)
    },
    // 失败
    error => {
        const { response } = error
        ErrorHandle(response.status, response.info)

    }
)

export default instance;