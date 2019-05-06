<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="昵称" prop="institution_name">
              <el-input v-model="form.institution_name"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="社交账号" prop="social_accounts">
              <el-input v-model="form.social_accounts"></el-input>
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
      apiPath: '/api/certification',
      form: {
        institution_name: '',
        name: '',
        phone: '',
        social_accounts: '',
      },
      rules: {
        institution_name: [
          {required: true, message: `请输入机构名字`, trigger: 'blur'}
        ],
        name: [
          {required: true, message: `请输入姓名`, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: `请输入手机号`, trigger: 'blur'}
        ],
        social_accounts: [
          {required: true, message: `请输入机构地址`, trigger: 'blur'}
        ],
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
      this.form = result.data
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
