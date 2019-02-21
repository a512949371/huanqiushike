import request from '@/utils/request'

export function selectone(data) {
  return request({
    url: 'api/accounthelp/selectOne',
    method: 'get',
  })
}
export function edit(data) {
  return request({
    url: 'api/accounthelp/update',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: 'api/accounthelp/save',
    method: 'post',
    data
  })
}