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
          <vxe-button size="mini" status="success" @click="fetchData()">查询交易账号</vxe-button>
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
        <vxe-table-column field="username" title="跟单账户" fixed="left" width="95px" sortable />
        <vxe-table-column field="display_name" title="账户名称" width="95px" />
        <vxe-table-column field="trade_account" title="交易帐号" width="95px" />
        <vxe-table-column field="status" title="交易状态" width="95px" />
        <vxe-table-column field="user_type" title="当前交易品种" width="95px" />
        <vxe-table-column field="user_type" title="当前跟单策略" width="95px" />
        <vxe-table-column field="user_manager" title="持仓" width="95px" />
        <vxe-table-column field="user_manager" title="盈亏" width="95px" />
        <vxe-table-column field="memo" title="备注" width="125px" />
        <vxe-table-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button status="warning" content="详情" />
          </template>
        </vxe-table-column>
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
