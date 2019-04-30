<template>
  <div class="game-details">
    <div class="header">
      <div>
        <div>
          <img src="" alt="">
          <div></div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="title-wrapper flex-align-center">
      <img src="../../assets/images/icon_camera.png" style="width: 40px;height: 36px;" />
      精彩瞬间
    </div>
    <div class="photo-wrapper">
      <div class="photo-item">
        <video src="https://valipl.cp31.ott.cibntv.net/6773B1605153D718BD17C4406/03000801005CB68B730EAB1003E880EFF899B5-18AD-4FE1-9C88-E69C4E5C59F4.mp4?ccode=0502&duration=1000&expire=18000&psid=cf2b44a9008c25e1dfbfc59b084c8c9a&ups_client_netip=72fc5dad&ups_ts=1556420972&ups_userid=&utid=91AiFSoVFFICAQF3KZ5Qt%2FcM&vid=XMTI2MDk4MTA5Ng%3D%3D&vkey=A99249af3d4e67a58a8f9fbe46e39f9ea"></video>
      </div>
      <div class="photo-item">
        <img bindtap="prewiew" mode="aspectFill" src="http://hbfile.b0.upaiyun.com/img/home/banner/031537c507ec8cbb6c9e912a8694117baabcc39ca28db" />
      </div>
    </div>
    <div class="title-wrapper flex-sb">
      <div class="flex-align-center">
        <img src="../../assets/images/icon_data.png" style="width: 44px;height: 42px;" />
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

  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.game-details {
  width: 750px;
  transform: scale(.5);
}
.photo-wrapper {
  display: flex;
  overflow-x: auto;
}
.photo-item {
  margin-right: 16px;
}
.photo-item img,
.photo-item video{
  width: 240px;
  height: 160px;
}

.title-wrapper {
  margin: 48px 0 32px;
  font-family:PingFangSC-Medium;
}
.title-wrapper img {
  margin-right: 20px;
}
.member1, .member2 {
  font-size: 20px;
  color: #C3C2E2;
}
.member2 {
  margin-left: 40px;
}
.point{
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 12px;
  border-radius: 50%;
}
.point.yellow {
  background: #FF9C03;
}
.point.blue {
  background: #7792EB;
}
.step .point {
  margin-right: 30px;
}
.step .point::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 4px;
  display: inline-block;
  width: 2px;
  height: 60px;
  background: #C3C2E2;
}
.step:last-child .point::after {
  height: 16px;
}

.step {
  display: flex;
  align-items: center;
}
.step .time {
  position: relative;
  margin-right: 16px;
  color: #C3C2E2;
  font-size: 20px;
}
.step .text {
  font-size: 24px;
  line-height: 60px;
}

</style>
