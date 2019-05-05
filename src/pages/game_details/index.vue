<template>
  <div class="game-details">
    <div class="header">
      <div class="pages">{{currentIndex}}/2</div>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide class="header-item">
          <div class="flex-sb">
            <div class="fail">
              <img class="avatar" src="../../assets/images/icon_camera.png" alt="">
              <div>BA黑凤梨</div>
              <div>失败</div>
            </div>
            <div>
              <div class="score">1:2</div>
              <div>对战已结束</div>
            </div>
            <div>
              <img class="avatar" src="../../assets/images/icon_camera.png" alt="">
              <div>BA黑凤梨</div>
              <div>失败</div>
            </div>
          </div>
          <div class="footer">
            <div>10-03 12:15</div>
            <div>上海中山公园KBT篮球运动馆</div>
          </div>
        </swiper-slide>
        <swiper-slide class="header-item">
          <div class="flex-sb">
            <div class="fail">
              <img class="avatar" src="../../assets/images/icon_camera.png" alt="">
              <div>BA黑凤梨</div>
              <div>失败</div>
            </div>
            <div>
              <div class="score">1:2</div>
              <div>对战已结束</div>
            </div>
            <div>
              <img class="avatar" src="../../assets/images/icon_camera.png" alt="">
              <div>eStar Pro</div>
              <div>胜利</div>
            </div>
          </div>
          <div class="footer">
            <div>10-03 12:15</div>
            <div>上海中山公园KBT篮球运动馆</div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="title-wrapper flex-align-center">
      <img src="../../assets/images/icon_camera.png" style="width: 20px;height: 18px;" />
      精彩瞬间
    </div>
    <div class="photo-wrapper">
      <div class="photo-item">
        <video src="http://edge.ivideo.sina.com.cn/145402883.mp4?KID=sina,viask&Expires=1557158400&ssig=aWYjbNxKBz" controls="controls"></video>
      </div>
      <div class="photo-item">
        <img @click="preview('http://hbfile.b0.upaiyun.com/img/home/banner/031537c507ec8cbb6c9e912a8694117baabcc39ca28db', true)" src="http://hbfile.b0.upaiyun.com/img/home/banner/031537c507ec8cbb6c9e912a8694117baabcc39ca28db" />
      </div>
    </div>

    <div class="title-wrapper flex-align-center">
      <img src="../../assets/images/icon_camera.png" style="width: 20px;height: 18px;" />
      精彩直播
    </div>
    <div class="live-wrapper">
      <video src="http://edge.ivideo.sina.com.cn/145402883.mp4?KID=sina,viask&Expires=1557158400&ssig=aWYjbNxKBz" controls="controls"></video>
      <div style="display:flex;justify-content:space-between;flex-direction: column">
        <div>
          <div>字母哥用扣篮制霸篮下 MVP赔率遥遥领先哈登</div>
          <div class="date">4月10日</div>
        </div>
        <div class="date">1112</div>
      </div>
    </div>

    <div class="title-wrapper flex-sb">
      <div class="flex-align-center">
        <img src="../../assets/images/icon_data.png" style="width: 22px;height: 21px;" />
        比赛数据
      </div>
      <div style="display:flex">
        <div class="member1 flex-align-center"><span class="point yellow"></span>BA黑凤梨</div>
        <div class="member2 flex-align-center"><span class="point blue"></span>eStar Pro</div>
      </div>
    </div>
    <div class="step-wrapper">
      <div class="step">
        <div class="time">4'16"</div>
        <div class="point yellow"></div>
        <div class="text">BA黑凤梨 打进一球，得 1 分</div>
      </div>
      <div class="step">
        <div class="time">4'16"</div>
        <div class="point blue"></div>
        <div class="text">BA黑凤梨 打进一球，得 1 分</div>
      </div>
      <div class="step">
        <div class="time">4'16"</div>
        <div class="point blue"></div>
        <div class="text">BA黑凤梨 打进一球，得 1 分</div>
      </div>
    </div>

    <div id="myChart" :style="{width: '100%', height: '300px'}"></div>

    <div v-if="dialogTableVisible" class="preview-wrapper" @click.stop="preview('', false)">
      <img :src="selectedImgUrl" alt="">
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')

export default {
  data () {
    const _this = this
    return {
      dialogTableVisible: false,
      selectedImgUrlg: '',
      currentIndex: 1,
      swiperOption: {
        on: {
          slideChangeTransitionEnd: function () {
            console.log(this.activeIndex)

            _this.currentIndex = this.activeIndex + 1
            _this.changeSlider()
            // _this.$emit('update:showIndex', this.activeIndex)
            // if (this.activeIndex === 0 || this.activeIndex === _this.dataList.length - 1) {
            //   _this.pointClass = 'smallcursor'
            // }
          },
        },
      }
    }
  },

  components: {
    swiper,
    swiperSlide
  },

  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },

  mounted () {
    this.drawLine()
  },

  methods: {
    // TODO: 多局比赛切换数据
    changeSlider () {
      console.log('changeSlider')
    },

    preview (item, ifShow) {
      console.log(item, ifShow)
      if (ifShow) {
        this.selectedImgUrl = item
        this.dialogTableVisible = true
        document.body.style.overflow = 'hidden'
      } else {
        this.selectedImgUrl = ''
        this.dialogTableVisible = false
        document.body.style.overflow = ''
      }
    },

    drawLine () {
      let myChart = echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        color: ['#7792EB', '#FF9C03'],
        grid: {
          left: '10px',
          right: '30px',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLabel: {
            color: '#C3C2E2',
          },
          axisLine: {
            lineStyle: {
              color: '#C3C2E2'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f8fc'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#C3C2E2',
          },
          axisLine: {
            lineStyle: {
              color: '#C3C2E2'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f9f8fc'
            }
          }
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [12, 13, 10, 13, 9, 23, 21]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [22, 18, 19, 23, 29, 33, 31]
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.preview-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: #000;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    max-width: 80%;
    max-height: 80%;
  }
}
.header {
  position: relative;
  background: #ccc;
  color: #fff;
  text-align: center;
  .pages {
    position: absolute;
    right: 17px;
    bottom: 6px;
  }
  .header-item {
    padding: 20px 52px 6px;
    box-sizing: border-box;
  }
  .score {
    font-size: 28px;
  }
  .fail {
    color: #A7ADAF;
  }
  .footer {
    font-size: 12px;
    color: #979797;
  }
}
.avatar {
  width: 40px;
  height: 40px;
  border: 1px solid #fff;
  border-radius: 50%;
  overflow: hidden;
}
.game-details {
  width: 375px;
  font-size: 14px;
}
.photo-wrapper {
  display: flex;
  overflow-x: auto;
}
.photo-item {
  margin-right: 8px;
  img, video {
    width: 120px;
    height: 80px;
  }
}
.title-wrapper {
  margin: 24px 0 16px;
  font-family:PingFangSC-Medium;
  img {
    margin-right: 10px;
  }
}
.member1, .member2 {
  font-size: 10px;
  color: #C3C2E2;
}
.member2 {
  margin-left: 20px;
}
.point{
  position: relative;
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 6px;
  border-radius: 50%;
}
.point.yellow {
  background: #FF9C03;
}
.point.blue {
  background: #7792EB;
}
.step .point {
  margin-right: 15px;
}
.step .point::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 2px;
  display: inline-block;
  width: 1px;
  height: 30px;
  background: #C3C2E2;
}
.step:last-child .point::after {
  height: 8px;
}

.step {
  display: flex;
  align-items: center;
  .time {
    position: relative;
    margin-right: 8px;
    color: #C3C2E2;
    font-size: 10px;
  }
  .text {
    font-size: 12px;
    line-height: 30px;
  }
}

.live-wrapper {
  display: flex;
  video {
    margin-right: 16px;
    width: 120px;
    height: 80px;
  }
  .date {
    font-size: 12px;
    color: #BABABA;
  }
}
</style>
