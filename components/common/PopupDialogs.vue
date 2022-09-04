<template>
    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card class="dialog-style">
        <v-card-title v-if="headText !== ''" class="headline sub">
          {{ headText }}
          <v-spacer></v-spacer>
          <v-icon
            v-if="closeIcon"
            class="dialog-close__icon"
            @click="closeDialog()"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text class="mainline">
          <div>{{ text }}</div>
          <div v-if="textSecondary !== ''">{{ textSecondary }}</div>
        </v-card-text>
        <v-card-text v-if="textarea !== ''" class="textarea">
          <v-textarea
            full-width
            no-resize
            readonly
            filled
            hide-details
            dense
            :value="textarea"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <div v-if="negativeButtonText !== ''" class="dialog-trigger">
            <v-btn color="#ff2929" depressed @click="triggerDialog(false)">{{
              negativeButtonText
            }}</v-btn>
          </div>
          <div v-if="positiveButtonText !== ''" class="dialog-trigger">
            <v-btn color="#05a7c4" depressed @click="triggerDialog(true)">{{
              positiveButtonText
            }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      trigger: {
        type: Boolean,
        default: false,
      },
      closeIcon: {
        type: Boolean,
        default: false,
      },
      negativeButtonText: {
        type: String,
        default: '',
      },
      positiveButtonText: {
        type: String,
        default: '',
      },
      headText: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
      textSecondary: {
        type: String,
        default: '',
      },
      textarea: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        dialog: false,
      }
    },
    watch: {
      trigger(newBoolean) {
        this.dialog = newBoolean
      },
    },
    methods: {
      triggerDialog(newBoolean) {
        this.dialog = false
        this.$emit('trigger', newBoolean)
        this.$emit('close')
      },
      closeDialog() {
        this.dialog = false
        this.$emit('close')
      },
    },
  }
  </script>
  