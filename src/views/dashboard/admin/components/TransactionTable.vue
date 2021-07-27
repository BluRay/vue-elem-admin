<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="用户名" min-width="70">
      <template slot-scope="scope">
        {{ scope.row.USERNAME }}
      </template>
    </el-table-column>
    <el-table-column label="地址" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.ADDRESS }}
      </template>
    </el-table-column>
    <el-table-column label="备注" align="center">
      <template slot-scope="scope">
        {{ scope.row.MEMO }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList({}).then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
