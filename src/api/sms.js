import request from '@/utils/request'

export function smsdata(data) {
  return request({
    url: 'api/sms/onfig/selectList',
    method: 'get',
  })
}
export function editsms(data) {
  return request({
    url: 'api/sms/onfig/update',
    method: 'post',
    data
  })
}