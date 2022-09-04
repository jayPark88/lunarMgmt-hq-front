<template>
    <div class="pagination">
        <v-icon v-if="pageButtonStatus.first" class="pagination__arrow" @click="goFirst">
            mdi-chevron-double-left
        </v-icon>
        <v-icon v-if="pageButtonStatus.prev" class="pagination__arrow" @click="goPrev">
            mdi-chevron-left
        </v-icon>
        <span v-for="num in pages" :key="num" class="pagination__num" :class="{ active: num === pagination.page }"
            @click="clickPageNum(num)">
            {{ num }}
        </span>
        <v-icon v-if="pageButtonStatus.next" class="pagination__arrow" @click="goNext">
            mdi-chevron-right
        </v-icon>
        <v-icon v-if="pageButtonStatus.last" class="pagination__arrow" @click="goLast">
            mdi-chevron-double-right
        </v-icon>
        <div class="current-page-info">
            <span class="current-page-info__page">{{ pagination.page }}</span> /
            {{ pagination.totalPages }}
        </div>
    </div>
</template>
  
  <script>
  export default {
    props: {
      tableItems: {
        type: Array,
        default: () => [],
      },
      pagination: {
        type: Object,
        default: () => {},
      },
      click: {
        type: Function,
        default: () => {},
      },
      selectItems: {
        type: Array,
        default: () => [5, 10, 20, 50],
      },
    },
    data() {
      return {
        curIndex: 0,
        pages: [],
        pageNumCount: 10,
  
        pageNumCounts: [],
        pageNumList: [],
  
        pageButtonStatus: this.initPageButtonsStatus(),
  
        copiedPagination: this.pagination,
      }
    },
    watch: {
      tableItems() {
        Object.assign(this.copiedPagination, this.pagination)
        this.init()
      },
    },
    methods: {
      init() {
        this.initPageButtonsStatus()
  
        // 페이지네이션 index
        let pageNumIndex = parseInt(this.pagination.page / this.pageNumCount)
        if (this.pagination.page % this.pageNumCount === 0) {
          pageNumIndex--
        }
  
        // 페이지 몇개를 보여줘야하는지
        let pages = this.pageNumCount
        if ((pageNumIndex + 1) * this.pageNumCount > this.pagination.totalPages) {
          // if문을 탔다는건 마지막 페이지네이션 index 라는 뜻
          pages = this.pagination.totalPages % this.pageNumCount
  
          this.pageButtonStatus.next = false
          this.pageButtonStatus.last = false
        }
  
        if (pageNumIndex <= 0) {
          this.pageButtonStatus.prev = false
          this.pageButtonStatus.first = false
        }
  
        this.curIndex = pageNumIndex
        this.pages = Array.from(
          { length: pages },
          (v, i) => pageNumIndex * this.pageNumCount + i + 1,
        )
      },
      initPageButtonsStatus() {
        return (this.pageButtonStatus = {
          first: true,
          prev: true,
          next: true,
          last: true,
        })
      },
      clickPageNum(num) {
        if (this.copiedPagination.page === num) return
        this.copiedPagination.page = num
        this.input()
      },
      goPrev() {
        this.copiedPagination.page = this.goPage(-1)
        this.input()
      },
      goNext() {
        this.copiedPagination.page = this.goPage(+1)
        this.input()
      },
      goFirst() {
        this.copiedPagination.page = 1
        this.input()
      },
      goPage(operation) {
        let addPagePageNumCount =
          this.pagination.page + this.pageNumCount * operation
  
        if (this.pagination.page % this.pageNumCount === 0)
          addPagePageNumCount -= 1
  
        return (
          parseInt(addPagePageNumCount / this.pageNumCount) * this.pageNumCount +
          1
        )
      },
      goLast() {
        this.copiedPagination.page = this.pagination.totalPages
        this.input()
      },
      input() {
        this.$emit('update:pagination', this.copiedPagination)
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .pagination {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-bottom: 16px;
      font-size: 1.4rem;
  
      .pagination__num,
      .pagination__arrow {
          display: flex;
          align-items: center;
          justify-content: center;
  
          width: 32px;
          height: 32px;
  
          cursor: pointer;
  
          &::after {
              display: none;
          }
      }
  
      .pagination__num {
          margin: 0 4px;
  
          &:hover,
          &.active {
              text-decoration: underline;
              font-weight: bold;
          }
  
          &:hover {
              color: black;
          }
  
          &.active {
              color: rgb(21, 139, 217);
          }
      }
  
      .pagination__arrow {
          border: 1px solid #eaeaea;
          margin-left: 8px;
      }
  
      .current-page-info {
          position: absolute;
          right: 0;
          margin-right: 10px;
  
          .current-page-info__page {
              font-weight: 700;
          }
      }
  }
  </style>
  