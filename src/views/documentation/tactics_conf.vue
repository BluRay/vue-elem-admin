<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
    <el-header>
      <vxe-button size="mini" status="primary" >增加策略</vxe-button>
    </el-header>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>策略1 [离线]</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <span>策略简介:</span><br/>
            <span>风险提示:</span><br/>
            <span>适用品种:</span><br/><br/>
            <vxe-button size="mini" status="success" >编辑</vxe-button>
            <vxe-button size="mini" status="warning" >删除</vxe-button>
            <vxe-button size="mini" status="primary" >详情</vxe-button>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>策略2 [离线]</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <span>策略简介:</span><br/>
            <span>风险提示:</span><br/>
            <span>适用品种:</span><br/><br/>
            <vxe-button size="mini" status="success" >编辑</vxe-button>
            <vxe-button size="mini" status="warning" >删除</vxe-button>
            <vxe-button size="mini" status="primary" >详情</vxe-button>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>策略3 [离线]</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <span>策略简介:</span><br/>
            <span>风险提示:</span><br/>
            <span>适用品种:</span><br/><br/>
            <vxe-button size="mini" status="success" >编辑</vxe-button>
            <vxe-button size="mini" status="warning" >删除</vxe-button>
            <vxe-button size="mini" status="primary" >详情</vxe-button>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>策略4 [离线]</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <span>策略简介:</span><br/>
            <span>风险提示:</span><br/>
            <span>适用品种:</span><br/><br/>
            <vxe-button size="mini" status="success" >编辑</vxe-button>
            <vxe-button size="mini" status="warning" >删除</vxe-button>
            <vxe-button size="mini" status="primary" >详情</vxe-button>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import { getConfig } from '@/api/remote-search'
export default {
  name: 'TacticsConfig',
  components: {},
  data() {
    return {
    	tactics_1: true
    }
  },
  created() {
    this.getconf()
  },
  methods: {
  	getconf() {
  		console.log('-->getConf')
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
