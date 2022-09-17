<template>
    <v-row class="code-headers">
      <v-col
        v-for="(header, index) in headers"
        :key="index"
        :cols="header.cols"
        :class="header.class"
      >
        <span>{{ header.text }}</span>
      </v-col>
    </v-row>
  </template>
  
  <script>
  export default {
    props: {
      headers: {
        type: Array,
        default: () => [],
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .code-headers {
    font-size: 15px;
    font-weight: 700;
    color: #000;
    margin: 5px 0 0;
    background: #ebebeb;
    border-top: 2px solid #707070;
    height: 48px;
  
    .col {
      padding: 6px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:first-child {
        border-left: 0 !important;
      }
      &:nth-child(2) {
        border-left: 0 !important;
        span {
          margin-right: 46px;
          border-left: 0;
        }
      }
      span {
        width: 100%;
        border-left: 1px solid #dadada;
        margin-top: 3px;
        text-align: center;
      }
    }
  }
  </style>
  