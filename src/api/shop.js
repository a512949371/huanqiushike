import request from '@/utils/request'

export function addClassification(data) {
  return request({
    url: 'api/productclass/save',
    method: 'post',
    data
  })
}
export function editClassification(data) {
  return request({
    url: 'api/productclass/update',
    method: 'post',
    data
  })
}
export function delClassification(data) {
  return request({
    url: 'api/productclass/update',
    method: 'post',
    data
  })
}
export function selectClassification(data) {
  return request({
    url: 'api/productclass/selectOne?id='+data,
    method: 'get',
  })
}
export function selectShopOne(data) {
  return request({
    url: 'api/product/selectOne?id='+data,
    method: 'get',
  })
}
export function delShopOne(data) {
  return request({
    url: 'api/product/delete',
    method: 'post',
    data
  })
}