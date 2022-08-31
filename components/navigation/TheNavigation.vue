<template v-if="isAuthenticated">
    <div id="the-navigation">
        <template v-if="simpleNavOn">
            <div class="navi-logo shrink" @click="clickLogo">
                <img src="~/assets/image/dashboard/building-estate-home-house-property-real-svgrepo-com.svg" />
            </div>
        </template>
        <template v-else>
            <div class="navi-logo" @click="clickLogo">
                <img src="~/assets/image/dashboard/building-estate-home-house-property-real-svgrepo-com.svg" />
            </div>
        </template>
        <span>네비게이션 리스트 있어야 하는 곳</span>
        <div v-if="$nuxt.context.isDev" class="navi-shrink-button">
            <v-checkbox v-model="simpleNavOn" dense hide-details></v-checkbox>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            naviHover: false,
            simpleNavOn: false,
            menus: [],
        }
    },
    watch: {
        simpleNavOn(value) {
            this.$root.$emit('shrinkNavigation', value)
            this.$root.$emit('shrinkContentHeader', value)
        },
    },
    created() {
        // menu 실시간 refresh를 위한 전역 메소드
        this.$root.$on('refreshTheNavigation', () => this.getMenus())
        this.$root.$on('activeMenu', (path) => this.activeMenu(path))
    },
    beforeDestroy() {
        this.$root.$off('refreshTheNavigation')
        this.$root.$off('activeMenu')
    },
    mounted() {
        this.getMenus()
    },
    methods: {
        clickLogo() {
            this.getMenus()
            this.$store.commit('setNaviMenu', {
                menuNm: '메인화면',
                depthArray: ['메인화면'],
            })
            this.$router.push('/')
        },
        async getMenus() {
            try {
                this.menus = await this.$axios.$get('/lunar/admin/setting/menus/tree')
                this.createMenuDepth()
                this.activeMenu()
            } catch (_error) {
                // menu로 권한 확인을 하기 때문에 catch
                this.$auth.logoutException = _error.response.data
                this.$auth.logout('local')
            }
        },
        createMenuDepth() {
            this.menus.forEach((parentMenu) => {
                for (let j = 0; j < parentMenu.children.length; j++) {
                    const childMenu = parentMenu.children[j]

                    const arr = [parentMenu.menuNm, childMenu.menuNm]
                    childMenu.depthArray = arr
                }
            })
        },
        activeMenu(_path) {
            const path = _path || this.$route.path
            if (!path) return

            const menus = this.menus

            for (let i = 0; i < menus.length; i++) {
                const parentMenu = menus[i]
                parentMenu.active = false

                if (path.indexOf(parentMenu.pageUrl) === 0) {
                    parentMenu.active = true
                }

                for (let j = 0; j < parentMenu.children.length; j++) {
                    const childMenu = parentMenu.children[j]
                    childMenu.active = false

                    if (path.includes(childMenu.pageUrl)) {
                        const tempArray = path.split('/')

                        if (
                            tempArray.length >= 2 &&
                            /^[0-9]*$/.test(tempArray.length - 1)
                        ) {
                            if (path.includes('contents/answer')) {
                                tempArray.splice(tempArray.length - 1, 1)
                                tempArray.splice(tempArray.length - 1, 1)
                            } else {
                                tempArray.splice(tempArray.length - 1, 1)
                            }
                        }

                        if (
                            childMenu.pageUrl === path ||
                            childMenu.pageUrl === tempArray.join('/')
                        ) {
                            childMenu.active = true
                            this.$store.commit('setNaviMenu', childMenu)
                        }
                    }
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
#the-navigation {
    width: fit-content;
    height: 100%;
    z-index: 4;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #42454b;

    .navi-logo {
        height: 104px;
        background-color: rgb(5, 167, 196);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            transition: width 0.02s;
            width: 40%;
        }

        &.shrink {
            img {
                transition: width 0.02s;
                width: 48px;
            }
        }
    }

    .navi-shrink-button {
        position: absolute;
        bottom: 32px;
        left: 8px;
    }
}
</style>