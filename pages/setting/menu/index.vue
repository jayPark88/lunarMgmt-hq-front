<template>
    <v-container id="menu-container" class="subCon">
        <v-row>
            <v-col cols="6">
                <v-card tile class="menuTree">
                    <v-card-actions class="tree_btncon">
                        <v-col cols="12" class="tree_btn">
                            <v-btn small color="info" outlined @click="openAll">
                                모두열기
                            </v-btn>
                            <v-btn small color="info" outlined @click="closeAll">
                                모두닫기
                            </v-btn>
                            <v-tooltip bottom>
                                <template #activator="{ on, attrs }">
                                    <v-btn small color="info" outlined v-bind="attrs" v-on="on" @click="addMenu">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>메뉴추가</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template #activator="{ on, attrs }">
                                    <v-btn small color="info" outlined v-bind="attrs" v-on="on" @click="removeMenu">
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                </template>
                                <span>메뉴삭제</span>
                            </v-tooltip>
                        </v-col>
                    </v-card-actions>
                    <v-card-text class="tree-style1">
                        <v-row>
                            <v-col>
                                <div id="top-menu" :class="{ active: !selectedMenu.data.menuSeq }"
                                    @click="clickTopMenu">
                                    최상위 메뉴
                                </div>
                            </v-col>
                        </v-row>
                        <sl-vue-tree v-model="menus" :allow-multiselect="false" @select="selectMenu"
                            @beforedrop="beforedrop">
                            <template #title="{ node }">
                                <v-icon>
                                    {{
                                    node.isExpanded && !node.isLeaf
                                    ? 'mdi-folder-open'
                                    : 'mdi-folder'
                                    }}
                                </v-icon>
                                <span class="sl-vue-tree__title">{{ node.title }}</span>
                                <span v-if="!node.data.useYn">
                                    <v-chip :name="node.title" small class="unused">
                                        {{ YNToString(node.data.useYn) }}
                                    </v-chip>
                                    {{ node }}
                                </span>
                            </template>
                            <template #draginfo>
                                {{ selectedMenu.data.menuNm }}
                            </template>
                        </sl-vue-tree>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card tile class="menuDetail">
                    <v-list-item-title class="menuTit">
                        <span>메뉴 상세</span>
                    </v-list-item-title>
                    <v-card-text>
                        <MenuViewer v-if="!editable" :menu="selectedMenu.data" @change-to="changeToEditor"
                            @refresh="refreshMenuTree" />
                        <MenuEditor v-if="editable" :menu="selectedMenu.data" :save-type="saveType"
                            @change-to="changeToViewer"></MenuEditor>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Vue from 'vue'
import SlVueTree from '~/components/utils/sl-vue-tree/sl-vue-tree.vue'
import MenuViewer from '~/components/setting/menu/MenuViewer.vue'
import MenuEditor from '~/components/setting/menu/MenuEditor.vue'
Vue.use(SlVueTree)

export default {
    components: { SlVueTree, MenuViewer, MenuEditor },
    data() {
        return {
            menus: [],

            treeItems: [],

            selectedMenu: { data: {} },

            editable: false,
            saveType: 'new', // new, edit
        }
    },
    async fetch() {
        this.menus = await this.$axios.$get('/lunar/admin/setting/menus/vuetree')
        this.clickTopMenu()
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        clickTopMenu() {
            // 초기화
            this.selectedMenu = {
                data: {
                    menuNm: '최상위 메뉴',
                    menuLevel: 0,
                    sortNum: 0,
                    parentMenuId: 0,
                    topMenuId: 0,
                    useYn: 'Y',
                    childrenLength: this.menus.length,
                },
            }
            // 선택된 트리 Item 배경색지우기
            this.initActiveMenu(this.menus)
            this.editable = false
        },
        initActiveMenu(children) {
            if (!children || children.length <= 0) return

            children.forEach((c) => {
                c.isSelected = false
                this.initActiveMenu(c.children)
            })
        },
        // 오브젝트가 비어있으면 true
        checkEmptyObject(obj) {
            if (obj != null) return Object.keys(obj).length === 0
            else return true
        },
        selectMenu(selectMenus) {
            if (selectMenus.length !== 0) {
                this.selectedMenu = selectMenus[0]
                this.selectedMenu.data.childrenLength =
                    this.selectedMenu.children.length
            }
            this.editable = false
            this.saveType = 'edit'
        },
        changeToEditor() {
            this.editable = true
            this.saveType = 'edit'
        },
        changeToViewer(refresh) {
            if (refresh) {
                this.refreshMenuTree() // 데이터 refresh가 필요한 경우만
            }

            this.saveType = 'edit'
            this.editable = false
        },
        refreshMenuTree() {
            this.selectedMenu = { data: {} }
            this.$fetch()
            this.$root.$emit('refreshTheNavigation')
        },
        addMenu() {
            this.saveType = 'new'
            this.editable = true
        },
        removeMenu() {
            if (!this.selectedMenu.data.menuSeq) {
                alert('메뉴를 선택해주십시오.')
                return
            }
            if (this.selectedMenu.children.length > 0) {
                alert('자식메뉴가 존재하는 메뉴는 삭제할 수 없습니다..')
                return
            }

            if (confirm('선택한 메뉴를 삭제하시겠습니까?')) {
                this.$axios
                    .$delete('/lunar/admin/setting/menus/' + this.selectedMenu.data.menuSeq)
                    .then(() => {
                        this.changeToViewer(true)
                    })
                    .catch((err) => {
                        alert(err.response.data.message)
                    })
            }
        },
        beforedrop(draggingNodes, cursorPosition, cancelled) {
            const _source = draggingNodes[0]
            const _target = cursorPosition.node
            if (
                (_source.level !== _target.level ||
                    _source.data.parentMenuId !== _target.data.parentMenuId) &&
                _source.level !== 0 &&
                _target.level !== 0
            ) {
                alert('같은 부모를 가진 메뉴만 변경이 가능합니다.')
                cancelled()
                return
            }

            const params = {}
            params.menuSeq = _source.data.menuSeq
            params.parentMenuId = _source.data.parentMenuId
            params.beforeSortNum = _source.data.sortNum
            params.sortNum = _target.data.sortNum

            this.$axios
                .$put('/lunar/admin/setting/menus/sort', params)
                .then(() => this.changeToViewer(true))
                .catch(() => this.changeToViewer(true))

            cancelled()
        },
        expandTree(menu, isExpanded) {
            if (!menu.isLeaf) {
                menu.isExpanded = isExpanded
                menu.children.forEach((menu) => this.expandTree(menu, isExpanded))
            }
        },
        openAll() {
            this.menus.forEach((menu) => this.expandTree(menu, true))
        },
        closeAll() {
            this.menus.forEach((menu) => this.expandTree(menu, false))
        },
        YNToString(menu) {
            if (!menu) return
            return menu.useYn === 'Y' ? '사용' : '미사용'
        },
    },
}
</script>
<style lang="scss">

</style>