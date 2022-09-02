<template>
  <div id="navi-background">
    <div id="navi-menu" @mouseleave="showChildMenu = false">
      <ul class="navi-menu-item-box">
        <li v-for="(menu, index) in menus" :ref="`naviMenu${index}`" :key="index" class="navi-menu-item"
          :class="{ active: menu.active }" @mouseenter="enterMouseIntoParent(menu, index)">
          <div class="navi-menu-item__icon">
            <img :src=menu.offImageUrl>
          </div>
          <div v-if="!isSimpleNavOn" class="navi-menu-item__name">
            {{ menu.menuNm }}
          </div>
        </li>
      </ul>
      <ul v-show="showChildMenu" id="child-menu-box">
        <li v-for="(childMenu, index) in hoverMenu.children" :key="index" :class="{ active: childMenu.active }">
          <div @click="clickMenu(childMenu)">
            {{ childMenu.menuNm }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationMenuList',
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Boolean,
      default: false,
    },
    simpleNavOn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hoverMenu: {},
      isUnreadCallHistoryExist: false,
      childIn: false,
      showChildMenu: false,
      isSimpleNavOn: false,
    }
  },
  watch: {
    simpleNavOn(value) {
      if (value) {
        this.isSimpleNavOn = value
        return
      }
      setTimeout(() => (this.isSimpleNavOn = value), 100)
    },
  },
  created() {
    // 통화이력 뱃지 표시를 위한 전역 메소드
    this.$nuxt.$on('setUnreadCallHistoryBadge', (value) => {
      this.isUnreadCallHistoryExist = value
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('setUnreadCallHistoryBadge')
  },
  methods: {
    clickMenu(menu) {
      this.clearMenuStorage()

      // 최하위 메뉴일 경우에만 페이지 이동
      this.$store.commit('setNaviMenu', menu)
      this.$router.push(menu.pageUrl)

      this.$emit('clickMenuCallback', menu.pageUrl)
    },
    getMenuIconImage(menu) {
      if (menu.active) {
        if (menu.onImageUrl) {
          return menu.onImageUrl
        } else {
          return require('@/assets/image/undefine.svg')
        }
      } else if (menu.offImageUrl) {
        return menu.offImageUrl
      } else {
        return require('@/assets/image/undefine.svg')
      }
    },
    enterMouseIntoParent(menu, index) {
      this.showChildMenu = true

      this.hoverMenu = menu
      const el = this.$refs['naviMenu' + index][0]
      const clientRect = el.getBoundingClientRect()

      const childMenuBoxEl = document.getElementById('child-menu-box')
      const childMenuBoxHeight = menu.children.length * 30 + 50

      // 화면 half 밑으로는 메뉴의 바닥 위로 메뉴가 뜨도록
      if (window.innerHeight / 2 < el.offsetTop) {
        // Down - Top
        childMenuBoxEl.style.top =
          clientRect.top - childMenuBoxHeight + clientRect.height + 'px'
        childMenuBoxEl.style.bottom =
          window.innerHeight - clientRect.bottom + 'px'
      } else {
        // Top- Down
        childMenuBoxEl.style.top = clientRect.top - 1 + 'px'
      }

      childMenuBoxEl.style.left = clientRect.right + 'px'
      childMenuBoxEl.style.height = childMenuBoxHeight + 'px'
    },
    clearMenuStorage() {
      if (window.localStorage) {
        const originLocalStorageData = window.localStorage

        for (let index = 0; index < originLocalStorageData.length; index++) {
          if (
            !originLocalStorageData.key(index).includes('auth.') &&
            !originLocalStorageData.key(index).includes('temp.')
          ) {
            window.localStorage.removeItem(originLocalStorageData.key(index))
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#navi-background {
  height: auto;

  #navi-menu {
    .navi-menu-item-box {
      list-style: none;
      padding: 0;

      .navi-menu-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 64px;
        border-bottom: 1px solid #889095;
        color: #ffffff;
        padding: 8px;
        justify-content: center;

        &.active,
        &:hover {
          background-color: white;
          color: #05a7c4;
          cursor: pointer;
        }

        .navi-menu-item__icon {
          width: 32px;
          height: auto;
          display: flex;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .navi-menu-item__name {
          width: 68%;
          padding-left: 16px;
          font-size: 1.0rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
      }
    }

    #child-menu-box {
      list-style: none;
      position: absolute;
      z-index: 9;
      width: 192px;
      padding: 16px 24px 16px 32px;
      background-color: white;
      border: 3px solid #0094b4;
      box-shadow: 4px 4px 8px 0px rgb(0 0 0 / 20%);
      font-size: 1.0rem;
      color: #666666;
      display: flex;
      flex-direction: column;
      justify-content: center;

      li {
        min-height: 32px;
        line-height: 32px;

        &:hover {
          font-weight: bold;
          color: #333333;
          cursor: pointer;
        }

        &.active {
          font-weight: bold;
          color: #0078aa;
          border-bottom: 1px solid #0078aa;
          border-width: medium;
          height: 32px;
          width: fit-content;
        }
      }
    }
  }
}
</style>