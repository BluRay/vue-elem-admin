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
          <vxe-button size="mini" status="warning" @click="showModel = true">新增</vxe-button>
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
        <vxe-table-column field="exchange_name" title="交易所" width="100px" />
        <vxe-table-column field="status" title="状态" width="90px" />
        <vxe-table-column field="memo" title="备注" width="90px" />
        <vxe-table-column field="memo" title="操作" width="90px" />
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
      tableData: []
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
