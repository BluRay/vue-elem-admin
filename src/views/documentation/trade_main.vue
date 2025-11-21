<template>
  <el-container>
    <el-header>
      <vxe-form refs="grid_form">
        <vxe-form-item title="交易帐号:" title-width="80px">
          <template #default>
            <vxe-select v-model="searchForm.exchange_id" transfer>
            <vxe-option v-for="item in accountList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button size="mini" status="success" @click="fetchData()">帐户信息</vxe-button>
          <vxe-button size="mini" status="warning" @click="showModel = true">成交记录</vxe-button>
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
      >
        <vxe-table-column type="seq" title="序号" fixed="left" width="45px" />
        <vxe-table-column field="book_id" title="合约编号" fixed="left" width="100px" />
        <vxe-table-column field="book_name" title="交易品种" fixed="left" width="100px" />
        <vxe-table-column field="exchange_name" title="交易所" width="140px" />
        <vxe-table-column field="status" title="最新价格" width="90px" />
        <vxe-table-column field="status" title="涨跌幅" width="90px" />
        <vxe-table-column field="status" title="总持仓" width="80px" />
        <vxe-table-column field="status" title="今持仓" width="80px" />
        <vxe-table-column field="memo" title="委托单" width="80px" />
        <vxe-table-column field="memo" title="持仓盈亏" width="80px" />
        <vxe-table-column field="memo" title="平仓盈亏" width="80px" />
        <vxe-table-column field="memo" title="手续费" width="80px" />
        <vxe-table-column title="交易手数" width="80px" fixed="right">
          <template #default="{ row }">
            <vxe-input type="number" value='1'></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column title="交易" width="320" fixed="right">
          <template #default="{ row }">
            <vxe-button status="warning" content="开多" ></vxe-button>
            <vxe-button status="danger" content="平多" ></vxe-button>
            <vxe-button status="warning" content="开空" ></vxe-button>
            <vxe-button status="danger" content="平空" ></vxe-button>
            <vxe-button status="success" content="委托" ></vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
  </el-container>
</template>

<script>
import Papa from 'papaparse'
import { getRqTradeBooksData } from '@/api/remote-search'
export default {
  name: 'TradBooks',
  data() {
    return {
    	searchForm: { keyword: '', date: '' },
      showModel: false,
      loading: false,
      tableheight: '500px',
	    pageSizes: [100, 500, 1000, 5000],
      tableData: [],
      accountList: []
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 200) + 'px'
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getRqTradeBooksData({
      	account_date: this.searchForm.date
      }).then(response => {
        this.tableData = response.data.result.data.dateList
        this.loading = false
      })
    },
    exportDataEvent() {
      this.$refs.xTable.exportData({
        type: 'xlsx',
        filename: '用户名册',
        sheetName: 'Sheet1',
        isMerge: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
