<template>
    <v-container class="subCon">
        <v-row class="etc-row">
            <v-col cols="6" class="v-cardList">
                <v-card tile>
                    <v-card-title>
                        <v-row class="cardList">
                            <v-col cols class="cardSearch">
                                <v-text-field
                                    v-model="searchText"
                                    single-line
                                    dense
                                    hide-details="auto"
                                    outlined
                                ></v-text-field>
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
                            </v-col>
                        </v-row>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                searchText: '',
                authorities: [],
                selectedAuth: {},
            }
        },

        created(){
            this.init()
        },

        methods: {
            init() {
                this.searchText = ''
                this.search()
            }, 
            search() {
                this.$axios
                    .$get('/lunar/admin/setting/auth/list', {
                    params: { authNm: this.searchText ? this.searchText : null },
                })
                .then((data) => {
                    this.authorities = data

                    if (this.authorities.length > 0)
                        this.selectedAuth = this.authorities[0]
                    else this.selectedAuth = {}
                })
            },
        }
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
    