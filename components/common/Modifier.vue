<template>
  <v-row class="reg-row">
    <v-col cols="3" class="reg-formTitle">수정일시</v-col>
    <v-col colos="5" class="cardConTxt">{{ value.modifyDatetime }}</v-col>
    <v-col cols="2" class="reg-formTitle">수정자</v-col>
    <v-col colos="4" class="cardConTxt">{{ getModifier() }}</v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    getModifier() {
      const modifyId = this.value.modifyId ? this.value.modifyId : ''
      const modifyNm = this.value.modifyNm ? ` (${this.value.modifyNm})` : ''
      return `${modifyId}${modifyNm}`
    },
  },
}
</script>
