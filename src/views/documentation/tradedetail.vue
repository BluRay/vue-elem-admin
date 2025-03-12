<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">

      <el-row>
        <el-col :span="4"><el-card :height="tableheight" class="box-card"><div class="grid-content bg-purple">

        <el-tree ref="tree"
				  :props="props"
				  :load="loadNode"
				  @check="chaneuser"
				  node-key="id"
				  lazy
				  show-checkbox>
				</el-tree>

        </div></el-card></el-col>
        <el-col :span="20">
          <el-card>
            <div id="ccc" />
            <line-chart :chart-data="lineChartData" />
            </div>
          </el-card>
        </el-col>
      </el-row>
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
import LineChart from './components/LineChart'
import { getAccountLineChart } from '@/api/remote-search'
var lineChartData = {
  newVisitis: {}
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
      exptreenode: ['请选择帐户'],
      treedata: [],
      defaultProps: {
          children: 'children',
          label: 'label'
        },
    	searchForm: { keyword: '', date: '' },
    	xdata: [],
    	total_lineData: [],
    	lineChartData2: {
    xdata: [],
    account: [],
    series: [{
          name: '吴晓康', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          data: [100, 120, 161, 134, 105, 160, 165],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '邹龙',
          smooth: false,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [120, 82, 91, 154, 162, 140, 145],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
  },lineChartData: {
    xdata: [],
    account: [],
    series: []
  },
      showModel: false,
      loading: false,
      tableheight: '500px',
	    pageSizes: [100, 500, 1000, 5000],
      tableData: { pageIndex: 1, pageSize: 500, totalCount: 0 }
  	}
  },
  created() {
    this.fetchData()
    //this.lineChartData = lineChartData.newVisitis
  },
  methods: {
    fetchData() {
      this.loading = true
      this.xdata = []
      getAccountLineChart({}).then(response => {
      	this.total_lineData = response.data.lineData
      	response.data.lineData.forEach(d => {
      		this.treedata.push({id:d.id, name: d['名称']})
      	})
      	response.data.dateList.forEach(d => {
      		this.xdata.push(d['数据日期'].substring(4))
      	})
      	this.xdata.reverse()
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    chaneuser(){
    	console.log('-->chaneuser', this.$refs.tree.getCheckedNodes())
    	this.lineChartData.account = []
    	this.lineChartData.series = []
    	this.$refs.tree.getCheckedNodes().forEach(d => {
    		this.lineChartData.account.push(d.name)
    		let rlist = []
    		this.total_lineData.forEach(s => {
    			if(s['名称'] === d.name) {
    				this.xdata.forEach(x => {
    					rlist.push(s['2025' + x])
    				})
    			}
    		})
    		this.lineChartData.series.push({
    			name: d.name,
    			smooth: false,
          type: 'line',
          data: rlist,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
    		})
    	})
    	
    	/**this.lineChartData.series = [{
          name: '吴晓康', 
          smooth: false,
          type: 'line',
          data: [100, 120, 161, 134, 105, 160, 165],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '邹龙',
          smooth: false,
          type: 'line',
          data: [120, 82, 91, 154, 162, 140, 145],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]**/
    	this.lineChartData.xdata = this.xdata
    },
		loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{id: 999, name: '请选择帐户', disabled: true }]);
        }
        if (node.level > 1) return resolve([]);
        resolve(this.treedata);
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
