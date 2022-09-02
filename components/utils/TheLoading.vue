<template>
  <div id="loading">
    <div class="loading__container">
      <div class="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="loading-text">데이터 처리중 입니다.</div>
      <div class="loading-text">잠시만 기다려주세요.</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
#loading {
  display: none;
  background-color: #000000ad;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  top: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 999 !important;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .loading__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    padding: 32px;

    .loading-text {
      font-size: 1.2rem;
      color: #ffffff;
    }
    .loading-text:first-of-type {
      padding-bottom: 4px;
    }

    .loading-spinner {
      color: official;
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .loading-spinner div {
      transform-origin: 40px 40px;
      animation: loading-spinner 1.2s linear infinite;
    }
    .loading-spinner div:after {
      content: ' ';
      display: block;
      position: absolute;
      top: 3px;
      left: 37px;
      width: 6px;
      height: 18px;
      border-radius: 20%;
      background: #fff;
    }
    .loading-spinner div:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -1.1s;
    }
    .loading-spinner div:nth-child(2) {
      transform: rotate(30deg);
      animation-delay: -1s;
    }
    .loading-spinner div:nth-child(3) {
      transform: rotate(60deg);
      animation-delay: -0.9s;
    }
    .loading-spinner div:nth-child(4) {
      transform: rotate(90deg);
      animation-delay: -0.8s;
    }
    .loading-spinner div:nth-child(5) {
      transform: rotate(120deg);
      animation-delay: -0.7s;
    }
    .loading-spinner div:nth-child(6) {
      transform: rotate(150deg);
      animation-delay: -0.6s;
    }
    .loading-spinner div:nth-child(7) {
      transform: rotate(180deg);
      animation-delay: -0.5s;
    }
    .loading-spinner div:nth-child(8) {
      transform: rotate(210deg);
      animation-delay: -0.4s;
    }
    .loading-spinner div:nth-child(9) {
      transform: rotate(240deg);
      animation-delay: -0.3s;
    }
    .loading-spinner div:nth-child(10) {
      transform: rotate(270deg);
      animation-delay: -0.2s;
    }
    .loading-spinner div:nth-child(11) {
      transform: rotate(300deg);
      animation-delay: -0.1s;
    }
    .loading-spinner div:nth-child(12) {
      transform: rotate(330deg);
      animation-delay: 0s;
    }
    @keyframes loading-spinner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
}
#loading.loading-transition {
  display: flex;
}
</style>
