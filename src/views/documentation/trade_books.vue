<template>
  <el-container>
    <el-header>
      <span class="vxe-form vxe-form--item-title-label">关键字:</span>
      <vxe-input
        v-model="searchForm.keyword"
        clearable
        size="mini"
        placeholder="请输入交易账户/名称/资金账户"
        style="width: 250px;"
        class="filter-item"
      />&nbsp;&nbsp;
      <span class="vxe-form vxe-form--item-title-label">状 态:</span>
      <vxe-select v-model="searchForm.status" transfer>
        <vxe-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
      </vxe-select>&nbsp;&nbsp;
      <vxe-button size="mini" status="primary" @click="fetchData()">查询</vxe-button>
      <vxe-button size="mini" status="success" @click="book = {status: '启用交易'};modelTitle = '新增交易品种';showModel = true">新增</vxe-button>&nbsp;&nbsp;
    </el-header>
    <el-main style="padding: 10px 10px 0px 10px;">
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
            <vxe-button status="warning" content="编辑" @click="updateRowEvent(row)" />
            <vxe-button status="danger" content="删除" @click="deleteRowEvent(row)" />
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-main>
    <vxe-modal v-model="showModel" :title="modelTitle" size="mini" width="540" show-footer>
      <table width="100%">
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">交 易 所:</span></td>
          <td width="30%">
            <vxe-select v-model="book.exchange_id" :transfer="true">
              <vxe-option v-for="item in exchangeList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">状 态:</span></td>
          <td width="30%">
            <vxe-select v-model="book.status" transfer>
              <vxe-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
        </tr>
        <tr>
          <td><span class="vxe-form vxe-form--item-title-label">合约编号:</span></td>
          <td><vxe-input v-model="book.book_id" placeholder="请输入合约编号" /></td>
          <td><span class="vxe-form vxe-form--item-title-label">交易品种:</span></td>
          <td><vxe-input v-model="book.book_name" placeholder="请输入交易品种" /></td>
        </tr>
        <tr>
          <td />
          <td />
          <td><vxe-button size="mini" status="primary" @click="updateConfirmData()">确认</vxe-button></td>
          <td />
        </tr>
      </table>
    </vxe-modal>
  </el-container>
</template>

<script>
import Papa from 'papaparse'
import { getRqTradeBooksData, insertTradeBooksData, updateTradeBooksData, deleteTradeBooksData } from '@/api/remote-search'
export default {
  name: 'TradBooks',
  data() {
    return {
    	searchForm: { keyword: '', status: '启用交易' },
      showModel: false,
      loading: false,
      tableheight: '500px',
      modelTitle: '新增交易品种',
	    pageSizes: [100, 500, 1000, 5000],
      tableData: [],
      exchangeList: [
        { label: '上海期货交易所', value: 'SHFE' },
        { label: '郑州商品交易所', value: 'CZCE' },
        { label: '大连商品交易所', value: 'DCE' },
        { label: '中国金融期货交易所', value: 'CFFEX' },
        { label: '广州期货交易所', value: 'GFEX' }
      ],
      statusList: [{ 'label': '启用交易', 'value': '启用交易' }, { 'label': '停止交易', 'value': '停止交易' }],
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
      	keyword: this.searchForm.keyword,
        status: this.searchForm.status
      }).then(response => {
        this.tableData = response.data.result.data.dateList
        this.loading = false
      })
    },
    updateRowEvent(row) {
      this.modelTitle = '编辑交易品种'
      this.book = row
      this.showModel = true
    },
    updateConfirmData() {
      console.log(this.book)
      this.exchangeList.forEach(e => {
        if (e.value === this.book.exchange_id) {
          this.book.exchange_name = e.label
        }
      })
      this.loading = true
      if ((this.book.id || '') === '') {
        insertTradeBooksData(this.book).then(response => {
          this.loading = false
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.showModel = false
            this.fetchData()
          } else {
            this.$message({ message: '操作失败!品种已经存在', type: 'success' })
          }
        })
      } else {
        updateTradeBooksData(this.book).then(response => {
          this.loading = false
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.showModel = false
          }
        })
      }
    },
    deleteRowEvent(row) {
	    if (confirm('确认要删除吗?')) {
        deleteTradeBooksData(row).then(response => {
          this.loading = false
          if (response.data.result === 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.showModel = false
            this.fetchData()
          }
        })
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
