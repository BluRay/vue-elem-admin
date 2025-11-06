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
export function getAccountLineChart(data) {
  return request({
    url: '/futures/getAccountLineChart',
    method: 'POST',
    data
  })
}
export function getRqTradeBooksData(data) {
  return request({
    url: '/futures/getRqTradeBooksData',
    method: 'POST',
    data
  })
}
export function insertTradeBooksData(data) {
  return request({
    url: '/futures/insertTradeBooksData',
    method: 'POST',
    data
  })
}
export function updateTradeBooksData(data) {
  return request({
    url: '/futures/updateTradeBooksData',
    method: 'POST',
    data
  })
}
export function deleteTradeBooksData(data) {
  return request({
    url: '/futures/deleteTradeBooksData',
    method: 'POST',
    data
  })
}
export function getRqTradeAccountData(data) {
  return request({
    url: '/futures/getRqTradeAccountData',
    method: 'POST',
    data
  })
}
