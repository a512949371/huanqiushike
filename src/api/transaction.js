import request from '@/utils/request'

export function withdrawEdit(data) {
  return request({
    url: 'api/withdraw/editWithdrawDetail',
    method: 'post',
    data
  })
}

