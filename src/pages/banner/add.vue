<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="appid" prop="appid">
          <el-input v-model="form.appid" placeholder="请输入appid"></el-input>
        </el-form-item>
        <el-form-item label="小程序链接" prop="app_href">
          <el-input v-model="form.app_href" placeholder="请输入小程序链接"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="image_url">
          <img class="upload-image" v-if="form.image_url" :src="form.image_url">
          <div v-else class="btns-wrapper">
            <el-upload
              action="/api/upload/?type=pic"
              :show-file-list="false"
              :on-success="urlUpload">
              <div class="btn_add">+</div>
            </el-upload>
          </div>
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
      apiPath: '/api/admin/banner',
      form: {
        appid: '',
        app_href: '',
        image_url: '',
      },
      rules: {
        appid: [
          {required: true, message: `请输入appid`, trigger: 'blur'}
        ],
        app_href: [
          {required: true, message: `请输入小程序链接`, trigger: 'blur'}
        ],
        image_url: [
          {required: true, message: `请上传封面照片`, trigger: 'change'}
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
          this.$router.push({ path: '/banner' })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    urlUpload (res, file) {
      console.log('handleUploadSuccess', res, file)
      this.form.image_url = res.results.url
      // this.form.name = res.results.name
      this.$refs.form.clearValidate([`image_url`])
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
  .btn_add {
    width: 80px;
    height: 50px;
    line-height: 50px;
    background-color: rgba(241, 241, 241, 1);
    font-size: 40px;
    color: rgba(122, 128, 140, 1)
  }
</style>
