<template>
    <div>
        <v-container>
            <v-row class="reg-row">
                <v-col cols="3" class="reg-formTitle mandatory">권한명</v-col>
                <v-col colos="9">
                    <v-text-field v-model="editableAuth.authNm" single-line dense hide-details="auto" outlined>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="reg-row">
                <v-col cols="3" class="reg-formTitle mandatory">권한코드</v-col>
                <v-col colos="9">
                    <v-text-field v-model="editableAuth.authCd" single-line dense hide-details="auto" outlined>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="reg-row">
                <v-col cols="3" class="reg-formTitle mandatory">사용 여부</v-col>
                <v-col colos="9">
                    <v-switch v-model="editableAuth.useYn" :label="YNToString(editableAuth.useYn)" true-value="Y"
                        false-value="N" hide-details color="primary"></v-switch>
                </v-col>
            </v-row>
            <v-row class="reg-row">
                <v-col cols="3" class="reg-formTitle">설명</v-col>
                <v-col colos="9">
                    <v-textarea v-model="editableAuth.authDesc" outlined hide-details="auto" auto-grow></v-textarea>
                </v-col>
            </v-row>
        </v-container>
        <v-row class="mt-3">
            <v-col class="d-flex justify-end btn_BtWrap">
                <AuthDiv>
                    <v-btn color="grey darken-1" dark @click="cancel">취소</v-btn>
                    <v-btn color="primary" class="ml-2" @click="save">저장</v-btn>
                </AuthDiv>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import AuthDiv from '~/components/common/AuthDiv.vue'

export default {
    components: { AuthDiv },
    props: {
        auth: {
            type: Object,
            default: () => { },
        },
        saveType: {
            type: String,
            default: 'new',
        },
    },
    data() {
        return {
            authCodeSelect: [],
            editableAuth: {},
        }
    },
    fetch() {
        if (this.saveType === 'new') this.editableAuth = this.createEmptyGroup()
        else this.editableAuth = JSON.parse(JSON.stringify(this.auth)) // 깊은복사
    },
    computed: {},
    created() { },
    mounted() { },
    methods: {
        YNToString(yn) {
            return yn === 'Y' ? '사용' : '미사용'
        },
        createEmptyGroup() {
            return {
                authNm: '',
                authCd: '',
                authDesc: '',
                useYn: 'Y',
            }
        },
        save() {
            if (!this.editableAuth.authNm.trim()) {
                alert('권한명을 입력해주십시오.')
                return
            }
            if (!this.editableAuth.authCd.trim()) {
                alert('권한코드명를 입력해주십시오.')
                return
            }

            if (this.saveType === 'new')
                this.$axios
                    .$post('/admin/setting/auths', this.editableAuth)
                    .then(() => this.$emit('change-to', true))
                    .catch((error) => alert(error.response.data.message))
            else
                this.$axios
                    .$put('/admin/setting/auths', this.editableAuth)
                    .then(() => this.$emit('change-to', true))
                    .catch((error) => alert(error.response.data.message))
        },
        cancel() {
            this.$emit('change-to')
        },
    },
}

</script>

<style lang="scss" scoped>
.reg-row {
    .v-input--selection-controls {
        margin-top: 0 !important;
    }
}
</style>
