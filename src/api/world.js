import request from '@/utils/request'

export function worldlist(data) {
  return request({
    url: 'api/accountRankConfig/select/list',
    method: 'get',
  })
}
export function newworld(data) {
  return request({
    url: 'api/accountRankConfig/savesub?groupName='+data.groupName+'&number='+data.number,
    method: 'get',
  })
}
export function fchangt(data) {
  return request({
    url: 'api/accountRankConfig/relevancesub?accountNo='+data.accountNo+'&id='+data.id,
    method: 'get',
  })
}