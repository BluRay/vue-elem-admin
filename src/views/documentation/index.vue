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
        <vxe-form-item title="数据日期:" title-width="80px">
          <template #default>
            <vxe-input
              v-model="searchForm.date"
              type="date"
              value-format="yyyyMMdd"
              label-format="yyyyMMdd"
              clearable
              size="mini"
              placeholder="数据日期"
              style="width: 120px;"
              class="filter-item"
            />
          </template>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button size="mini" status="success" @click="fetchData()">查询交易账号</vxe-button>
          <vxe-button size="mini" status="warning" @click="showModel = true">导入交易账号</vxe-button>
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
        :data="tableData.data"
      >
        <vxe-table-column type="seq" title="序号" fixed="left" width="45px" />
        <vxe-table-column field="交易账户" title="交易账户" fixed="left" width="95px" sortable />
        <vxe-table-column field="名称" title="名称" fixed="left" width="95px" />
        <vxe-table-column field="风险度" title="风险度" width="95px" sortable />
        <vxe-table-column field="市值权益" title="市值权益" width="110px" sortable />
        <vxe-table-column field="优先资金" title="优先资金" width="95px" />
        <vxe-table-column field="劣后资金" title="劣后资金" width="95px" />
        <vxe-table-column field="安全度" title="安全度" width="95px" sortable />
        <vxe-table-column field="可用资金" title="可用资金" width="110px" sortable />
        <vxe-table-column field="平仓盈亏" title="平仓盈亏" width="95px" />
        <vxe-table-column field="持仓盈亏" title="持仓盈亏" width="95px" />
        <vxe-table-column field="保证金" title="保证金" width="95px" sortable />
        <vxe-table-column field="手续费" title="手续费" width="95px" sortable />
        <vxe-table-column field="挂单冻结" title="挂单冻结" width="95px" />
        <vxe-table-column field="出入金" title="出入金" width="95px" />
        <vxe-table-column field="当前权益" title="当前权益" width="110px" />
        <vxe-table-column field="期权市值" title="期权市值" width="95px" />
        <vxe-table-column field="权利金收支" title="权利金收支" width="95px" />
        <vxe-table-column field="上日市值权益" title="上日市值权益" width="95px" />
        <vxe-table-column field="上日权益" title="上日权益" width="95px" />
        <vxe-table-column field="上日期权市值" title="上日期权市值" width="95px" />
        <vxe-table-column field="期初投入" title="期初投入" width="95px" />
        <vxe-table-column field="净值" title="净值" width="95px" sortable />
        <vxe-table-column field="组别" title="组别" width="95px" />
        <vxe-table-column field="所属资金账户" title="所属资金账户" width="95px" />
        <vxe-table-column field="备注" title="备注" width="95px" />
      </vxe-table>
      <vxe-pager
        :loading="loading"
        :current-page="tableData.pageIndex"
        :page-size="tableData.pageSize"
        :total="tableData.totalCount"
        :page-sizes="pageSizes"
        @page-change="handlePageChange"
      />
    </el-main>
    <vxe-modal v-model="showModel" title="导入交易帐号" size="mini" width="500" show-footer>
      <template #default>
        <input id="files" ref="refFile" type="file" @change="importCsv">
        <p>导入csv文件标题格式为[交易账户_日期.csv] 如:交易账户_20251018.csv</p>
      </template>
    </vxe-modal>
  </el-container>
</template>

<script>
import Papa from 'papaparse'
import { getAccountPageList, uploadAccount } from '@/api/remote-search'
export default {
  name: 'Documentation',
  data() {
    return {
    	searchForm: { keyword: '', date: '' },
      showModel: false,
      loading: false,
      tableheight: '500px',
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
      getAccountPageList({
      	keyword: this.searchForm.keyword,
      	account_date: this.searchForm.date,
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage
      }).then(response => {
        this.tableData = response.data.result
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
