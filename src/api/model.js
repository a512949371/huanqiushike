import request from '@/utils/request'

export function modelList(data) {
  return request({
    url: 'api/accountRankConfig/selectList',
    method: 'get',
    data
  })
}

export function changeRules(data) {
  return request({
    url: 'public/rules',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/accountRankConfig/update',
    method: 'post',
    data
  })
}

export function rulesInfo() {
  return request({
    url: 'api/rulesInfo',
    method: 'get'
  })
}

export function rulesSave(data) {
  return request({
    url: 'api/rulesSave',
    method: 'post',
    data
  })
}



export function withdrawInfo(data) {
  return request({
    url: 'api/feeconfig/select',
    method: 'get',
    data
  })
}

export function withdrawSave(data) {
  console.log('withdrawSave params',data)
  return request({
    url: 'api/feeconfig/creat',
    method: 'post',
    data
  })
}
