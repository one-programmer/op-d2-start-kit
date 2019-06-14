<template>
  <d2-container>
    <el-card>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="appid">
          <el-select v-model="form.appid" placeholder="请选择">
            <el-option
              v-for="item in appidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小程序链接" prop="page_url">
          <el-input v-model="form.page_url" placeholder="请输入小程序链接"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="cover_url">
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
              <img v-if="form.cover_url" :src="form.cover_url" class="avatar">
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
import appidOptions from '../../assets/json/appid'
export default {
  data () {
    return {
      id: this.$route.params.id,
      type: this.$route.query.type,
      apiPath: '/api/admin/game_settings/',
      fileData: {},
      appidOptions,
      form: {
        title: '',
        appid: '',
        page_url: '',
        cover_url: '',
      },
      rules: {
        title: [
          {required: true, message: `请输入标题`, trigger: 'blur'}
        ],
        appid: [
          {required: true, message: `请选择小程序名称`, trigger: 'change'}
        ],
        cover_url: [
          {required: true, message: `请上传封面照片`, trigger: 'change'}
        ],
      },
    }
  },
  created () {
    console.log(this.id, this.type)
    if (this.type === 'edit') {
      this.initForm()
    }
  },
  methods: {
    async initForm () {
      const result = await this.$axios({
        method: 'get',
        url: `${this.apiPath}${this.id}/`
      })
      console.log('fetch detail', this.id, result)
      this.form = result
    },
    async onSubmit () {
      let url = `${this.apiPath}${this.id}/`
      let method = 'put'
      // 创建配置
      if (this.type === 'create') {
        url = `/api/admin/basketball/${this.id}/create_game_settings/`
        method = 'post'
      }

      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('submit!')
          await this.$axios({
            method,
            url,
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
      this.form.cover_url = this.fileData.url + res.key
      this.$refs.form.clearValidate([`cover_url`])
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

</style>
