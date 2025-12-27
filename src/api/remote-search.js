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
export function insertTradeAccountData(data) {
  return request({
    url: '/futures/insertTradeAccountData',
    method: 'POST',
    data
  })
}
export function updateTradeAccountData(data) {
  return request({
    url: '/futures/updateTradeAccountData',
    method: 'POST',
    data
  })
}
export function deleteTradeAccountData(data) {
  return request({
    url: '/futures/deleteTradeAccountData',
    method: 'POST',
    data
  })
}

export function getRqTacticsData(data) {
  return request({
    url: '/futures/getRqTacticsData',
    method: 'POST',
    data
  })
}
export function insertTacticsData(data) {
  return request({
    url: '/futures/insertTacticsData',
    method: 'POST',
    data
  })
}
export function updateTacticsData(data) {
  return request({
    url: '/futures/updateTacticsData',
    method: 'POST',
    data
  })
}
export function deleteTacticsData(data) {
  return request({
    url: '/futures/deleteTacticsData',
    method: 'POST',
    data
  })
}

export function getFollowUserTradeData(data) {
  return request({
    url: '/futures/getFollowUserTradeData',
    method: 'POST',
    data
  })
}
export function getTradeHisData(data) {
  return request({
    url: '/futures/getTradeHisData',
    method: 'POST',
    data
  })
}
export function getFollowUserData(data) {
  return request({
    url: '/futures/getFollowUserData',
    method: 'POST',
    data
  })
}
export function insertFollowUserData(data) {
  return request({
    url: '/futures/insertFollowUserData',
    method: 'POST',
    data
  })
}
export function updateFollowUserData(data) {
  return request({
    url: '/futures/updateFollowUserData',
    method: 'POST',
    data
  })
}
export function deleteFollowUserData(data) {
  return request({
    url: '/futures/deleteFollowUserData',
    method: 'POST',
    data
  })
}
