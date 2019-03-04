import request from '@/utils/request'

export function updata(data) {
  return request({
    url: 'api/account/update',
    method: 'post',
    data
  })
}
export function userinfo(data) {
  return request({
    url: 'api/account/selectOne?id='+data.id,
    method: 'get'
  })
}
export function childlist(data) {
  console.log('da',data)
  return request({
    url: 'api/account/selectSub?id='+data.id+'&page='+data.page+'&size='+data.size,
    method: 'get'
  })
}
export function editchild(data) {
  return request({
    url: 'api/account/updateSub',
    method: 'post',
    data
  })
}
export function editname(data) {
  return request({
    url: 'api/account/editor',
    method: 'post',
    data
  })
}
export function getmoney(data) {
  return request({
    url: 'api/topuplog/creat',
    method: 'post',
    data
  })
}
export function reducemoney(data) {
  return request({
    url: 'api/deductions/creat',
    method: 'post',
    data
  })
}