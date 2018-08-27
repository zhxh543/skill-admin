'use strict'

import axios from 'axios'
import qs from 'qs'

const localUrl = window.location.protocol + '//' + window.location.host;
// const jumpUrl = 'http://192.168.0.18:8081';
const jumpUrl = 'http://192.168.0.220:8070';

// axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  // console.log(response)
  return response

}, error => {
  // console.log(error)
  return Promise.resolve(error.response)
})

axios.defaults.withCredentials = true

axios.defaults.baseURL = (process.env.NODE_ENV == 'development' ? '/api' : 'http://192.168.0.220:8070/api/')

export default {
  getUrl() {
    return localUrl;
  },
  login(url, params) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(params)
    });
  },
  post(url, params, config) {
    let header = {'Content-Type': 'application/json;charset=UTF-8'};
    let p = params;
    if (config) {
      header = config;
      p = qs.stringify(params)
    } else {
      p = JSON.stringify(params);
    }
    return axios({
      method: 'post',
      url,
      data: p,
      headers: header
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else {
        return response;
      }
    })
  },
  file(url, params) {
    return axios({
      method: 'post',
      url,
      data: params,
      headers: {'Content-Type': 'multipart/form-data'}
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    })
  },
  update(url, params, method) {
    return axios({
      method: method,
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    });
  },
  put(url, params) {
    return axios({
      method: 'put',
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    })
  },
  putSimple(url, params) {
    return axios({
      method: 'put',
      url,
      data: params,
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    })
  },
  delete(url, params) {
    return axios({
      method: 'delete',
      url,
      data: JSON.stringify(params),
      headers: {'Content-Type': 'application/json;charset=UTF-8'}
    }).then((response) => {
      if (response.status === 401) {
        window.location.href = jumpUrl;
        return false;
      } else if (response.status === 403) {
        this.$message({
          message: "没有权限！",
          type: 'error'
        });
        return false;
      } else {
        return response;
      }
    })
  }
}
