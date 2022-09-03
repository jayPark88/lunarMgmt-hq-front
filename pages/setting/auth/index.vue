<template>
  <v-container class="subCon">
    <v-row class="etc-row">
      <v-col cols="6" class="v-cardList">
        <v-card tile>
          <v-card-title>
            <v-row class="cardList">
              <v-col cols class="cardSearch">
                <v-text-field v-model="searchText" single-line dense hide-details="auto" outlined></v-text-field>
              </v-col>
              <v-col class="btn-Wrap">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn dark small v-bind="attrs" v-on="on" @click="search">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                  <span>검색</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn dark small v-bind="attrs" v-on="on" @click="init">
                      <v-icon>mdi-replay</v-icon>
                    </v-btn>
                  </template>
                  <span>새로고침</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn dark small v-bind="attrs" v-on="on" @click="addAuth">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>권한추가</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn dark small v-bind="attrs" v-on="on" @click="removeAuth">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>권한삭제</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="listWrap">
            <v-col v-for="(auth, index) in authorities" :key="index" class="auth-item"
              :class="{ active: selectedAuth == auth }" @click="clickRow(auth)">
              {{ auth.authNm }}
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" class="cardCon">
        <v-card>
          <v-card-title>
            <v-tabs :value="tabIndex" class="tab-style1" background-color="transparent" color="grey darken-2">
              <v-tab @click="changeTab(OVERVIEW)">Overview</v-tab>
              <v-tab @click="changeTab(USER)">User</v-tab>
              <v-tab @click="changeTab(MENU)">Menu</v-tab>
            </v-tabs>
          </v-card-title>
          <v-card-text class="cardTxt">
            <AuthViewer v-if="tabIndex === OVERVIEW && !editable" :auth="selectedAuth" :save-type="saveType"
              @change-to="changeToEditor" />
            <AuthEditor v-if="tabIndex === OVERVIEW && editable" :auth="selectedAuth" :save-type="saveType"
              @change-to="changeToViewer" />
            <!-- <AuthUserViewer v-if="tabIndex === USER" :auth="selectedAuth" /> -->
            <!-- <AuthMenuVierwer v-if="tabIndex === MENU" :auth="selectedAuth" /> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import AuthEditor from '~/components/setting/auth/AuthEditor.vue'
import AuthViewer from '~/components/setting/auth/AuthViewer.vue'

export default {
  // components: { AuthViewer, AuthEditor, AuthUserViewer, AuthMenuVierwer },
  components: { AuthViewer, AuthEditor },
  data() {
    return {
      OVERVIEW: 0,
      USER: 1,
      MENU: 2,

      searchText: '',

      tabIndex: 0,
      authorities: [],
      selectedAuth: {},

      editable: false,
      saveType: 'new',
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.searchText = ''
      this.search()
    },
    search() {
      this.$axios
        .$get('lunar/admin/setting/auth/list', {
          params: { authNm: this.searchText ? this.searchText : null },
        })
        .then((data) => {
          this.authorities = data

          if (this.authorities.length > 0)
            this.selectedAuth = this.authorities[0]
          else this.selectedAuth = {}
        })
    },
    changeTab(index) {
      this.tabIndex = index
      this.editable = false
    },
    clickRow(auth) {
      this.selectedAuth = auth
      this.changeToViewer()
    },
    changeToEditor() {
      this.editable = true
      this.saveType = 'edit'
    },
    changeToViewer(refresh) {
      if (refresh) {
        this.init() // 데이터 refresh가 필요한 경우만
        this.selectedAuth = {}
      }
      this.editable = false
      this.saveType = 'edit'
    },
    addAuth() {
      this.changeTab(this.OVERVIEW)

      this.selectedAuth = {}
      this.saveType = 'new'
      this.editable = true
    },
    removeAuth() {
      if (!this.selectedAuth.authSeq) {
        alert('권한를 선택해주십시오.')
        return
      }

      if (confirm('선택한 권한을 삭제하시겠습니까?')) {
        this.$axios
          .$delete('/lunar/admin/setting/auth/list' + this.selectedAuth.authSeq)
          .then(() => {
            this.changeToViewer(true)
          })
          .catch((err) => {
            alert(err.response.data.message)
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.etc-row {
  margin: 0;

  .v-card {
    box-shadow: none !important;
  }

  .v-cardList {
    border: 1px solid #d4d4d4;
    border-top: 2px solid #636363;
    padding: 0 !important;

    .cardSearch {
      max-width: calc(100% - 251px);
    }

    .btn-Wrap {
      display: inline-flex;
      flex-direction: row;
      align-content: center;
      justify-content: flex-end;
      max-width: 251px;
      padding: 12px 12px 0 0;

      button {
        height: 38px;
        box-shadow: none;
        margin-left: 9px;
        background: #3c3c3c;

        :first-child {
          margin-left: 0;
        }
      }
    }

    .listWrap {
      .auth-item {
        border-bottom: 1px solid #d5d5d5;
        font-size: 15px;

        &:hover {
          background: #fdfad6 !important;
          cursor: pointer;
        }
      }

      .active {
        background: #fdfad6;
        color: #0078aa;
        font-weight: 600;
      }
    }
  }

  .cardCon {
    padding: 0 0 0 20px;

    .v-card__title {
      padding: 0;

      .tab-style1 {
        border-left: 1px solid #b4b4b4;
        border-bottom: 2px solid #636363;

        .v-tab {
          font-weight: 400;
          color: #bababa;
          border-top: 1px solid #b4b4b4;
          border-right: 1px solid #b4b4b4;
        }

        .v-tab--active {
          font-weight: 500;
          background-color: #636363;
          color: #fff;
        }
      }
    }

    .cardTxt {
      padding: 12px 12px 0 12px;
    }
  }
}
</style>
    