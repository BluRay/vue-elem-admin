<template>
  <el-container>
    <el-header>
      <el-card class="box-card" style="{padding: 1px}">
        <vxe-button size="mini" @click="showModel = true">基本窗口</vxe-button>
      </el-card>
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
        :data="tableData.data"
      >
        <vxe-table-column type="seq" title="序号" fixed="left" width="45px" />
        <vxe-table-column field="USERNAME" title="工号" fixed="left" width="75px" />
        <vxe-table-column field="USERNAME" title="姓名" fixed="left" width="65px" />
        <vxe-table-column field="ADDRESS" title="内容" fixed="left" />
      </vxe-table>
      <vxe-pager
        border
        :loading="loading"
        :current-page="tableData.pageIndex"
        :page-size="tableData.pageSize"
        :total="tableData.totalCount"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      />
    </el-main>
    <vxe-modal v-model="showModel" size="mini" width="600" show-footer>
      <template #default>
        <p>aaa</p>
      </template>
    </vxe-modal>
  </el-container>
</template>

<script>
import { transactionList } from '@/api/remote-search'
export default {
  name: 'Documentation',
  data() {
    return {
      showModel: false,
      loading: false,
      tableheight: '500px',
      tableData: {}
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 215) + 'px'
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('---->this.tableData.currentPage:' + this.tableData.currentPage)
      this.loading = true
      transactionList({
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage
      }).then(response => {
        this.tableData = response
        this.loading = false
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      console.log('-->currentPage:' + currentPage)
      this.tableData.currentPage = currentPage
      this.tableData.pageSize = pageSize
      console.log('-->this.tableData.currentPage:' + this.tableData.currentPage)
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
