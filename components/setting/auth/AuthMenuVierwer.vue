<template>
    <v-container>
      <v-row class="setting-top">
        <v-col class="mandatory">권한에 속한 메뉴</v-col>
      </v-row>
      <v-row class="menuWrap">
        <v-col>
          <sl-vue-tree
            v-model="nodeTree"
            :allow-multiselect="false"
            class="group-tree"
          >
            <template #title="{ node }">
              <v-icon>
                {{
                  node.isExpanded && !node.isLeaf
                    ? 'mdi-folder-open'
                    : 'mdi-folder'
                }}
              </v-icon>
              <span class="group-check-box">
                <v-icon
                  small
                  class="group-check"
                  :class="
                    isChecked(checkNodeDataList, node.data.menuSeq)
                      ? 'checked'
                      : ''
                  "
                  @click="selectMenuCheckBox(node)"
                >
                  mdi-check
                </v-icon>
              </span>
              <span class="sl-vue-tree__title">
                {{ node.title }}
              </span>
              <span class="sl-vue-tree__auth">
                <v-chip
                  :disabled="!isChecked(checkNodeDataList, node.data.menuSeq)"
                  :input-value="
                    getActiveClass(getCheckNodeData(node.data.menuSeq).readYn)
                  "
                  :active-class="
                    getActiveClass(getCheckNodeData(node.data.menuSeq).readYn)
                  "
                  :outlined="
                    !getActiveClass(getCheckNodeData(node.data.menuSeq).readYn)
                  "
                  :text-color="
                    getTextColor(getCheckNodeData(node.data.menuSeq).readYn)
                  "
                  small
                  color="primary"
                  @click="clickAuth(node.data.menuSeq, 'readYn')"
                >
                  <v-icon> mdi-check-bold </v-icon>
                  읽기
                </v-chip>
                <v-chip
                  :disabled="!isChecked(checkNodeDataList, node.data.menuSeq)"
                  :input-value="
                    getActiveClass(getCheckNodeData(node.data.menuSeq).writeYn)
                  "
                  :active-class="
                    getActiveClass(getCheckNodeData(node.data.menuSeq).writeYn)
                  "
                  :outlined="
                    !getActiveClass(getCheckNodeData(node.data.menuSeq).writeYn)
                  "
                  :text-color="
                    getTextColor(getCheckNodeData(node.data.menuSeq).writeYn)
                  "
                  small
                  color="green"
                  @click="clickAuth(node.data.menuSeq, 'writeYn')"
                >
                  <v-icon> mdi-check-bold </v-icon>
                  쓰기
                </v-chip>
              </span>
            </template>
          </sl-vue-tree>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end btn_BtWrap">
          <AuthDiv>
            <v-btn class="btn_save" color="primary" @click="save"> 저장 </v-btn>
          </AuthDiv>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import Vue from 'vue'
  import SlVueTree from '~/components/utils/sl-vue-tree/sl-vue-tree.vue'
  import AuthDiv from '~/components/common/AuthDiv.vue'
  Vue.use(SlVueTree)
  
  export default {
    components: { SlVueTree, AuthDiv },
    props: {
      auth: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        nodeTree: [],
        selectedAuthMenuList: [],
        checkNodeDataList: [],
      }
    },
    watch: {
      auth() {
        this.init()
      },
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        if (this.auth.authSeq) {
          this.nodeTree = await this.$axios.$get(
            `/lunar/admin/setting/auth/menus/${this.auth.authSeq}`,
          )
          this.initData()
          this.checkAddedMenu(this.nodeTree)
        }
      },
      initData() {
        this.selectedAuthMenuList = []
        this.checkNodeDataList = []
      },
      getActiveClass(yn) {
        return yn === 'Y' ? 'checked' : ''
      },
      getTextColor(yn) {
        return yn === 'Y' ? 'white' : ''
      },
      boolToString(b) {
        return b ? '사용' : '미사용'
      },
      checkAddedMenu(children) {
        children.forEach((node) => {
          if (this.isAdded(node))
            this.checkNodeDataList.push(this.createCheckNodeData(node.data))
          // sl-vue-tree 속성 초기화
          node.isDraggable = false
          node.isSelectable = false
  
          this.checkAddedMenu(node.children)
        })
      },
      isAdded(node) {
        return node.data.readYn || node.data.writeYn
      },
      // 재귀돌면서 menuSeq에 맞는 key 값 변경
      clickAuth(menuSeq, key) {
        const list = this.checkNodeDataList
  
        for (let i = 0; i < list.length; i++) {
          if (menuSeq === list[i].menuSeq) {
            list[i][key] = list[i][key] === 'Y' ? 'N' : 'Y'
          }
        }
      },
      createCheckNodeData(data) {
        return {
          authMenuSeq: data.authMenuSeq,
          authSeq: data.authSeq,
          menuSeq: data.menuSeq,
          readYn: data.readYn,
          writeYn: data.writeYn,
          createId: data.createId,
          createNm: data.createNm,
          createDatetime: data.createDatetime,
        }
      },
      isChecked(checkNodeDataList, menuSeq) {
        for (let i = 0; i < checkNodeDataList.length; i++) {
          if (checkNodeDataList[i].menuSeq === menuSeq) return true
        }
        return false
      },
      getNode(menuSeq, children) {
        for (let i = 0; i < children.length; i++) {
          const node = children[i]
          if (node.data.menuSeq === menuSeq) return node
          else if (node.children && node.children.length > 0)
            this.getNode(node.data.menuSeq, node.children)
        }
  
        return null
      },
      selectMenuCheckBox(node) {
        const menuSeq = node.data.menuSeq
        // 등록
        if (!this.isChecked(this.checkNodeDataList, menuSeq)) {
          this.checkNodeDataList.push(this.createCheckNodeData(node.data))
  
          // 부모가 아니면 부모도 체크
          if (node.data.parentMenuId !== 0) {
            this.selectParentCheckBox(node)
          }
          // 삭제
        } else {
          this.removeCheckBox(node)
        }
      },
      selectParentCheckBox(childNode) {
        const parentMenuId = childNode.data.parentMenuId
        // 최상위가 아니면
        const parentNode = this.getNode(parentMenuId, this.nodeTree)
        // 부모가 체크되어 있지 않으면 체크해준다.
        if (!this.isChecked(this.checkNodeDataList, parentNode.data.menuSeq)) {
          this.selectMenuCheckBox(parentNode)
        }
      },
      removeCheckBox(node) {
        const menuSeq = node.data.menuSeq
  
        // 자기자신 삭제
        const index = this.checkNodeDataList.findIndex(
          (nodeData) => nodeData.menuSeq === menuSeq,
        )
        if (index !== -1) this.checkNodeDataList.splice(index, 1)
  
        if (node.children.length > 0) {
          node.children.forEach((child) => {
            this.removeCheckBox(child)
          })
        }
      },
      getCheckNodeData(menuSeq) {
        const list = this.checkNodeDataList
  
        for (let i = 0; i < list.length; i++) {
          if (menuSeq === list[i].menuSeq) {
            return list[i]
          }
        }
        return {}
      },
      save() {
        this.$axios
          .$post(
            `/lunar/admin/setting/auth/menus/${this.auth.authSeq}`,
            this.checkNodeDataList,
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )
          .then(() => {
            this.init()
            // 자기 권한을 수정하는 거라면 즉시 좌측메뉴리스트 refresh
            const authSeq = this.$auth.$state.user.authSeq
            if (authSeq === this.auth.authSeq)
              this.$root.$emit('refreshTheNavigation')
  
            alert('저장 완료')
          })
          .catch((error) => alert(error))
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .menuWrap {
    border: 1px solid #dadada;
  }
  .group-check-box {
    margin: 0 5px;
  }
  .group-check {
    border-radius: 3px;
    border: 1px solid #b8b8b8;
  }
  .group-check.checked {
    color: #fff;
    background-color: #529cf7;
    border-color: #529cf7;
  }
  .sl-vue-tree__title {
    margin: 0 5px;
    color: #5f5f5f;
    font-size: 16px;
  }
  .sl-vue-tree__auth {
    margin: 0 5px;
    .v-size--small {
      font-size: 11px !important;
      line-height: 25px;
      i {
        margin-right: 4px;
      }
    }
  }
  </style>
  