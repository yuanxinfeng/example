/*
 * @Description: fullScreen
 * @Author: Jasper
 * @Github: https://github.com/yuanxinfeng
 * @Date: 2019-11-08 09:55:02
 * @LastEditors: Jasper
 * @LastEditTime: 2019-11-08 09:55:24
 */
let fullscreen = false;
function toggleFullScreen() {
  let element = document.documentElement;
  let btn = document.querySelector("button");
  // 判断是否已经是全屏
  // 如果是全屏，退出
  if (fullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    // console.log('已还原！');
    btn.innerText = "全屏";
  } else {
    // 否则，进入全屏
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      // IE11
      element.msRequestFullscreen();
    }
    // console.log('已全屏！');
    btn.innerText = "退出";
  }
  fullscreen = !fullscreen;
}
