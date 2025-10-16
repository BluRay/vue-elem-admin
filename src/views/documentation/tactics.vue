<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>高频策略</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <p>策略下载</p>
            <p>参数配置</p>
            <p>历史记录</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>通道策略</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <p>策略下载</p>
            <p>参数配置</p>
            <p>历史记录</p>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import { getConfig } from '@/api/remote-search'
export default {
  name: 'Tactics',
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
