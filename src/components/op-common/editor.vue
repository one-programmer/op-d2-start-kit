<template>
  <div class="editor-wrapper">
    <vue-wangeditor :menus="menus" v-model="content" width="100%" height="700" ref="editer" isRealtime="true" id="editor" @change="getHtml" @load="imageLoad" uploadImgUrl="/api/upload/"></vue-wangeditor>
  </div>
</template>

<script>
import vueWangeditor from 'vue-wangeditor'
export default {
  components: {
    vueWangeditor,
  },

  props: {
    // 编辑器内容
    value: {
      type: String,
      default: ''
    },
  },

  data () {
    return {
      wangeditorShow: false,
      content: this.value,
      menus: [
        'source',
        '|',
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        // 'emotion',
        '|',
        'img',
        'video',
        'insertcode',
        '|',
        'undo',
        'redo',
        'fullscreen'
      ],
    }
  },

  methods: {
    imageLoad (originalName, resultText) {
      let url = JSON.parse(resultText).results.url
      this.$refs.editer.insertImg(url)
    },

    getHtml () {
      let content = this.$refs.editer.getHtml()
      if (content === '<p><br></p>') {
        content = ''
      }
      // 删除p标签自动添加的'margin-left: 22px;'行内样式
      this.$emit('input', content.replace(/margin-left: 22px;/g, ''))
    },
  }
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  & /deep/ .wangEditor-menu-container {
    height: 31px;
  }
  & /deep/ .wangEditor-container {
    height: 100%;
  }
}
</style>
