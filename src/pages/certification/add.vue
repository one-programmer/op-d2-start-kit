<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="机构名字" prop="institution_name">
              <el-input v-model="form.institution_name"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="机构地址" prop="institution_address">
              <el-input v-model="form.institution_address"></el-input>
            </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
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
      apiPath: '/api/certification',
      form: {
        institution_name: '',
        name: '',
        phone: '',
        institution_address: '',
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
        institution_address: [
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
    },
    async onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('submit!')
          await this.$axios({
            method: 'post',
            url: `${this.apiPath}`,
            data: this.form
          })
          this.$notify({
            title: '成功',
            message: `添加成功`,
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    display: block;
  }
</style>
