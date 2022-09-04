<template>
    <div class="search__container">
        <v-row v-if="isPopup" class="dialog-close">
            <v-icon class="user-dialog-close__icon" @click="closeDialog">
                mdi-close
            </v-icon>
        </v-row>
        <!-- search conditions -->
        <v-row class="search-row">
            <v-col cols="1" class="search-title">통합검색</v-col>
            <v-col cols="2" class="search-col">
                <v-text-field v-model.trim="searchData.searchWord" single-line outlined dense hide-details="auto"
                    @keyup.enter="search(1)" />
            </v-col>
        </v-row>
        <v-row class="search-row">
            <v-col class="search-btn-box">
                <button @click="search(1)">검색</button>
                <button @click="init">전체목록</button>
            </v-col>
        </v-row>
    </div>
</template>

<script>
   export default {
    props: {
        pagination: {
            type: Object,
            default: () => {},
        },
        isPopup: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            pageInfo: this.pagination,
            searchData: this.initSearchData(),
        }
    },

    mounted() {
      this.$nextTick(() => {
        this.search()
      })
    },

    methods: {
        initSearchData() {
         return (this.searchData = {
          searchWord: '',          
         })
        },

        init() {
            alert('tt')
          this.initSearchData()
          this.search(1)
        },

        prepareSearching(page) {
            const searchObject = {}
            Object.assign(searchObject, this.searchData)
            Object.assign(searchObject, {
             page: page || this.pagination.page,
             size: this.pagination.size,
            })  
            // 이름 아이디 검색
            if (this.searchData.searchWord) {
                searchObject.userNm = this.searchData.searchWord
                searchObject.userId = this.searchData.searchWord
            }
            return searchObject
        },
        
        search(page) {
            const searchObject = this.prepareSearching(page)
            // localStorage에 조회 값 저장
            this.$setStorageItem(this.$route.name, searchObject)
            this.$axios
                .get('/lunar/admin/system/user/list', {
                  params: searchObject,
                })
                .then((response) => {
                  const data = response.data
                    data.contents = this.$addNumberInTableData(
                    data.contents,
                    data.pageInfo,
                )
                if (data.contents.length > 0) {
                    data.contents.forEach((user) => {
                    const modifyDatetime = user.modifyDatetime
                    if (modifyDatetime)
                        user.modifyDatetime =
                        this.$dayjs(modifyDatetime).format('YYYY-MM-DD')
                    })
                }
                this.$emit('setData', data)
                })
        },
        closeDialog() {
            this.$emit('close')
        },
    },
   }
</script>