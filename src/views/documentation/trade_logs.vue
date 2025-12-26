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
        <vxe-table-column field="account" title="交易帐号" width="95px" />
        <vxe-table-column field="target" title="交易品种" width="95px" />
        <vxe-table-column field="tactics" title="交易策略" width="95px" />
        <vxe-table-column field="trade_time" title="交易时间" width="95px" />
        <vxe-table-column field="trade_type" title="交易类型" width="95px" />
        <vxe-table-column field="price_type" title="下单类型" width="95px" />
        <vxe-table-column field="price" title="报单价格" width="95px" />
        <vxe-table-column field="filled_quantity" title="交易数量" width="95px" />
        <vxe-table-column field="result" title="交易结果" width="95px" />
        <vxe-table-column field="memo" title="备注" width="125px" />
      </vxe-table>
    </el-main>
  </el-container>
</template>
<script>
import { getConfig } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
      searchForm: { keyword: '', date: '' },
      loading: false,
      tableheight: '500px',
      pageSizes: [100, 500, 1000, 5000],
      tableData: { pageIndex: 1, pageSize: 500, totalCount: 0 }
    }
  },
  created() {
    this.getconf()
  },
  methods: {
  	getconf() {
  		console.log('-->getConf')
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
