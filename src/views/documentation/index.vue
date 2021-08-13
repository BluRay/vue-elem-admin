<template>
  <el-container>
    <el-header>
      <el-card class="box-card" style="padding: 1px">
        <vxe-button size="mini" @click="showModel = true">功能</vxe-button>
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
        <p>Axios发送post请求下载文件</p>
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
