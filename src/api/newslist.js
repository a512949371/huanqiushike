import request from '@/utils/request'

export function onelist(data) {
  return request({
    url: 'api/article/selectOne?id='+data,
    method: 'get',
  })
}
export function addnews(data) {
  return request({
    url: 'api/article/save',
    method: 'post',
    data
  })
}
export function editnews(data) {
  return request({
    url: 'api/article/update',
    method: 'post',
    data
  })
}