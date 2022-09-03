<template>
  <v-row class="reg-row">
    <v-col cols="3" class="reg-formTitle">등록일시</v-col>
    <v-col colos="5" class="cardConTxt">{{ value.createDatetime }}</v-col>
    <v-col cols="2" class="reg-formTitle">등록자</v-col>
    <v-col colos="4" class="cardConTxt">{{ getCreator() }}</v-col>
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
    getCreator() {
      const createId = this.value.createId ? this.value.createId : ''
      const createNm = this.value.createNm ? ` (${this.value.createNm})` : ''
      return `${createId}${createNm}`
    },
  },
}
</script>
