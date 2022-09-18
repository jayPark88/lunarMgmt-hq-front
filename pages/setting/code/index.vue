<template>
  <v-container class="user__container subCon">
    <SearchCode ref="searchCode" @result="getSearchResult" />
    <v-row>
      <v-col class="search-button-box d-flex justify-end">
        <v-btn outlined class="btn_regNew" @click="addGroup">
          <v-icon left></v-icon>그룹등록
        </v-btn>
      </v-col>
    </v-row>
    <CodeHeader :headers="codeHeaders" />
    <v-row
      v-for="(groupCode, groupIndex) in groupCodeList"
      :key="groupIndex"
      class="group-list"
    >
      <v-col cols="12">
        <CodeRow
          :code="groupCode"
          :index="groupIndex"
          :headers="codeHeaders"
          @expand="expand"
          @add="addCode"
          @cancel="cancelGroupCode(groupIndex)"
          @refresh="search"
        />
      </v-col>
      <v-col
        v-if="groupCode.open"
        cols="12"
        class="code-list"
        :class="{ expand: groupCode.open }"
      >
        <draggable
          :list="groupCode.commonCodeDtos"
          tag="div"
          class="row"
          handle=".handle"
          v-bind="dragOptions"
          @start="(event) => startDragging(event, groupCode)"
          @end="stopDragging"
        >
          <v-col
            v-for="(code, codeIndex) in groupCode.commonCodeDtos"
            :key="code + codeIndex"
            cols="12"
            class="code-list__item"
          >
            <CodeRow
              :code="code"
              :index="codeIndex"
              :is-group="false"
              :headers="codeHeaders"
              @cancel="cancelCode(codeIndex, groupCode)"
              @refresh="search"
            />
          </v-col>
        </draggable>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import CodeHeader from '~/components/setting/code/CodeHeader.vue'
import CodeRow from '~/components/setting/code/CodeRow.vue'
import SearchCode from '~/components/setting/code/SearchCode.vue'
export default {
  components: { SearchCode, CodeRow, CodeHeader },
  data() {
    return {
      groupCodeList: [],

      draggingCode: {},

      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
    }
  },
  computed: {
    codeHeaders() {
      return [
        { sortable: false, text: '', cols: '1', class: 'handle' },

        {
          sortable: false,
          text: '코드',
          name: 'code',
          cols: '2',
          type: 'textField',
          identifier: true,
        },
        {
          sortable: false,
          text: '코드명',
          name: 'name',
          cols: '1',
          type: 'textField',
        },
        {
          sortable: false,
          text: '설명',
          name: 'desc',
          cols: '1',
          type: 'textField',
        },
        {
          sortable: false,
          text: '코드값1',
          name: 'codeVal1',
          cols: '1',
          type: 'textField',
        },
        {
          sortable: false,
          text: '코드값2',
          name: 'codeVal2',
          cols: '1',
          type: 'textField',
        },
        {
          sortable: false,
          text: '코드값3',
          name: 'codeVal3',
          cols: '1',
          type: 'textField',
        },
        {
          sortable: false,
          text: '사용유무',
          name: 'useYn',
          cols: '1',
          type: 'select',
          items: ['Y', 'N'],
        },
        { sortable: false, text: '등록자', name: 'createId', cols: '1' },
        {
          sortable: false,
          text: '등록일시',
          name: 'createDatetime',
          cols: '1',
        },
        { sortable: false, text: '관리', cols: '1', class: 'btn-group' },
      ]
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  methods: {
    search() {
      this.$refs.searchCode.search()
    },
    getSearchResult(data) {
      this.groupCodeList = data
    },
    startDragging({ oldIndex }, groupCode) {
      this.draggingCode = groupCode.commonCodeDtos[oldIndex]
    },
    stopDragging({ oldIndex, newIndex }) {
      // const self = this
      if (oldIndex !== newIndex) {
        this.$axios
          .$put(
            `/lunar/admin/setting/code/groups/${this.draggingCode.groupCode}/codes/sort`,
            {
              groupCode: this.draggingCode.groupCode,
              code: this.draggingCode.code,
              sortNum: newIndex + 1,
              beforeSortNum: oldIndex + 1,
            },
          )
          .then(() => {
            this.search()
          })
          .catch((error) => {
            alert(error)
            this.search()
          })
      }
    },
    expand(index) {
      this.groupCodeList[index].open = !this.groupCodeList[index].open
    },
    createGroup() {
      return {
        code: '',
        name: '',
        desc: '',
        open: false,
        sortNum: this.groupCodeList.length + 1,
        useYn: 'Y',
        commonCodeDtos: [],
        new: true,
      }
    },
    createCode(groupCode) {
      return {
        groupCode: groupCode.code,
        code: '',
        name: '',
        desc: '',
        open: false,
        sortNum: groupCode.commonCodeDtos.length + 1,
        useYn: 'Y',
        new: true,
      }
    },
    addGroup() {
      if (this.groupCodeList[0].new) {
        alert('그룹등록은 한번에 한개만 가능합니다.')
        return
      }
      this.groupCodeList.push(this.createGroup())
    },
    addCode(groupIndex) {
      const groupCode = this.groupCodeList[groupIndex]
      groupCode.commonCodeDtos.push(this.createCode(groupCode))
      groupCode.open = true
    },
    cancelCode(index, groupCode) {
      groupCode.commonCodeDtos.splice(index, 1)
    },
    cancelGroupCode(index) {
      this.groupCodeList.splice(index, 1)
    },
  },
}
</script>

<style lang="scss">
.handle {
  flex: 0 0 4.3333333333%;
  max-width: 4.3333333333%;
  cursor: pointer;
  i.mdi-chevron-down {
    font-size: 20px !important;
    color: #000;
  }
  i.mdi-arrow-all {
    font-size: 17px !important;
    color: #000;
  }
}
.group-list {
  margin: 0 !important;
  .code-list {
    .code-list__item {
      background-color: #eeeeee;
      &:first-child {
        border-top: 1px solid #e6e6e6;
      }
    }
    .ghost {
      opacity: 0.5;
      background: #c8ebfb;
    }
  }
}
</style>
