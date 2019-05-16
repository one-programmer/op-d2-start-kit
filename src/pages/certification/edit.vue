<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="机构名字" prop="organization_name">
              <el-input v-model="form.organization_name"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="real_name">
              <el-input v-model="form.real_name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="机构地址" prop="organization_location">
              <el-input v-model="form.organization_location"></el-input>
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
    const phoneValidator = (rule, value, callback) => {
      console.log(value)
      if (value && !/^1\d{10}$/g.test(value)) {
        callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }
    return {
      id: this.$route.params.id,
      apiPath: '/api/admin/user/',
      form: {
        organization_name: '',
        real_name: '',
        phone: '',
        organization_location: '',
        is_white_list: true
      },
      rules: {
        organization_name: [
          {required: true, message: `请输入机构名字`, trigger: 'blur'}
        ],
        real_name: [
          {required: true, message: `请输入姓名`, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: `请输入手机号`, trigger: 'blur'},
          {validator: phoneValidator, trigger: 'blur'}
        ],
        organization_location: [
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
      this.form = result
    },
    async onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('submit!')
          await this.$axios({
            method: 'post',
            url: `${this.apiPath}${this.id}/update_white_list/`,
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
