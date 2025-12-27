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
        <vxe-form-item title="交易日期:" title-width="80px">
          <template #default>
            <vxe-input type="date"
              v-model="searchForm.trade_date"
              clearable
              size="mini"
              placeholder="请输入交易日期"
              style="width: 200px;"
              class="filter-item"
            />
          </template>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button size="mini" status="success" @click="fetchData()">查询交易纪录</vxe-button>
        </vxe-form-item>
      </vxe-form> &nbsp;&nbsp;
      <vxe-button size="mini" status="warning" @click="auto_query()">{{autobtnstr}}</vxe-button>
    </el-header>
    <el-main style="padding: 20px 20px 0px 20px;">
      <vxe-table
        ref="xTable"
        border
        stripe
        resizable
        size="mini"
        align="center"
        :row-style="rowStyle"
        :loading="loading"
        :height="tableheight"
        :data="tableData"
      >
        <vxe-table-column type="seq" title="序号" fixed="left" width="45px" />
        <vxe-table-column field="account" title="交易帐号" width="95px" />
        <vxe-table-column field="target" title="交易品种" width="95px" />
        <vxe-table-column field="tactics_name" title="交易策略" width="140px" :formatter="formatter_tactics"/>
        <vxe-table-column field="trade_time" title="交易时间" width="165px" />
        <vxe-table-column field="trade_type" title="交易类型" width="95px" />
        <vxe-table-column field="price_type" title="下单类型" width="95px" :formatter="formatter_price_type"/>
        <vxe-table-column field="price" title="报单价格" width="95px" />
        <vxe-table-column field="filled_quantity" title="交易数量" width="95px" />
        <vxe-table-column field="result" title="交易结果" width="95px" :formatter="formatter_result"/>
        <vxe-table-column field="memo" title="备注" width="125px" />
      </vxe-table>
      <vxe-pager
        :loading="loading"
        :current-page="tableData.currentPage"
        :page-size="tableData.pageSize"
        :total="tableData.totalCount"
        :page-sizes="pageSizes"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      />
    </el-main>
  </el-container>
</template>
<script>
import { getTradeHisData } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
      searchForm: { keyword: '', date: '' },
      loading: false,
      autobtnstr: '开启自动更新',
      tableheight: '500px',
      pageSizes: [100, 500, 1000, 5000],
      tableData: { pageIndex: 1, pageSize: 100, totalCount: 0 }
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 240) + 'px'
    this.fetchData()
  },
  mounted() {
    setInterval(() => {
      if (this.autobtnstr === '关闭自动更新') this.main_loop()
    }, 5000)
  },
  methods: {
    fetchData() {
      this.loading = true
      getTradeHisData({
        keyword: this.searchForm.keyword,
        trade_date: this.searchForm.trade_date,
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage
      }).then(response => {
        this.tableData = response.data.result.data
        this.tableData.pageSize = response.data.result.pageSize
        this.tableData.totalCount = response.data.result.totalCount
        this.tableData.currentPage = response.data.result.pageIndex
        this.loading = false
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      console.log('-->currentPage:' + currentPage)
      this.tableData.currentPage = currentPage
      this.tableData.pageSize = pageSize
      console.log('-->this.tableData.currentPage:' + this.tableData.currentPage)
      this.fetchData()
    },
    auto_query() {
      console.log('-->autobtnstr:' + this.autobtnstr)
      if (this.autobtnstr === '开启自动更新') {
        this.autobtnstr = '关闭自动更新'
      } else {
        this.autobtnstr = '开启自动更新'
      }
      this.$forceUpdate();
    },
    main_loop() {
      console.log('-->main_loop')
      this.fetchData()
    },
    formatter_tactics({ row, cellValue }) {
      if (row.tactics.indexOf('f_') === 0) {
        return '[跟]' + row.tactics_name
      }
    },
    formatter_price_type({ row, cellValue }) {
      if (cellValue === '0') return '限价'
      if (cellValue === '1') return '市价'
    },
    formatter_result({ row, cellValue }) {
      if (cellValue === '0') return '成功'
      if (cellValue === '1') return '失败'
    },
    rowStyle({ row, rowIndex }) {
      if (row.result === '1') {
        return { backgroundColor: 'red', color: '#ffffff' }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
