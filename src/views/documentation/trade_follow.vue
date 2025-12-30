<template>
  <el-container>
    <el-header>
      <vxe-form refs="grid_form">
        <vxe-form-item title="关键字:" title-width="80px">
          <template #default>
            <vxe-input
              v-model="searchForm.keyword"
              clearable
              size="mini"
              placeholder="请输入交易账户/名称/资金账户"
              style="width: 250px;"
              class="filter-item"
            />
          </template>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button size="mini" status="success" @click="fetchData()">查询</vxe-button>
          <vxe-button size="mini" status="warning" @click="batch_start()">批量启动</vxe-button>
          <vxe-button size="mini" status="info" @click="batch_stop()">批量停止</vxe-button>
        </vxe-form-item>
      </vxe-form> &nbsp;&nbsp;
    </el-header>
    <el-main style="padding: 20px 20px 0px 20px;">
      <vxe-table
        ref="xTable"
        border
        stripe
        resizable
        size="mini"
        align="center"
        :loading="loading"
        :height="tableheight"
        :data="tableData"
        :row-style="tableRowClassName"
      >
        <vxe-table-column type="seq" title="序号" fixed="left" width="45px" />
        <vxe-table-column type="checkbox" title="" fixed="left" width="55px" />
        <vxe-table-column field="username" title="跟单账户" fixed="left" width="95px" sortable />
        <vxe-table-column field="display_name" title="账户名称" width="95px" />
        <vxe-table-column field="display_name" title="所属公司" width="95px" />
        <vxe-table-column field="trade_account" title="交易帐号" width="95px" />
        <vxe-table-column field="tactics_account" title="样本帐号" width="95px" />
        <vxe-table-column field="f_status" title="交易状态" width="95px" :formatter="formatter_status"/>
        <vxe-table-column field="tactics_bookid" title="当前交易品种" width="95px" />
        <vxe-table-column field="tactics_name" title="当前跟单策略" width="95px" />
        <vxe-table-column field="cc_buy" title="持仓(多)" width="95px" />
        <vxe-table-column field="cc_sell" title="持仓(空)" width="95px" />
        <vxe-table-column field="profit_p" title="盈亏(持仓)" width="95px" />
        <vxe-table-column field="profit_c" title="盈亏(平仓)" width="95px" />
        <vxe-table-column field="trade_datail" title="交易明细" width="95px" />
        <vxe-table-column field="memo" title="备注" width="125px" />
        <vxe-table-column title="操作" fixed="right" width="210">
          <template #default="{ row }">
            <vxe-button @click="btn_tactics(row)" :status="(row.f_status === '0') ? 'warning' : 'info'" :content="(row.f_status === '0') ? '启动' : '停止'" />
            <vxe-button status="success" disabled content="全平" />
            <vxe-button status="primary" disabled content="对齐" />
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
  </el-container>
</template>
<script>
import { getFollowUserTradeData } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
      main_url: 'http://127.0.0.1:8099',
      searchForm: { keyword: '', date: '' },
      loading: false,
      following: false,
      tableheight: '500px',
      follow: [],
      f_wt_list: [],
      tableData: [{f_status: '0'}, {f_status: '1'}],
      pageSizes: [100, 500, 1000, 5000]
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 240) + 'px'
    this.fetchData()
  },
  mounted() {
    //setTimeout(this.main_loop, 1500)
    setInterval(() => {
      if (!this.following) this.main_loop()
    }, 1500)
  },
  methods: {
    fetchData() {
      this.loading = true
      getFollowUserTradeData({
        keyword: this.searchForm.keyword
      }).then(response => {
        this.tableData = response.data.result.data.dateList
        this.tableData.forEach(item => {
          item.f_status = '0'
        })
        this.loading = false
      })
    },
  	main_loop() {
  		console.log('-->main_loop:', this.follow)
      this.following = true
      setTimeout(() => {this.following = false}, 5000) // 单次循环最大等待时间
      let start_time = this.addTimeToDate(this.formatDate(new Date()), 0, 0, -10).substring(11)
      let today_date = this.formatDate(new Date()).substring(0, 10).replaceAll('-', '')
      console.log(today_date + '|' + start_time)
      const _this = this
      this.follow.forEach(f => {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', this.main_url + '/get_today_order?account=' + f.tactics_account , true)
        httpRequest.timeout = 2000;
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            if (httpRequest.responseText === '未获得订单数据') {
              return false
            }
            var json = JSON.parse(httpRequest.responseText)
            console.log(json)
            for (var c in json) {
              json[c].forEach(item => {
                // OrderStatus 3: 委托; 5: 已撤; 0: 成交
                if (item.OrderStatus === '3' && item.InsertDate === today_date && item.InsertTime > start_time) {
                  let OrderSysID = item.OrderSysID
                  if (_this.f_wt_list.indexOf(OrderSysID) < 0) {
                    _this.f_wt_list.push(OrderSysID)
                  }
                }
                // 判断委托单是否成交
                let check_wt = false
                if (item.OrderStatus === '0' && _this.f_wt_list.indexOf(item.OrderSysID) >= 0 && item.InsertDate === today_date) {
                  _this.f_wt_list.splice(_this.f_wt_list.indexOf(item.OrderSysID), 1)
                  check_wt = true
                }
                if (check_wt || (item.OrderStatus === '0' && item.InsertDate === today_date && item.InsertTime > start_time)) {
                  // 过滤当前时间10秒以前的订单 过滤未成交的订单 过滤已跟的订单 InsertTime格式 09:15:32
                  // 根据策略规则跟单
                  let OrderSysID = item.OrderSysID          // 报单编号
                  let InstrumentID = item.InstrumentID      // 合约代码
                  let Direction = item.Direction            // 买卖方向 （'0' 买，'1' 卖）
                  let CombOffsetFlag = item.CombOffsetFlag  // 组合开平标志 （'0' 开仓，'1' 平仓，'3' 平今等）
                  let VolumeTraded = item.VolumeTraded * parseInt(tactics.f_tactics_multiplier || '1')      // 成交数量
                  var httpRequest2 = new XMLHttpRequest();  // 跟单交易请求【TODO】正式使用需调客户本地交易服务地址
                  let trade_str = (Direction === '0') ? 'buy' : 'sell'
                  if ((tactics.f_tactics_way || '正向') === '反向') {
                    trade_str = ((trade_str === 'buy') ? 'sell' : 'buy')
                  }
                  trade_str += (CombOffsetFlag === '0') ? 'open' : 'close'
                  if (_this.followed_order_list.indexOf(OrderSysID) < 0) {
                    console.log('-->[Followed]' + _this.real_main_url + '/' + trade_str + '?account=' + _this.account + '&bookid=' + InstrumentID + '&quantity=' + VolumeTraded)
                    _this.followed_order_list.push(OrderSysID)
                    _this.trade_logs.push({id: _this.logindex, logs: _this.c_time + '[自动]' + trade_str + '[' + InstrumentID + '] ' + VolumeTraded + '手' })
                    _this.logindex++
                    if (CombOffsetFlag !== '0') { // 平仓时 判断当前仓位是否小于平仓数量
                      let cur_cc = 0              // 当前仓位
                      if (trade_str === 'buyclose') {    // buyclose (Direction === '0')
                        _this.cc_list.forEach(cc => {
                          if (cc.InstrumentID === InstrumentID && cc.PosiDirection === '3') {
                            cur_cc = cc.Position
                          }
                        })
                      } else { // sellclose
                        _this.cc_list.forEach(cc => {
                          if (cc.InstrumentID === InstrumentID && cc.PosiDirection === '2') {
                            cur_cc = cc.Position
                          }
                        })
                      }
                      console.log('平仓时 判断当前仓位是否小于平仓数量 cur_cc:' + cur_cc + ',VolumeTraded=' + VolumeTraded)
                      if (cur_cc < VolumeTraded) {
                        VolumeTraded = cur_cc
                      }
                    }

                    httpRequest2.open('GET', _this.real_main_url + '/' + trade_str + '?account=' + _this.account + '&bookid=' + InstrumentID + '&quantity=' + VolumeTraded + '&tactics=f_' + tactics.f_tactics_id , true)
                    httpRequest2.timeout = 5000
                    httpRequest2.send()
                    httpRequest2.onreadystatechange = function () {
                      if (httpRequest2.readyState == 4) {
                        if (httpRequest2.status == 200) {
                          console.log(httpRequest2.responseText)
                          if (httpRequest2.responseText === 'success:0'){
                            _this.$notify({ title: '提示', message: trade_str + ' 交易成功!', duration: 1500 })
                          } else {
                            _this.$notify({ title: '提示', message: trade_str + ' 交易失败!!', duration: 1500 })
                          }
                        } else {
                          _this.$notify({ title: '提示', message: trade_str + ' 交易失败!', duration: 1500 })
                        }
                      }
                    }
                  }
                }
              })
            }
          }
        }

      })
      // this.following = false
      console.log('-->main_loop over')
  	},
    batch_start() {
      this.$message({ message: '开发中!', type: 'error' })
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', this.main_url + '/get_today_order?account=238024' , true)
      httpRequest.timeout = 2000;
      httpRequest.send();
    },
    batch_stop() {
      this.$message({ message: '开发中!', type: 'error' })
    },
    btn_tactics(row) {
      if (row.f_status === '0') { // 启动
        let check = true
        this.follow.forEach(f => {
          if (f.tactics_account === row.tactics_account) {
            f.trade_account.push(row.trade_account)
            check = false
          }
        })
        if (check) {
          this.follow.push({ tactics_account: row.tactics_account, trade_account: [row.trade_account]})
        }
      } else {  // 停止
        this.follow.forEach(f => {
          if (f.tactics_account === row.tactics_account) {
            f.trade_account.forEach((item, index) => {
              if (item === row.trade_account) {
                f.trade_account.splice(index, 1)
              }
            })
          }
        })
        this.follow.forEach((item, index) => {
          if (item.trade_account.length === 0) {
            this.follow.splice(index, 1)
          }
        })
      }
      row.f_status = (row.f_status === '0') ? '1' : '0'
      this.$refs.xTable.loadData(this.tableData)
    },
    formatter_status({ cellValue }) {
      return (cellValue === '1') ? '正在跟单' : '停止跟单'
    },
    tableRowClassName({row, rowIndex}) {
      if (row.f_status === '1') {
        return { backgroundColor: 'indianred', color: '#ffffff' }
      } else {
        return ''
      }
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    addTimeToDate(dateString, hours = 0, minutes = 0, seconds = 0) {
      const date = new Date(dateString);
      date.setHours(date.getHours() + hours)
      date.setMinutes(date.getMinutes() + minutes)
      date.setSeconds(date.getSeconds() + seconds)
      return this.formatDate(date)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table .warning-row {
    background: indianred;
  }
</style>
