<template>
  <el-container>
    <el-header>
    	<h3>待上线...{{$store.state.name}}</h3>
      	<!--vxe-form refs="grid_form">
      		<vxe-form-item title="关键字:" titleWidth="80px">
            <template #default>
              <vxe-input v-model="searchForm.keyword"
                clearable
                size="mini"
                placeholder="请输入交易账户/名称/资金账户"
                style="width: 250px;"
                class="filter-item"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item>
        		<vxe-button size="mini" status='success' @click="fetchData()">查询</vxe-button>
          </vxe-form-item>
      	</vxe-form --> &nbsp;&nbsp;
    </el-header>
    <el-main style="padding: 20px 20px 0px 20px;">
      
    </el-main>
    <vxe-modal title="导入交易帐号" v-model="showModel" size="mini" width="500" show-footer>
      <template #default>
        <input type="file" id="files" ref="refFile" v-on:change="importCsv">
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
      tableData: {pageIndex:1, pageSize: 500, totalCount: 0}
    }
  },
  created() {
    this.tableheight = (document.body.clientHeight - 220) + 'px'
    this.fetchData()
    console.log('-->name:' + this.$store.state.user.name)
  },
  methods: {
    fetchData() {
      this.loading = true
      getAccountPageList({
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
		importCsv(){
			let selectedFile = null
			selectedFile = this.$refs.refFile.files[0];
			if(selectedFile.name.indexOf('交易账户_') !== 0 || selectedFile.name.indexOf('.csv') < 0) {
				this.$message({ message: '导入的文件格式不正确!', type: 'error' })
				return false
			}
			if (selectedFile === undefined){
			  return
			}
			var account_date = selectedFile.name.substring(5, 13)
			var reader = new FileReader();
			reader.readAsDataURL(selectedFile);
			reader.onload = evt => {
			  Papa.parse(selectedFile, {
			    encoding: 'gb2312',
			    complete: res => {
			      let data = res.data;
			      if (data[data.length - 1] == "") {
			        //去除最后的空行
			        data.pop();
			      }
			      console.log(data);  // data就是文件里面的数据
			      uploadAccount({ upload_data: data, account_date: account_date }).then(response => {
			      	if(response.data.code === -1) {
			      		this.$message({ message: account_date + '的数据已经导入!', type: 'error' })
			      	} else {
					      this.$message({ message: '导入成功!', type: 'success' })
					      this.showModel = false
					      this.fetchData()
					    }
				    })
			    }
			  });
			};
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
