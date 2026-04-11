<template>
  <el-container>
    <el-header>
      <vxe-form refs="grid_form">
        <vxe-form-item title="交易所:" title-width="80px">
          <template #default>
            <vxe-select v-model="searchForm.exchange" transfer>
            <vxe-option v-for="item in exchangeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
          </template>
        </vxe-form-item>
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
          <vxe-button size="mini" status="primary" @click="fetchData()">查询交易账号</vxe-button>
          <vxe-button size="mini" status="success" @click="addTradeUser()">新增交易账号</vxe-button>
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
        <vxe-table-column field="account_id" title="交易账户" fixed="left" width="120px" sortable />
        <vxe-table-column field="account_password" title="交易所" width="130px" />
        <vxe-table-column field="account_name" title="余额" width="90px" />
        <vxe-table-column field="futures_company" title="状态" width="90px" />
        <vxe-table-column field="account_type" title="帐号类型" width="90px" />
        <vxe-table-column field="CloseProfit" title="当前持仓" width="90px" />
        <vxe-table-column field="PositionProfit" title="当前盈亏" width="90px" />
        <vxe-table-column field="CloseProfit" title="历史持仓" width="90px" />
        <vxe-table-column field="Commission" title="历史盈亏" width="90px" />
        <vxe-table-column field="Available" title="可用资金" width="90px" />
        <vxe-table-column field="CurrMargin" title="保证金总额" width="90px" />
        <vxe-table-column field="account_manager" title="管理员" width="90px" />
        <vxe-table-column field="update_time" title="交易明细" width="140px" />
        <vxe-table-column field="memo" title="备注" width="100px" />
        <vxe-table-column title="操作" fixed="right" width="140">
          <template #default="{ row }">
            <vxe-button status="primary" size="mini" content="编辑" @click="updateRowEvent(row)" />
            <vxe-button status="danger" size="mini" content="删除" @click="deleteRowEvent(row)" />
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
    <vxe-modal v-model="showModel" :title="modelTitle" size="mini" width="540" show-footer>
      <table width="100%">
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">交易帐号:</span></td>
          <td width="30%"><vxe-input v-model="user.account_id" placeholder="请输入交易帐号" /></td>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">交易密码:</span></td>
          <td width="30%"><vxe-input v-model="user.account_password" placeholder="请输入交易密码" /></td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">帐户姓名:</span></td>
          <td><vxe-input v-model="user.account_name" placeholder="请输入帐户姓名" /></td>
          <td><span class="vxe-form vxe-form--item-title-label">管理人员:</span></td>
          <td><vxe-input v-model="user.account_manager" placeholder="请输入管理人姓名" /></td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">期货公司:</span></td>
          <td><vxe-input v-model="user.futures_company" placeholder="请输入期货公司" /></td>
          <td><span class="vxe-form vxe-form--item-title-label">账号类型:</span></td>
          <td>
            <vxe-select v-model="user.account_type" transfer>
              <vxe-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td><vxe-button size="mini" status="primary" @click="updateConfirmData()">保存</vxe-button></td>
          <td><vxe-button v-if="user.id === ''" size="mini" status="success" @click="addConfirmDataMore()">保存并继续新增</vxe-button></td>
        </tr>
      </table>
    </vxe-modal>
  </el-container>
</template>

<script>
import Papa from 'papaparse'
import { getRqTradeAccountData, insertTradeAccountData, updateTradeAccountData, deleteTradeAccountData, uploadAccount } from '@/api/remote-search'
export default {
  name: 'Digitalmoneyaccount',
  data() {
    return {
    	searchForm: { keyword: '', exchange: 'HTX' },
      showModel: false,
      loading: false,
      tableheight: '500px',
      user: {},
      modelTitle: '新增交易用户',
      exchangeList: [{ 'label': 'HTX', 'value': 'HTX' }, { 'label': 'OKX', 'value': 'OKX' }],
	    pageSizes: [100, 500, 1000, 5000],
      tableData: { pageIndex: 1, pageSize: 500, totalCount: 0 }
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 220) + 'px'
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getRqTradeAccountData({
      	keyword: this.searchForm.keyword,
      	account_date: this.searchForm.date,
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage
      }).then(response => {
        this.tableData = response.data.result.data.dateList
        this.loading = false
        this.searchForm.date = response.data.result.data[0].数据日期
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      console.log('-->currentPage:' + currentPage)
      this.tableData.currentPage = currentPage
      this.tableData.pageSize = pageSize
      console.log('-->this.tableData.currentPage:' + this.tableData.currentPage)
      this.fetchData()
    },
    addTradeUser() {
      this.user = { id: '', account_type: '测试', status: '0'}
      this.showModel = true
    },
    addConfirmDataMore() {
      insertTradeAccountData(this.user).then(response => {
        this.loading = false
        if (response.data.result === 0) {
          this.$message({ message: '操作成功!', type: 'success' })
          this.user = { id: '', account_type: '测试', status: '0' }
          this.fetchData()
        } else {
          this.$message({ message: '操作失败!', type: 'error' })
        }
      })
    },
    updateRowEvent(row) {
      this.user = row
      this.showModel = true
    },
    updateConfirmData() {
      if ((this.user.id || '') === '') {
        insertTradeAccountData(this.user).then(response => {
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.user = { id: '', account_type: '测试', status: '0' }
            this.showModel = false
            this.fetchData()
          } else {
            this.$message({ message: '操作失败!', type: 'error' })
          }
        })
      } else {
        updateTradeAccountData(this.user).then(response => {
          this.loading = false
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.fetchData()
            this.showModel = false
          }
        })
      }
    },
    deleteRowEvent(row) {
      if (confirm('确认要删除吗?')) {
        deleteTradeAccountData(row).then(response => {
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.showModel = false
            this.fetchData()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
