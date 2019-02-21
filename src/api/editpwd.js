import request from '@/utils/request'

export function edit(data) {
  return request({
    url: 'api/users/updatePass?passWordN='+data.passWordN+'&passWordO='+data.passWordO,
    method: 'get',
  })
}