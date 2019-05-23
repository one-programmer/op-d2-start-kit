<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="real_name">
              <el-input v-model="form.real_name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="社交账号" prop="wechat">
              <el-input v-model="form.wechat"></el-input>
            </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </d2-container>
</template>
<script>
export default {
  data () {
    return {
      id: this.$route.params.id,
      apiPath: '/api/admin/user',
      form: {},
      rules: {
      },
    }
  },
  created () {
    this.initForm()
  },
  methods: {
    async initForm () {
      const result = await this.$axios({
        method: 'get',
        url: `${this.apiPath}/${this.id}/`
      })
      console.log('fetch detail', this.id, result)
      this.form = result
    },
    async onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('submit!')
          await this.$axios({
            method: 'put',
            url: `${this.apiPath}/${this.id}/`,
            data: this.form
          })
          this.$notify({
            title: '成功',
            message: `保存成功`,
            type: 'success'
          })
          this.$router.push({ path: '/certification' })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel () {
      let routeName = this.$route.name
      this.$store.commit('d2admin/page/close', {
        tagName: routeName,
        vm: this
      })
    },
  }
}
</script>
<style>
.avatar {
  width: 50px;
  display: block;
}
</style>
