<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
    	
		<el-row>
		  <el-col :span="4"><el-card :height="tableheight" class="box-card"><div class="grid-content bg-purple">
		  
      <el-tree
			  :props="props"
			  :load="loadNode"
			  node-key="name"
			  :default-expanded-keys="['用户组1']"
			  lazy
			  show-checkbox>
			</el-tree>
			
		  </div></el-card></el-col>
		  <el-col :span="20">
		  <el-card>
		  <div id="ccc" :class="className" :style="{height:height,width:width}" />
		  <line-chart :chart-data="lineChartData" />
		  </div>
		  </el-card>
		  </el-col>
		</el-row>
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
import LineChart from './components/LineChart'
import { getAccountPageList, uploadAccount } from '@/api/remote-search'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }
}
export default {
  name: 'Documentation',
  components: {
    LineChart
   },
  data() {
    return {
    	props: {
        label: 'name',
        children: 'zones'
      },
    	searchForm: { keyword: '', date: '' },
    	lineChartData: lineChartData.newVisitis,
      showModel: false,
      loading: false,
      tableheight: '500px',
	    pageSizes: [100, 500, 1000, 5000],
      tableData: {pageIndex:1, pageSize: 500, totalCount: 0}
  	}
  },
  created() {
    this.tableheight = (document.body.clientHeight - 220) + 'px'
    console.log('-->name:' + this.$store.state.user.name)
    this.lineChartData = lineChartData.newVisitis
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
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: '用户组1' }]);
        }
        if (node.level > 3) return resolve([]);
        var hasChild;
        if (node.data.name === '用户组1') {
          hasChild = true;
        } else {
          hasChild = false;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{name: 'AAA'}, {name: 'BBB'}, {name: 'CCC'}];
          } else {
            data = [];
          }
          resolve(data);
        }, 500);
      }
    
  }
}
</script>

<style lang="css">
.el-card{
  height: 100%;
}
.grid-content{
  height: 100%;
}
</style>
