<template>
  <el-container>
    <el-main style="padding: 20px 20px 0px 20px;">
    <el-header>
      <h3>跟单交易界面</h3>
    </el-header>
      <el-row :gutter="12">
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
