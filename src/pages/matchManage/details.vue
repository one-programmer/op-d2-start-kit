<template>
  <d2-container>
    <el-card>
      <iframe ref="iframe" :src="src"></iframe>
      <el-upload
        class="upload-wrapper"
        action="//up.qbox.me/"
        accept="image/jpg,image/png,image/gif,video/mp4,video/x-flv,video/x-ms-wmv,video/avi"
        :data="video_urlData"
        :before-upload="video_urlBeforeFileUpload"
        :file-list="video_urlFileList"
        :on-remove="video_urlFileListRemove"
        :on-success="video_urlUploadFile">
        <el-button class="btn" type="primary">精彩瞬间<i class="el-icon-plus"></i></el-button>
      </el-upload>
      <el-button class="btn-save" type="primary" @click="formatData">保存</el-button>
    </el-card>
  </d2-container>
</template>

<script>
import db from '../../plugin/db'
import config from '../../config'
export default {
  data () {
    return {
      id: this.$route.params.id,
      roundId: null,
      src: '',
      video_urlFileList: [],
      video_urlData: {}
    }
  },

  created () {
    const token = db.get('token').value()
    this.src = `${config.WEB_URL}/game_details?gameId=${this.id}&token=${token}`
  },

  mounted () {
    window.addEventListener('message', (e) => {
      console.log('message', e.data)
      this.roundId = e.data
    })
  },

  methods: {
    async video_urlBeforeFileUpload (file) {
      const result = await this.$axios({
        method: 'post',
        url: '/api/qiniu/token/',
        data: { name: file.name }
      })
      this.video_urlData = result
    },

    // 上传七牛视频
    video_urlUploadFile (response, file, fileList) {
      this.video_urlFileList = [{url: this.video_urlData.url + response.key, name: file.name}]
      console.log(this.video_urlFileList, 'video_urlUploadFile')
    },

    video_urlFileListRemove () {
      this.video_urlFileList = []
    },

    /**
     * material_type : 1: 视频 2: 图片
     * time: 视频时长 单位： 秒
     * cover_url: 视频封面
     * url: 材料地址
    */
    formatData () {
      let data = {}
      data.url = this.video_urlFileList[0].url

      const videoReg = /(.flv|.mp4|.avi|.wmv)$/
      const imageReg = /(.jpg|.jpeg|.png|.gif)$/
      if (videoReg.test(this.video_urlFileList[0].name)) {
        data.material_type = 1
        data.cover_url = `${data.url}?vframe/jpg/offset/1/w/300/h/300`
        let video = new Audio(data.url)
        video.addEventListener('loadedmetadata', (event) => {
          data.time = parseInt(video.duration)
          this.handleSave(data)
        })
      } else if (imageReg.test(this.video_urlFileList[0].name)) {
        data.material_type = 2
        this.handleSave(data)
      }
    },

    async handleSave (data) {
      await this.$axios({
        method: 'post',
        url: `/api/admin/round/${this.roundId}/create_material/`,
        data
      })
      this.video_urlFileList = []
      this.$refs.iframe.src = this.src
    }
  }
}
</script>

<style lang="scss" scoped>
iframe {
  border: none;
  width: 375px;
  height: 667px;
}
.upload-wrapper {
  display: inline-block;
  vertical-align: top;
  margin-left: 100px;
}
.btn-save {
  margin-left: 100px;
  vertical-align: top;
}
</style>
