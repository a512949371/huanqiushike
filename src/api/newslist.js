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
export function bannerlist(data) {
  return request({
    url: 'api/advertising/selectList',
    method: 'post',
    data
  })
}
export function addbanner(data) {
  return request({
    url: 'api/advertising/save',
    method: 'post',
    data
  })
}
export function editbanner(data) {
  return request({
    url: 'api/advertising/update',
    method: 'post',
    data
  })
}