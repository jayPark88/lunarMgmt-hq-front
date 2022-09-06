<template>
  <v-container>
    <v-row class="setting-top">
      <v-col class="mandatory">권한에 속한 사용자</v-col>
      <v-col class="d-flex justify-end">
        <v-btn color="grey darken-3" dark @click.stop="onUserSerachDialog">
          사용자 추가
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="check-table-style">
        <v-data-table v-model="selectedAuthUserList" :headers="authUserheader" :items="authUserList"
          item-key="adminUserId" show-select hide-default-footer disable-pagination class="userList">
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end pr-0 pb-0 pl-0">
        <v-btn color="blue-grey" dark @click="deleteUserAuth()">
          사용자 삭제
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent>
      <div class="popup-style">
        <v-card class="user-list__vcard">
          <v-card-title> 사용자 추가 </v-card-title>
          <v-card-text>
            <SearchUser ref="searchUserRef" :pagination="pagination" is-popup @setData="setUserList"
              @close="dialog = false" />
            <v-row>
              <v-col class="search-button-box d-flex justify-end">
                <v-btn width="80px" color="primary mb-1" @click="push">
                  등록
                </v-btn>
              </v-col>
            </v-row>
            <div class="data-table-style">
              <v-data-table v-model="selectedAuthUserList" hide-default-footer show-select item-key="userId"
                :headers="headers" :items="userList" :page.sync="pagination.page" :items-per-page="pagination.size">
              </v-data-table>
              <Pagination :pagination.sync="pagination" :table-data-length="userList.length" />
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </v-container>
</template>
  
  <script>
import Pagination from '~/components/common/Pagination.vue'
import SearchUser from '~/components/searchgrid/SearchUser.vue'

export default {
  components: { Pagination, SearchUser },
  props: {
    auth: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      deleteModalTrigger: false,
      pagination: {
        page: 1,
        size: 15,
        totalElements: 0, // 총 검색된 item 갯수
        totalPages: 0, // 총 페이지 갯수
        numberOfElements: 0, // 현재 화면에 표시될 row 갯수
      },
      authUserheader: [
        {
          text: '이름',
          align: 'start',
          sortable: false,
          value: 'adminUserNm',
        },
        {
          text: '아이디',
          align: 'false',
          value: 'adminUserId',
          sortable: false,
        },
        {
          text: '담당업무',
          align: 'false',
          sortable: false,
          value: 'position',
        },
      ],
      userList: [],
      authUserList: [],
      selectedAuthUserList: [],
      dialog: false,
    }
  },
  async fetch() {
    this.initData()
    if (this.auth.authSeq) {
      this.authUserList = await this.$axios.$get(
        `/lunar/admin/setting/auth/users/${this.auth.authSeq}`,
      )
    }
  },
  computed: {
    headers() {
      return [
        { sortable: false, text: '번호', value: 'number' },
        { sortable: false, text: '이름', value: 'adminUserNm' },
        { sortable: false, text: 'ID', value: 'adminUserId' },
        { sortable: false, text: '권한', value: 'authNm' },
        { sortable: false, text: '가입일자', value: 'createDatetime' },
      ]
    },
  },
  watch: {
    auth() {
      this.$fetch()
    },
  },
  methods: {
    onUserSerachDialog() {
      if (this.$refs.searchUserRef) this.$refs.searchUserRef.init()
      this.dialog = true
    },

    createUserSeqList(userCheckedList) {
      return userCheckedList.map((user) => user.adminUserSeq)
    },
    push() {
      const userSeqList = this.createUserSeqList(this.selectedAuthUserList)
      this.$axios
        .post(`/lunar/admin/setting/auth/users/${this.auth.authSeq}`, userSeqList)
        .then(() => {
          this.$fetch()
          this.dialog = false
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },

    deleteUserAuth() {
      const userSeqList = this.createUserSeqList(this.selectedAuthUserList)
      this.$axios
        .delete(`/lunar/admin/setting/auth/users/${this.auth.authSeq}`, { data: userSeqList })
        .then(() => {
          this.$fetch()
        })
        .catch((error) => {
          alert(error.response.data.message)
        })
    },
    setUserList(data) {
      this.userList = data.contents
      this.pagination = Object.assign(this.pagination, data.pageInfo)
    },
    initData() {
      this.selectedAuthUserList = []
    },
    boolToString(b) {
      return b ? '사용' : '미사용'
    },
  },
}
</script>
  
  <style lang="scss" scoped>
  .user-list__vcard {
    padding: 4%;
  }
  
  .check-table-style {
    padding: 0;
  }
  </style>
  