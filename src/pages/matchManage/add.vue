<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="赛事时间" prop="created_at">
              <el-date-picker v-model="form.created_at" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="赛事名称" prop="match_name">
              <el-input v-model="form.match_name"></el-input>
            </el-form-item>
            <el-form-item label="赛事结果" prop="staff_id">
              <el-input v-model="form.staff_id"></el-input>
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
      apiPath: '/api/match',
      form: {
        created_at: '',
        match_name: '',
        staff_id: '',
      },
      rules: {
        created_at: [
          {required: true, message: `请选择赛事时间`, trigger: 'change'}
        ],
        match_name: [
          {required: true, message: `请输入赛事名称`, trigger: 'blur'}
        ],
        staff_id: [
          {required: true, message: `请输入赛事结果`, trigger: 'blur'}
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
          this.$router.push({ path: '/matchManage' })
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
