<template>
  <header id="the-header">
    <div id="the-header-box">
      <div id="the-header__title">
        {{ menu.menuNm }}
      </div>
      <div id="the-header__user-info">
        <div id="the-header__user-info__text" class="header_txt1">
          <span>{{ getUserInfo() }}</span>
          <span>환영합니다.</span>
        </div>
        <div id="the-header__user-info__btn" @click="logout">
          <img :src="require('@/assets/image/login/HQ_logout.svg')" />
          <span>로그아웃</span>
        </div>
      </div>
    </div>
    <div id="navigation-depth">
      <div id="navigation-depth__home" @click="goHome">
        <img src="~/assets/image/dashboard/HQ_main_home.svg" />
        <span class="mt-1">홈</span>
      </div>
      <div
        v-for="(depthName, index) in menu.depthArray"
        :key="depthName + index"
        class="navigation-depth__arrow mt-1"
      >
        {{ depthName }}
      </div>
      <div
        v-if="$store.getters.getDetailPageName"
        class="navigation-depth__arrow mt-1"
      >
        {{ $store.getters.getDetailPageName }}
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      menu: {
        depthArray: [],
      },
      naviDepthText: '',
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/') {
        this.setHomeMenu()
      } else {
        this.$root.$emit('activeMenu', window.location.pathname)
      }
      // detailpageName 초기화
      this.$store.commit('setDetailPageName', '')
    },
    '$store.state.naviMenu'() {
      this.menu = this.$store.getters.getNaviMenu
    },
  },
  created() {
    if (this.$route.path === '/') this.setHomeMenu()
    this.$root.$on('shrinkContentHeader', (value) =>
      this.shrinkContentHeader(value),
    )
  },
  mounted() {
    document.documentElement.style.setProperty(
      '--var-content-header-width',
      '192px',
    )
  },
  beforeDestroy() {
    this.$root.$off('shrinkContentHeader')
  },
  methods: {
    shrinkContentHeader(value) {
      document.documentElement.style.setProperty(
        '--var-content-header-width',
        value ? '72px' : '192px',
      )
    },
    setHomeMenu() {
      this.menu = { menuNm: '메인화면', depthArray: ['메인화면'] }
    },
    goHome() {
      this.$router.push('/')
    },
    logout() {
      this.$auth.isLogouted = true
      this.$auth.logout('local')
      this.localStorage.removeItem('auth._token.local')
      this.$store.commit('setNaviMenu', {})
    },
    getUserInfo() {
      let userInfo = ''
      if (this.$auth.$state.user) {
        const siteName = this.$auth.$state.user.siteName
        const businessTypeName = this.$auth.$state.user.businessTypeName

        if (siteName && businessTypeName)
          userInfo = `${siteName}(${businessTypeName}) `

        const userNm = this.$auth.$state.user.userNm
        userInfo += `${userNm}님`
      }

      return userInfo
    },
  },
}
</script>

<style lang="scss" scoped>
:root {
  --var-content-header-width: 192px;
}
#the-header {
  width: 100%;
  height: 105px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 3;
  padding-left: var(--var-content-header-width);
  transition: padding-left 0.2s;
  background: #fff;
  min-width: 800px;

  #the-header-box {
    border-bottom: 1px solid #b8b8b8;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 28px 24px 16px;
  }

  #the-header__title {
    display: flex;
    align-items: center;
    font-weight: 800;
    font-size: 1.2rem;
    color:black;
  }

  #the-header__user-info {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;

    #the-header__user-info__text {
      display: inline-block;
      margin-right: 1.2rem;
    }

    #the-header__user-info__text > span:first-child {
      font-weight: 600;
      font-size: 600;
    }

    #the-header__user-info__btn {
      display: flex;
      color: #ffffff;
      background-color: #161515;
      padding: 4px 16px;
      border-radius: 50px;
      flex-direction: row;
      align-items: center;
      align-content: center;
    }

    img {
      width: 18px;
      height: 18px;
      margin-right: 4px;
      filter: brightness(5);
    }

    span {
      font-size: 1.0rem;
      font-weight: 800;
    }
  }

  #navigation-depth {
    height: 28px;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    align-items: center;
    font-weight: 300;
    padding-left: 24px;
    font-size: 0.8rem;

    #navigation-depth__home {
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
        font-weight: bold;
        cursor: pointer;
      }

      img {
        width: auto;
        height: 20px;
        padding-right: 16px;
        cursor: pointer;
      }
    }

    .navigation-depth__arrow {
      &::before {
        content: '>';
        font-weight: normal;
        margin: 0 5px;
      }
      &:last-child {
        font-weight: 600;
      }
    }
  }
}
</style>
