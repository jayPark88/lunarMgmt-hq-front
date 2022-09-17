<template>
    <v-container class="menuCon">
      <v-row class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">메뉴명</v-col>
        <v-col colos="9">{{ menu.menuNm }}</v-col>
      </v-row>
      <v-row v-if="isNotTopMenu()" class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">페이지 URL</v-col>
        <v-col colos="9">{{ menu.pageUrl }}</v-col>
      </v-row>
      <v-row v-if="isNotTopMenu()" class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">사용 여부</v-col>
        <v-col colos="9">
          <v-switch
            :input-value="menu.useYn === 'Y'"
            :label="boolToString(menu.useYn)"
            color="primary"
            disabled
            hide-details
          ></v-switch>
        </v-col>
      </v-row>
      <v-row v-if="menu.menuLevel == 1" class="reg-row">
        <v-col cols="3" class="reg-formTitle">아이콘 변경</v-col>
        <v-col>
          <div>
            <v-btn outlined class="btn_img" @click="clickMenuOnIconFileRef">
              <v-icon left></v-icon>
              ON 이미지
            </v-btn>
            <v-btn outlined class="btn_img ml-1" @click="clickMenuOffIconFileRef">
              <v-icon left></v-icon>
              off 이미지
            </v-btn>
          </div>
          <div>
            <v-file-input
              v-show="false"
              ref="menuOnIconFileRef"
              v-model="menuOnIconFile"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              @change="changeOnIcon"
            >
            </v-file-input>
            <v-file-input
              v-show="false"
              ref="menuOffIconFileRef"
              v-model="menuOffIconFile"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              @change="changeOffIcon"
            >
            </v-file-input>
          </div>
          <div class="mt-1 col_txt1">
            ※ 업로드 가능한 파일형식은 png, jpg, gif, svg로 제한됩니다.
          </div>
        </v-col>
      </v-row>
      <v-row v-if="isNotTopMenu()" class="reg-row">
        <v-col cols="3" class="reg-formTitle">설명</v-col>
        <v-col colos="9">
          <template v-for="(s, index) in cDescription">
            {{ s }}
            <br :key="index" />
          </template>
        </v-col>
      </v-row>
      <Creator v-if="isNotTopMenu()" :value="menu" />
      <Modifier v-if="isNotTopMenu()" :value="menu" />
      <v-row v-if="isNotTopMenu()">
        <v-col class="d-flex justify-end">
          <v-btn color="primary" @click="edit"> 수정 </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script>
    import Creator from '~/components/common/Creator.vue'
    import Modifier from '~/components/common/Modifier.vue'
    export default {
      components: { Creator, Modifier },
      props: {
        menu: {
          type: Object,
          default: () => {},
        },
      },
      data() {
        return {
          menuOnIconFile: {},
          menuOffIconFile: {},
    
          acceptFileTypeList: [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/gif',
            'image/svg+xml',
          ],
        }
      },
      async fetch() {},
      computed: {
        cDescription() {
          return this.menu.menuDesc && this.menu.menuDesc.split('\n')
        },
      },
      methods: {
        edit() {
          this.$emit('change-to')
        },
        boolToString(b) {
          return b ? '사용' : '미사용'
        },
        isNotTopMenu() {
          return this.menu.menuSeq
        },
        clickMenuOnIconFileRef() {
          this.$refs.menuOnIconFileRef.$refs.input.click()
        },
        clickMenuOffIconFileRef() {
          this.$refs.menuOffIconFileRef.$refs.input.click()
        },
        clearFiles() {
          this.menuOnIconFile = null
          this.menuOffIconFile = null
        },
        getMenuIconFile(onOff) {
          if (onOff === 'on') return this.menuOnIconFile
          else if (onOff === 'off') return this.menuOffIconFile
        },
        uploadImage(onOff) {
          const menuIconFile = this.getMenuIconFile(onOff)
    
          if (menuIconFile && menuIconFile.name) {
            if (!this.acceptFileTypeList.includes(menuIconFile.type)) {
              alert('업로드 가능한 파일형식은 png, jpg, gif, svg로 제한됩니다.')
              return
            }
    
            const form = new FormData()
            form.append('file', menuIconFile)
            this.$axios
              .$put(
                `/lunar/admin/setting/menus/${this.menu.menuSeq}/image/${onOff}`,
                form,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              )
              .then((res) => {
                this.clearFiles()
                this.$emit('refresh')
                alert('아이콘 변경 완료')
              })
              .catch((err) => {
                this.clearFiles()
                alert(err.response.data.message)
              })
          }
        },
        changeOnIcon() {
          this.uploadImage('on')
        },
        changeOffIcon() {
          this.uploadImage('off')
        },
      },
    }
    </script>