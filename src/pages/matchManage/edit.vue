<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="appid">
          <el-input v-model="form.appid" placeholder="请输入appid"></el-input>
        </el-form-item>
        <el-form-item label="小程序链接" prop="href">
          <el-input v-model="form.href" placeholder="请输入小程序链接"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="image_url">
          <div class="btns-wrapper">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :auto-upload="false"
              :data="fileData"
              action="//up.qbox.me/"
              accept="image/jpg,image/png,image/gif"
              :show-file-list="false"
              :on-change="changeImageUpload"
              :on-success="urlUpload">
              <img v-if="form.image_url" :src="form.image_url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item v-if="!this.$route.query.detail">
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
      apiPath: '/api/admin/game_settings/',
      fileData: {},
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
      const result = await this.$axios({
        method: 'get',
        url: `${this.apiPath}${this.id}/`
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
          this.$router.push({ path: '/matchManage' })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    urlUpload (res, file) {
      this.form.image_url = this.fileData.url + res.key
      this.$refs.form.clearValidate([`image_url`])
    },

    async changeImageUpload (file) {
      try {
        const result = await this.$axios({
          method: 'post',
          url: '/api/qiniu/token/',
          data: { name: file.name }
        })

        this.fileData.token = result.token
        this.fileData.key = result.key
        this.fileData.url = result.url
        this.$refs.upload.submit()
      } catch (error) {
        console.error('request token failed: ' + error)
      }
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

.btn_add {
  width: 80px;
  height: 50px;
  line-height: 50px;
  background-color: rgba(241, 241, 241, 1);
  font-size: 40px;
  color: rgba(122, 128, 140, 1)
}
</style>
