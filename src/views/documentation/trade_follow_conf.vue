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
              placeholder="请输入交易账户/姓名/联系电话"
              style="width: 250px;"
              class="filter-item"
            />
          </template>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button size="mini" status="primary" @click="fetchData()">查询跟单账号</vxe-button>
          <vxe-button size="mini" status="success" @click="addFollerUser()">新增跟单账号</vxe-button>
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
        <vxe-table-column field="display_name" title="账户姓名" width="95px" />
        <vxe-table-column field="trade_account" title="交易帐号" width="95px" />
        <vxe-table-column field="trade_company" title="期货公司" width="95px" />
        <vxe-table-column field="phone_number" title="联系电话" width="95px" />
        <vxe-table-column field="address" title="联系地址" width="95px" />
        <vxe-table-column field="status" title="状态" width="95px" />
        <vxe-table-column field="follow_tactics_1" title="跟单策略1" width="95px" />
        <vxe-table-column field="follow_tactics_2" title="跟单策略2" width="95px" />
        <vxe-table-column field="follow_tactics_3" title="跟单策略3" width="95px" />
        <vxe-table-column field="follow_tactics_4" title="跟单策略4" width="95px" />
        <vxe-table-column field="follow_tactics_5" title="跟单策略5" width="95px" />
        <vxe-table-column field="memo" title="备注" width="125px" />
        <vxe-table-column title="操作" fixed="right" width="200">
          <template #default="{ row }">
            <vxe-button status="primary" content="编辑" @click="updateRowEvent(row)" />
            <vxe-button status="warning" content="分配策略" @click="updateTacticsRowEvent(row)" />
            <vxe-button status="danger" content="删除" @click="deleteRowEvent(row)" />
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
    <vxe-modal v-model="showModel" :title="modelTitle" size="mini" width="540" show-footer>
      <table width="100%">
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">用户帐号:</span></td>
          <td width="30%"><vxe-input v-model="user.username" placeholder="请输入用户帐号" /></td>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">初始密码:</span></td>
          <td width="30%"><vxe-input v-model="user.password" placeholder="请输入初始密码" /></td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">用户姓名:</span></td>
          <td><vxe-input v-model="user.display_name" placeholder="请输入用户姓名" /></td>
          <td><span class="vxe-form vxe-form--item-title-label">电话号码:</span></td>
          <td><vxe-input v-model="user.phone_number" placeholder="请输入电话号码" /></td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">交易帐号:</span></td>
          <td><vxe-input v-model="user.trade_account" placeholder="请输入交易帐号" /></td>
          <td><span class="vxe-form vxe-form--item-title-label">期货公司:</span></td>
          <td><vxe-input v-model="user.trade_company" placeholder="请输入期货公司" /></td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">状态:</span></td>
          <td>
            <vxe-select v-model="user.status" transfer>
              <vxe-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
          <td><span class="vxe-form vxe-form--item-title-label">备注:</span></td>
          <td><vxe-input v-model="user.memo" placeholder="请输入期货公司" /></td>
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
import { getFollowUserData, insertFollowUserData } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
    	searchForm: { keyword: '', date: '' },
      loading: false,
      showModel: false,
      tableheight: '500px',
      modelTitle: '新增跟单用户',
      user: {},
      statusList: [{ 'label': '正常', 'value': '正常' }, { 'label': '禁用', 'value': '禁用' }],
      pageSizes: [100, 500, 1000, 5000],
      tableData: { pageIndex: 1, pageSize: 500, totalCount: 0 }
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 220) + 'px'
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getFollowUserData({
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
    addFollerUser() {
      this.user = { id: '', status: '正常'}
      this.showModel = true
    },
    addConfirmDataMore() {
      insertFollowUserData(this.user).then(response => {
        this.loading = false
        if (response.data.result === 0) {
          this.$message({ message: '操作成功!', type: 'success' })
          this.book = { id: '', status: '正常' }
          this.fetchData()
        } else {
          this.$message({ message: '操作失败!', type: 'error' })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
