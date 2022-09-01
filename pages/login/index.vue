<template>
  <div id="login-page">
    <div id="login-box__image">
      <span class="login-img"></span>
    </div>
    <div id="login-box">
      <div id="login-vox__midline">
        <div id="login-box__title">Administration System</div>
        <div id="login-box__form">
          <div>
            <input v-model="loginData.adminUserId" placeholder="아이디" />
          </div>
          <div>
            <input v-model="loginData.adminUserPwd" type="password" placeholder="비밀번호" @keyup.enter="login" />
          </div>
        </div>
        <div id="login-box__button">
          <v-btn color="black" dark @click="login">로그인</v-btn>
        </div>
      </div>
    </div>
    <v-footer id="footer">
      <span>COPYRIGHT © jay. All Rights Reserved</span>
    </v-footer>
  </div>
</template>

<script>

export default {
  layout: 'full-screen',
  data() {
    return {
      loginData: {
        adminUserId: '',
        adminUserPasswd: '',
      },
    }
  },

  mounted() {
    this.$auth.logout('local')
  },

  methods: {
    async login() {
      await this.$auth.loginWith('local', {
        data: this.loginData,
      })
      this.$auth.isLogouted = false
    },
  },

}
</script>

<style>
html {
  overflow: auto;
}
</style>
  
<style lang="scss" scoped>
.custom-flex-center {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
}

#login-page {
  width: 100%;
  height: 100%;
  @extend .custom-flex-center;

  #login-box {
    width: 100%;
    height: calc(100% - 338px - 48px);
    min-height: 330px;
    display: flex;

    #login-vox__midline {
      width: 564px;
      margin: auto;

      #login-box__title {
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        letter-spacing: -0.05rem;
        font-size: 1.6rem;
        color: #0094b4;
        text-align: center;
      }

      #login-box__form {
        margin-bottom: 16px;

        div {
          padding: 5px 0 4px;

          input {
            width: 100%;
            height: 50px;
            border: 1px solid #cfcfe3;
            background-color: #ffffff;
            padding: 0 14px;
          }

          .focus-only:focus {
            border: 0;
          }

          :focus-visible {
            border: 0;
            outline: 1px solid #00a5d1;
          }

          ::placeholder {
            color: #cfcfe3;
          }

          ::-webkit-input-placeholder {
            color: #cfcfe3;
          }

          :-ms-input-placeholder {
            color: #cfcfe3;
          }
        }
      }

      #login-box__function {
        display: flex;
        margin-bottom: 24px;

        &>* {
          width: 50%;
          height: 100%;
        }

        #function-save {
          label {
            display: flex;
            flex-direction: row;
            align-content: center;

            input[type='checkbox'] {
              width: 18px;
              height: 18px;
              margin-right: 5px;
              margin-top: 2px;
            }
          }
        }

        #function-search {
          display: flex;
          justify-content: flex-end;
          color: #5f5f5f;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      }

      #login-box__button {
        height: 59px;

        button {
          width: 100%;
          height: 100%;
          font-size: 1.6rem;
          border-radius: 0;
        }
      }
    }
  }
}
</style>