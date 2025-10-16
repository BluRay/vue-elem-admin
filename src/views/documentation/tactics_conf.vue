<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>通道策略</span>
              <el-switch v-model="tactics_1" active-text="开启" inactive-text="关闭" style="float: right; padding: 3px 0" active-color="#13ce66" inactive-color="#ff4949" />
            </div>
            <p>TraticsConfig</p>
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
