import axios from "axios";
import base from "./path";

const api = {
    getUserInfo(params) {
        return axios.get(base.baseUrl + base.getUserInfo)
    }
}

export default api;