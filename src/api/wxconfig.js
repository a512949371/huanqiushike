import request from '@/utils/request'

export function wxselect(data) {
  return request({
    url: 'api/wxma/select',
    method: 'get',
  })
}
export function wxadd(data) {
  return request({
    url: 'api/wxma/save',
    method: 'post',
    data
  })
}
export function wxedit(data) {
  return request({
    url: 'api/wxma/update',
    method: 'post',
    data
  })
}