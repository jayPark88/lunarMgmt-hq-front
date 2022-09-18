<template>
  <!-- Viewer -->
  <v-row v-if="!editable" class="row-line">
    <template v-if="isGroup">
      <v-col
        :cols="headers[0].cols"
        :class="headers[0].class"
        @click="code.commonCodeDtos.length > 0 ? expand(code) : null"
      >
        <v-icon
          v-if="code.commonCodeDtos.length > 0"
          :class="{ active: code.open }"
        >
          mdi-chevron-down
        </v-icon>
      </v-col>
    </template>
    <template v-else>
      <v-col :cols="headers[0].cols" :class="headers[0].class">
        <v-icon> mdi-arrow-all </v-icon>
      </v-col>
    </template>

    <!-- 기능이 붙어있는 첫번째, 마지막 배열값 제외하고 나머지 v-for -->
    <v-col
      v-for="i in Array.from({ length: headers.length - 2 }, (v, i) => i + 1)"
      :key="i"
      :cols="headers[i].cols"
    >
      {{ code[headers[i].name] }}
    </v-col>

    <v-col
      :cols="headers[headers.length - 1].cols"
      :class="headers[headers.length - 1].class"
      class="d-flex"
    >
      <v-row>
        <v-col class="codeBtn">
          <v-btn
            v-if="isGroup"
            x-small
            color="light-green darken-3"
            dark
            @click="add"
          >
            <span>추가</span>
          </v-btn>
          <v-btn x-small color="teal darken-1" dark @click="edit">
            <span>수정</span>
          </v-btn>
          <v-btn x-small color="red darken-1" dark @click="remove">
            <span>삭제</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <!-- Editor -->
  <v-row v-else>
    <template v-if="isGroup">
      <v-col
        :cols="headers[0].cols"
        :class="headers[0].class"
        @click="expand(code)"
      >
        <v-icon
          v-if="code.commonCodeDtos.length > 0"
          :class="{ active: code.open }"
        >
          mdi-arrow-down
        </v-icon>
      </v-col>
    </template>
    <template v-else>
      <v-col :cols="headers[0].cols" :class="headers[0].class">
        <v-icon> mdi-arrow-all </v-icon>
      </v-col>
    </template>

    <!-- 기능이 붙어있는 첫번째, 마지막 배열값 제외하고 나머지 v-for -->
    <v-col
      v-for="i in Array.from({ length: headers.length - 2 }, (v, i) => i + 1)"
      :key="i"
      :cols="headers[i].cols"
    >
      <template
        v-if="!copiedCode.new && (!headers[i].type || headers[i].identifier)"
      >
        {{ copiedCode[headers[i].name] }}
      </template>
      <template v-else-if="headers[i].type == 'textField'">
        <v-text-field
          v-model="copiedCode[headers[i].name]"
          single-line
          dense
          hide-details="auto"
          outlined
        ></v-text-field>
      </template>
      <template v-else-if="headers[i].type == 'select'">
        <v-select
          v-model="copiedCode[headers[i].name]"
          :items="headers[i].items"
          single-line
          dense
          hide-details
          outlined
        ></v-select>
      </template>
    </v-col>

    <v-col
      :cols="headers[headers.length - 1].cols"
      :class="headers[headers.length - 1].class"
      class="d-flex"
    >
      <v-row>
        <v-col class="codeBtn">
          <v-btn x-small dark color="primary" @click="save">
            <span>저장</span>
          </v-btn>
          <v-btn x-small dark color="blue-grey darken-1" @click="cancel">
            <span>취소</span>
          </v-btn>
          <v-btn
            v-if="code.createDatetime"
            x-small
            dark
            color="red darken-1"
            @click="remove"
          >
            <span>삭제</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    code: {
      type: Object,
      default: () => {},
    },
    isGroup: {
      type: Boolean,
      default: true,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      editable: false,
    }
  },
  mounted() {
    if (this.code.new) {
      this.edit()
    }
  },
  methods: {
    expand() {
      this.$emit('expand', this.index)
    },
    edit() {
      this.copiedCode = JSON.parse(JSON.stringify(this.code))
      this.editable = true
    },
    save() {
      if (this.code.new) {
        this.saveCode()
      } else {
        this.updateCode()
      }
    },
    saveCode() {
      if (this.isGroup) {
        this.$axios
          .$post('/lunar/admin/setting/code/groups', this.copiedCode)
          .then(() => {
            this.$emit('refresh')
            this.editable = false
          })
          .catch((error) => alert(error.response.data.message))
      } else {
        this.$axios
          .$post(
            `/lunar/admin/setting/code/groups/${this.code.groupCode}/codes`,
            this.copiedCode,
          )
          .then(() => {
            this.$emit('refresh')
            this.editable = false
          })
          .catch((error) => alert(error.response.data.message))
      }
    },
    updateCode() {
      if (this.isGroup) {
        this.$axios
          .$put('/lunar/admin/setting/code/groups', this.copiedCode)
          .then(() => {
            this.$emit('refresh')
            this.editable = false
          })
          .catch((error) => alert(error))
      } else {
        this.$axios
          .$put(
            `/lunar/admin/setting/code/groups/${this.code.groupCode}/codes`,
            this.copiedCode,
          )
          .then(() => {
            this.$emit('refresh')
            this.editable = false
          })
          .catch((error) => alert(error.response.data.message))
      }
    },
    cancel() {
      if (this.code.createDatetime) this.editable = false
      else this.$emit('cancel')
    },
    add() {
      this.$emit('add', this.index)
    },
    remove() {
      if (!confirm('삭제하시겠습니까?')) {
        return
      }

      if (this.code.new) {
        this.$emit('refresh')
        return
      }

      if (this.isGroup) {
        this.$axios
          .$delete(`/lunar/admin/setting/code/groups/${this.code.code}`)
          .then(() => {
            this.$emit('refresh')
          })
          .catch((error) => alert(error.response.data.message))
      } else {
        this.$axios
          .$delete(
            `/lunar/admin/setting/code/groups/${this.code.groupCode}/codes/${this.code.code}`,
          )
          .then(() => {
            this.$emit('refresh')
          })
          .catch((error) => alert(error.response.data.message))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.active {
  transform: rotate(180deg);
}

.col {
  padding: 6px;
  display: flex;
  align-items: center;
  color: #000;
}
.btn-group {
  flex: 0 0 12.3333333333%;
  max-width: 12.3333333333%;

  .row {
    line-height: normal;
    margin: 0;
    border-bottom: none !important;
    .col {
      //max-width: 38%;
      //min-width: 0;
      padding: 0 !important;
      display: flex;
      justify-content: flex-end;

      .v-btn {
        //width: 100%;
        padding: 0;
        margin-left: 3px;
        border-radius: 3px;
        span {
          margin-top: 1px;
          font-size: 11px !important;
        }
      }

      .v-input {
        .v-input__control {
          .v-input__slot {
            min-height: 0;
          }
        }
      }
    }
  }
}

.group-list {
  & * {
    font-size: 12px;
    line-height: 15px;
    .row {
      border-bottom: 1px solid #d5d5d5;
    }
  }
  .row-line {
    border-bottom: 1px solid #d5d5d5;
    .col:nth-child(8),
    .col:nth-child(9),
    .col:nth-child(10) {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
  .mdi-chevron-down {
    color: #000;
  }
  .v-input {
    background: #fff;
  }
}
</style>
