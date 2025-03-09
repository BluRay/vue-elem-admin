import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(data) {
  return request({
    url: '/user/pageList',
    method: 'POST',
    data
  })
}
export function getAccountPageList(data) {
  return request({
    url: '/futures/getAccountPageList',
    method: 'POST',
    data
  })
}
export function uploadAccount(data) {
  return request({
    url: '/futures/uploadAccount',
    method: 'POST',
    data
  })
}
