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
          <vxe-button size="mini" status="primary" @click="fetchData()">查询</vxe-button>
          <vxe-button size="mini" status="success" @click="showModel = true">新增</vxe-button>
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
        <vxe-table-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button status="warning" content="编辑" @click="updateRowEvent(row)"></vxe-button>
            <vxe-button status="danger" content="删除" @click="deleteRowEvent(row)"></vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
    <vxe-modal v-model="showModel" title="新增交易品种" size="mini" width="500" show-footer>
      <template #default>
      <vxe-form refs="add_form">
        <vxe-form-item field="flag1" title="合约编号:" title-width="70px" :span="12" :item-render="{}">
          <vxe-input v-model="book.book_id" placeholder="请输入合约编号"></vxe-input>
        </vxe-form-item>
        <vxe-form-item field="flag1" title="交易品种:" title-width="70px" :span="12" :item-render="{}">
          <vxe-input v-model="book.book_name" placeholder="请输入交易品种"></vxe-input>
        </vxe-form-item>
        <vxe-form-item field="flag1" title="交 易 所:" title-width="70px" :span="12" :item-render="{}">
          <vxe-select v-model="book.exchange_id" transfer>
            <vxe-option v-for="item in exchangeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
          </vxe-select>
        </vxe-form-item>
        <vxe-form-item align="center" title-align="left" :span="24">
          <template #default>
            <vxe-button type="submit">提交</vxe-button>
            <vxe-button type="reset">重置</vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
      </template>
    </vxe-modal>
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
      exchangeList: [{label:'上期所',value:'AAA'},{label:'bbb',value:'bbb'}],
      book: {}
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
    deleteRowEvent(row) {
	    if(confirm("确认要删除吗?")) {
	    	this.$message({ message: '删除成功!', type: 'success' })
	    }

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
