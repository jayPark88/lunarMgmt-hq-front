<template>
    <v-container>
        <v-row class="reg-row">
            <v-col cols="3" class="reg-formTitle mandatory">권한명</v-col>
            <v-col colos="9" class="cardConTxt">{{ auth.authNm }}</v-col>
        </v-row>
        <v-row class="reg-row">
            <v-col cols="3" class="reg-formTitle mandatory">권한코드</v-col>
            <v-col colos="9" class="cardConTxt">{{ auth.authCd }}</v-col>
        </v-row>
        <v-row class="reg-row">
            <v-col cols="3" class="reg-formTitle mandatory">사용 여부</v-col>
            <v-col colos="9" class="cardConTxt">
                <v-switch :input-value="auth.useYn === 'Y'" :label="boolToString(auth.useYn)" color="primary" disabled
                    hide-details></v-switch>
            </v-col>
        </v-row>
        <v-row class="reg-row">
            <v-col cols="3" class="reg-formTitle">설명</v-col>
            <v-col colos="9" class="cardConTxt">
                <template v-for="(s, index) in cDescription">
                    {{ s }}
                </template>
            </v-col>
        </v-row>
        <Creator :value="auth" />
        <Modifier :value="auth" />
        <v-row>
            <v-col class="d-flex justify-end btn_BtWrap">
                <v-btn class="btn_save" color="primary" @click="edit"> 수정 </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Creator from '~/components/common/Creator.vue'
import Modifier from '~/components/common/Modifier.vue'

export default {
    components: { Creator, Modifier },
    props: {
        auth: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {}
    },
    computed: {
        cDescription() {
            return this.auth.authDesc && this.auth.authDesc.split('\n')
        },
    },
    methods: {
        edit() {
            this.$emit('change-to')
        },
        boolToString(b) {
            return b ? '사용' : '미사용'
        },
    },
}
</script>  
