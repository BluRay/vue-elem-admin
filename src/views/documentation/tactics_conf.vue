<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
    <el-header>
      <vxe-button size="mini" status="primary" @click="showModel = true">增加策略</vxe-button>
    </el-header>
      <el-row :gutter="12">
        <el-col v-for="item in tactics_list" :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>&nbsp;&nbsp;{{item.tactics_name}}</span>
              <el-switch v-model="item.tactics_status" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            &nbsp;&nbsp;<span class="t_memo">策略简介:</span><br/>
            &nbsp;&nbsp;<span><b>{{item.tactics_memo}}</b></span><br/>
            &nbsp;&nbsp;<span class="t_memo">风险提示:</span><br/>
            &nbsp;&nbsp;<span><b>{{item.tactics_rick}}</b></span><br/>
            &nbsp;&nbsp;<span class="t_memo">适用品种:</span>&nbsp;&nbsp;<span><b>{{item.tactics_bookid}}</b></span><br/><br/>
            <vxe-button size="mini" status="success" >编辑</vxe-button>
            <vxe-button size="mini" status="warning" >删除</vxe-button>
            <vxe-button size="mini" disabled status="primary" >详情</vxe-button>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <vxe-modal v-model="showModel" :title="modelTitle" size="mini" width="540" show-footer>
      <table width="100%">
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">策略类型:</span></td>
          <td width="30%">
            <vxe-select v-model="tactics.tactics_type" :transfer="true">
              <vxe-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">状 态:</span></td>
          <td width="30%">
            <vxe-select v-model="tactics.tactics_status" transfer>
              <vxe-option v-for="item in statusList" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </td>
        </tr>
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">策略编号:</span></td>
          <td width="30%">
            <vxe-input v-model="tactics.tactics_code" placeholder="请输入策略编号" />
          </td>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">策略名称:</span></td>
          <td width="30%">
            <vxe-input v-model="tactics.tactics_name" placeholder="请输入策略名称" />
          </td>
        </tr>
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">描述信息:</span></td>
          <td colspan="3">
            <vxe-input style="width:300px" v-model="tactics.tactics_memo" placeholder="请输入描述信息" />
          </td>
        </tr>
        <tr>
          <td width="20%"><span class="vxe-form vxe-form--item-title-label">风险提示:</span></td>
          <td colspan="3">
            <vxe-input style="width:300px" v-model="tactics.tactics_rick" placeholder="请输入风险提示" />
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td><vxe-button size="mini" status="primary" @click="updateConfirmData()">保存</vxe-button></td>
        </tr>
      </table>
    </vxe-modal>
  </el-container>
</template>
<script>
import { getConfig, getRqTacticsData, insertTacticsData } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
      showModel: false,
      modelTitle: '新增策略配置',
    	tactics_list: [{}, {}, {}, {}],
      tactics: {},
      typeList: [{ 'label': '稳健型', 'value': '稳健型' }, { 'label': '保守型', 'value': '保守型' }],
      statusList: [{ 'label': '启用交易', 'value': true }, { 'label': '停止交易', 'value': false }],
    }
  },
  created() {
    this.getRqTacticsData()
  },
  methods: {
  	getconf() {
  		console.log('-->getConf')
  	},
    getRqTacticsData() {
      getRqTacticsData({}).then(res => {
        this.tactics_list = res.data.result.data.dateList
      })
    },
    updateConfirmData() {
      insertTacticsData(this.tactics).then(res => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.t_memo {
  line-height: 40px;
}
</style>
