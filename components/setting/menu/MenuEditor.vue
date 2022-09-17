<template>
  <div>
    <v-container class="menuCon">
      <v-row v-if="saveType === 'new'" class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">부모 메뉴명</v-col>
        <v-col colos="9">{{ menu.menuNm }}</v-col>
      </v-row>
      <v-row class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">메뉴명</v-col>
        <v-col colos="9">
          <v-text-field
            v-model="editableMenu.menuNm"
            single-line
            dense
            hide-details="auto"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">페이지 URL</v-col>
        <v-col colos="9">
          <v-text-field
            v-model="editableMenu.pageUrl"
            single-line
            dense
            hide-details="auto"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="reg-row">
        <v-col cols="3" class="reg-formTitle mandatory">사용 여부</v-col>
        <v-col colos="9">
          <v-switch
            v-model="editableMenu.useYn"
            :label="YNToString(editableMenu.useYn)"
            :true-value="'Y'"
            :false-value="'N'"
            hide-details
            color="primary"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row class="reg-row">
        <v-col cols="3" class="reg-formTitle">설명</v-col>
        <v-col colos="9">
          <v-textarea
            v-model="editableMenu.menuDesc"
            outlined
            hide-details="auto"
            auto-grow
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <v-row class="mt-1">
      <v-col class="d-flex justify-end">
        <v-btn color="grey darken-1" dark @click="cancel">취소</v-btn>
        <v-btn color="primary" class="ml-2" @click="save">저장</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Object,
      default: () => {},
    },
    saveType: {
      type: String,
      default: 'new',
    },
  },
  data() {
    return {
      authCodeSelect: [],
      editableMenu: {},
    }
  },
  fetch() {
    if (this.saveType === 'new') this.editableMenu = this.createEmptyGroup()
    else this.editableMenu = JSON.parse(JSON.stringify(this.menu)) // 깊은복사
  },
  watch: {
    saveType(newSaveType) {
      if (newSaveType === 'new') {
        this.$fetch()
      }
    },
  },
  methods: {
    YNToString(yn) {
      return yn === 'Y' ? '사용' : '미사용'
    },
    createEmptyGroup() {
      // 새로 Group을 추가하는 경우 선택된 데이터가 parent
      const parent = this.menu

      const parentMenuId = parent.menuSeq ? parent.menuSeq : parent.parentMenuId
      return {
        menuNm: '',
        pageUrl: '',
        menuDesc: '',
        menuLevel: parent.menuLevel + 1,
        sortNum: parent.childrenLength + 1,
        parentMenuId,
        topMenuId: parent.topMenuId,
        useYn: 'Y',
      }
    },
    save() {
      if (!this.editableMenu.menuNm) {
        alert('메뉴명을 입력해주십시오.')
        return
      }
      if (!this.editableMenu.pageUrl) {
        alert('링크 URL을 입력해주십시오.')
        return
      }

      if (this.saveType === 'new')
        this.$axios
          .$post('/lunar/admin/setting/menus', this.editableMenu)
          .then(() => this.$emit('change-to', true))
          .catch((error) => alert(error.response.data.message))
      else
        this.$axios
          .$put('/lunar/admin/setting/menus', this.editableMenu)
          .then(() => this.$emit('change-to', true))
          .catch((error) => alert(error.response.data.message))
    },
    cancel() {
      this.$emit('change-to')
    },
  },
}
</script>
