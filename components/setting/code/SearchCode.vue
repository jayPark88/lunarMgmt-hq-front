<template>
  <div class="search__container">
    <!-- search conditions algo-->
    <v-row class="search-row">
      <v-col cols="1" class="search-title">검색어</v-col> 
      <v-col cols="2" class="search-col">
        <v-select
          v-model="searchData.searchWordTypeCode"
          :items="selectBoxData.searchWordItems"
          item-text="codeName"
          item-value="code"
          dense
          outlined
          hide-details="auto"
        />
      </v-col>
      <v-col cols="9" class="search-col pl-0">
        <v-text-field
          v-model.trim="searchData.searchWord"
          single-line
          outlined
          dense
          hide-details="auto"
          @keyup.enter="search()"
        />
      </v-col>
    </v-row>
    <v-row class="search-row">
      <v-col cols="1" class="search-title">기간</v-col>
      <v-col cols="2" class="search-col">
        <v-select
          v-model="searchData.dateTypeCode"
          :items="selectBoxData.dateTypeItems"
          single-line
          item-value="code"
          item-text="codeName"
          dense
          outlined
          hide-details="auto"
        />
      </v-col>
      <v-col cols="4" class="search-col pl-0">
        <DatePickerTextfield v-model="searchData.startDate" label="부터" />
        <span class="pl-1 pr-1">~</span>
        <DatePickerTextfield v-model="searchData.endDate" label="까지" />
      </v-col>
    </v-row>
    <v-row class="search-row">
      <v-col cols="1" class="search-title"> 사용유무 </v-col>
      <v-col cols="2" class="search-col">
        <v-select
          v-model="searchData.useYn"
          :items="selectBoxData.useYnItems"
          single-line
          item-text="codeName"
          item-value="code"
          dense
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>
    <v-row class="search-row">
      <div class="search-btn-box">
        <v-btn @click="search()">검색</v-btn>
        <v-btn @click="init">전체목록</v-btn>
      </div>
    </v-row>
    <!-- search conditions ends -->
  </div>
</template>

<script>
import DatePickerTextfield from '~/components/common/DatePickerTextfield.vue'
export default {
  components: { DatePickerTextfield },
  data() {
    return {
      searchData: this.initSearchData(),
      selectBoxData: {
        searchWordItems: [
          { codeName: '그룹코드', code: 'grpCd' },
          { codeName: '그룹코드명', code: 'grpCdNm' },
          { codeName: '공통코드', code: 'cd' },
          { codeName: '공통코드명', code: 'cdNm' },
        ],
        useYnItems: [
          { codeName: '전체', code: 'ALL' },
          { codeName: 'N', code: 'N' },
          { codeName: 'Y', code: 'Y' },
        ],
        dateTypeItems: [
          { codeName: '가입일', code: 'CreateDate' }, // 앞에 start, end 붙이기 위해 미리 첫글자 대문자
          { codeName: '수정일', code: 'ModifyDate' },
        ],
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.search()
    })
  },
  methods: {
    initSearchData() {
      return {
        searchWordTypeCode: 'grpCd',
        searchWord: '',

        useYn: 'ALL',

        dateTypeCode: 'CreateDate',
        startDate: '',
        endDate: '',
      }
    },
    init() {
      this.searchData = this.initSearchData()
      this.search()
    },
    createSearchDto(searchData) {
      const searchDto = {}
      searchDto[searchData.searchWordTypeCode] = searchData.searchWord
        ? searchData.searchWord
        : null
      searchDto[`start${searchData.dateTypeCode}`] = searchData.startDate
        ? searchData.startDate
        : null
      searchDto[`end${searchData.dateTypeCode}`] = searchData.endDate
        ? searchData.endDate
        : null
      searchDto.useYn =
        this.searchData.useYn === 'ALL' ? null : searchData.useYn

      return searchDto
    },
    async search() {
      await this.$axios
        .$get('/lunar/admin/setting/code/groups', {
          params: this.createSearchDto(this.searchData),
        })
        .then((data) => {
          this.$emit('result', data)
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
}
</style>
