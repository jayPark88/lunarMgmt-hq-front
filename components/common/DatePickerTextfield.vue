<template>
  <v-menu
    v-model="dateMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
    max-width="290px"
    :disabled="disabled"
  >
    <template #activator="{ on }">
      <template v-if="month">
        <v-btn dark height="32" color="#333333" v-on="on">월간</v-btn>
      </template>
      <template v-else>
        <v-text-field
          class="date-picker-textfield"
          placeholder="일자 선택"
          readonly
          single-line
          outlined
          dense
          hide-details="auto"
          :style="`width: ${width}`"
          :append-icon="icon ? 'mdi-calendar' : ''"
          :required="required"
          :rules="rules"
          :value="multiple ? arrayValue.join(', ') : value"
          v-on="on"
          @click:append="clickIcon"
        ></v-text-field>
      </template>
    </template>
    <v-date-picker
      v-model="dateValue"
      :day-format="dayFormat"
      :allowed-dates="allowedDates"
      :multiple="multiple"
      :min="min"
      :max="max"
      no-title
      locale="ko-KR"
      :type="month ? 'month' : 'date'"
      :disabled="disabled"
      @input="choose"
    >
      <template v-if="multiple">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="dateMenu = false"> 확인 </v-btn>
        <v-btn text color="primary" @click="initDates()"> 초기화 </v-btn>
      </template>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    arrayValue: {
      type: Array,
      default: () => [],
    },
    dateRange: {
      type: Boolean,
      default: false,
    },
    month: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: null,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dateMenu: false,
      dateValue: this.multiple ? this.arrayValue : this.value,
    }
  },
  watch: {
    value(value) {
      this.dateValue = value
    },
    dateValue(value) {
      if (this.month && String(value).length === 7) {
        this.$emit('setStartDate', `${value}-01`)
        this.$emit(
          'setEndDate',
          `${value}-${this.$dayjs()
            .year(String(value).substring(0, 4))
            .month(Number(String(value).substring(5)) - 1)
            .endOf('month')
            .date()}`,
        )
      } else {
        this.$emit('input', value || null)
      }
    },
  },
  methods: {
    clickIcon() {
      this.dateMenu = true
    },
    allowedDates(date) {
      if (this.dateRange) {
        return this.$dayjs().format('YYYY-MM-DD') <= date ? date : null
      } else {
        return date
      }
    },
    dayFormat(date) {
      return new Date(date).getDate()
    },
    choose() {
      console.log('choose!')
      if (!this.multiple) {
        this.dateMenu = false
      }
    },
    initDates() {
      this.$emit('input', [])
      this.dateValue = []
    },
  },
}
</script>

<style lang="scss">
.v-date-picker-header {
  font-size: 1.6rem;
}

.v-menu__content {
  .v-date-picker-table {
    padding: 16px !important;
    height: auto !important;
  }
}

.date-picker-textfield {
  .v-input__append-inner {
    margin-top: 4px !important;
    margin-right: 4px !important;
  }
}
</style>
