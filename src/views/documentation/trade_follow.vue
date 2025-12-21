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
          <vxe-button size="mini" status="info" @click="baatch_stop()">批量停止</vxe-button>
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
      tableheight: '500px',
      tableData: [{f_status: '0'}, {f_status: '1'}],
      pageSizes: [100, 500, 1000, 5000]
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 200) + 'px'
    this.fetchData()
  },
  mounted() {
    //setTimeout(this.main_loop, 1500)
    setInterval(() => {
      this.main_loop()
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
  		console.log('-->main_loop')
  	},
    batch_start() {
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('GET', this.main_url + '/get_today_order?account=238024' , true)
      httpRequest.timeout = 2000;
      httpRequest.send();
    },
    batch_stop() {

    },
    btn_tactics(row) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table .warning-row {
    background: indianred;
  }
</style>
