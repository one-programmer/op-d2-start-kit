<template>
  <d2-container>
    <el-card>
      <iframe :src="src"></iframe>
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
      src: ''
    }
  },

  created () {
    const token = db.get('token').value()
    this.src = `${config.WEB_URL}/game_details?gameId=${this.id}&token=${token}`
  }
}
</script>

<style lang="scss" scoped>
iframe {
  border: none;
  width: 375px;
  height: 667px;
}
</style>
