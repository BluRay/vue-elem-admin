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
        <vxe-table-column field="account_id" title="交易账户" fixed="left" width="95px" sortable />
        <vxe-table-column field="account_password" title="交易密码" width="130px" />
        <vxe-table-column field="account_name" title="账户名称" width="90px" />
        <vxe-table-column field="futures_company" title="期货公司" width="90px" />
        <vxe-table-column field="account_type" title="帐号类型" width="90px" />
        <vxe-table-column field="CloseProfit" title="平仓盈亏" width="90px" />
        <vxe-table-column field="PositionProfit" title="持仓盈亏" width="90px" />
        <vxe-table-column field="CloseProfit" title="平仓盈亏" width="90px" />
        <vxe-table-column field="Commission" title="手续费" width="90px" />
        <vxe-table-column field="Available" title="可用资金" width="90px" />
        <vxe-table-column field="CurrMargin" title="保证金总额" width="90px" />
        <vxe-table-column field="account_manager" title="管理员" width="90px" />
        <vxe-table-column field="update_time" title="更新时间" width="140px" />
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
  name: 'TradAccount',
  data() {
    return {
    	searchForm: { keyword: '', date: '' },
      showModel: false,
      loading: false,
      tableheight: '500px',
      user: {},
      modelTitle: '新增交易用户',
      statusList: [{ 'label': '测试', 'value': '测试' }, { 'label': '实盘', 'value': '实盘' }],
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
    },
    importCsv() {
      let selectedFile = null
      selectedFile = this.$refs.refFile.files[0]
      if (selectedFile.name.indexOf('交易账户_') !== 0 || selectedFile.name.indexOf('.csv') < 0) {
        this.$message({ message: '导入的文件格式不正确!', type: 'error' })
        return false
      }
      if (selectedFile === undefined) {
			  return
      }
      var account_date = selectedFile.name.substring(5, 13)
      var reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      reader.onload = evt => {
			  Papa.parse(selectedFile, {
			    encoding: 'gb2312',
			    complete: res => {
			      const data = res.data
			      if (data[data.length - 1] == '') {
			        // 去除最后的空行
			        data.pop()
			      }
			      console.log(data) // data就是文件里面的数据
			      uploadAccount({ upload_data: data, account_date: account_date, user_name: this.$store.state.user.name }).then(response => {
			      	if (response.data.code === -1) {
			      		this.$message({ message: account_date + '的数据已经导入!', type: 'error' })
			      	} else {
					      this.$message({ message: '导入成功!', type: 'success' })
					      this.showModel = false
					      this.fetchData()
					    }
				    })
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
    /**
     * ----------------------Axios发送post请求下载文件------------------------------------
     * 后台使用hutool工具创建的excel的writer，默认为xls格式：
     * @PostMapping("/hit/excelExport")
		  public void excelExport(HttpServletResponse httpServletResponse,WeSensitiveHitQuery query) throws IOException {
      PageInfo<IndexAudit> pageResult = weSensitiveService.getHitSensitivePageInfo(query);
			List<IndexAudit> resultList = new ArrayList<IndexAudit>();
			resultList = pageResult.getList();
      Long total = pageResult.getTotal();
      System.out.println("-->total : " + total);
      if (total > 10000) {
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setHeader("Content-Type", "application/json");
        httpServletResponse.getWriter().write("{\"code\":-1,\"msg\":\"over 10000\"}");
        return;
      }
			//通过hutool工具创建的excel的writer，默认为xls格式
			ExcelWriter writer = ExcelUtil.getWriter();
			//自定义excel标题和列名
			writer.addHeaderAlias("froms","发送人");
			writer.addHeaderAlias("tolist","接收人");
			writer.addHeaderAlias("msgData","内容");
			writer.addHeaderAlias("msgDate","发送时间");
			writer.setColumnWidth(0,0);
			writer.setColumnWidth(1,15);
			writer.setColumnWidth(2,40);
			writer.setColumnWidth(3,120);
			writer.setColumnWidth(4,30);
			// 合并单元格后的标题行，使用默认标题样式
			// writer.merge(3,"会话检索信息");
			writer.renameSheet(0,"企业微信会话");
			//一次性写出内容，使用默认样式，强制输出标题
			writer.write(resultList,true);

			httpServletResponse.setContentType("application/vnd.ms-excel;charset=utf-8");
			//name是下载对话框的名称，不支持中文，想用中文名称需要进行utf8编码
			String excelName = "excelExport";
			excelName = new String(excelName.getBytes(),"utf-8");
			httpServletResponse.setHeader("Content-Disposition", "attachment;filename=" + excelName +".xls");

			//将excel文件信息写入输出流，返回给调用者
			ServletOutputStream excelOut = null;
			try {
			excelOut = httpServletResponse.getOutputStream();
			writer.flush(excelOut,true);
			} catch (IOException e) {
			e.printStackTrace();
			}finally {
			writer.close();
			}
			IoUtil.close(excelOut);
		}
    -----------------------------------------------------------

    exportData() {
      const form = this.getSearchForm() // 要发送到后台的数据
      axios({ // 用axios发送post请求
        method: 'post',
        url: '/user/12345', // 请求地址
        data: form, // 参数
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then((res) => { // 处理返回的文件流
        const content = res
        const blob = new Blob([content])
        const fileName = '测试表格123.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
    */
  }
}
</script>

<style lang="scss" scoped>
</style>
