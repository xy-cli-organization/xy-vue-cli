import axios from '@/utils/request'
const jsonpAdapter = require('axios-jsonp')

export const demoAPI = (params) => {
  const data = {
    functionId: 'demo',
    body: {
      params
    }
  }
  return axios.request({
    url: 'api',
    adapter: jsonpAdapter,
    data,
    method: 'post'
  })
}

export const jsonpAPI = (params) => {
  const data = {
    functionId: 'demo',
    body: {
      params
    }
  }
  return axios.request({
    url: 'api',
    adapter: jsonpAdapter,
    data
  })
}
