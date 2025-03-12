<template>
  <el-form>
    <el-form-item label="帐号名称">
      <el-input v-model.trim="user.name" disabled />
    </el-form-item>
    <el-form-item label="手机号码">
      <el-input v-model.trim="user.tel" placeholder="手机号码" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" placeholder="Email" />
    </el-form-item>
    <el-form-item label="账号密码">
      <el-input v-model.trim="user.password" type="password" placeholder="不修改密码可不填" />
    </el-form-item>
    <el-form-item label="重复密码">
      <el-input v-model.trim="user.confirm_password" type="password" placeholder="不修改密码可不填" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
