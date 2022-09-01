<template>
  <v-app>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <Notification :message="error" v-if="error" />

          <form method="post" @submit.prevent="register">
            <div class="field">
              <label class="label">adminUserId</label>
              <div class="control">
                <input type="text" class="input" name="adminUserId" v-model="adminUserData.adminUserId" required />
              </div>
            </div>
            <div class="field">
              <label class="label">adminUserNm</label>
              <div class="control">
                <input type="text" class="input" name="adminUserNm" v-model="adminUserData.adminUserNm" required />
              </div>
            </div>
            <div class="field">
              <label class="label">adminUserPwd</label>
              <div class="control">
                <input type="password" class="input" name="password" v-model="adminUserData.adminUserPwd" required />
              </div>
            </div>
            <div class="field">
              <label class="label">dept</label>
              <div class="control">
                <input type="text" class="input" name="dept" v-model="adminUserData.dept" required />
              </div>
            </div>
            <div class="field">
              <label class="label">position</label>
              <div class="control">
                <input type="text" class="input" name="position" v-model="adminUserData.position" required />
              </div>
            </div>
            <div class="field">
              <label class="label">Auth</label>
              <div class="control">
                <v-select v-model="adminUserData.authSeq" :items="authSelectList" item-value="authSeq" item-text="authNm"></v-select>
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Register</button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <nuxt-link to="/login">Login</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  </v-app>
</template>

<script>
import Notification from '~/components/Notification'

export default {
  middleware: 'guest',
  components: {
    Notification,
  },

  auth: false,

  data() {
    return {
      adminUserData: {
        adminUserId: '',
        adminUserNm: '',
        adminUserPwd: '',
        dept: '',
        position: '',
        authSeq: 1,
        error: null
      },
      authSelectSearchData: {
        authNm: "",
      },
      authSelectList: [],
      error: null,
    }
  },

  async fetch() {
    this.authSelectList = await this.$axios.$get(
      '/lunar/admin/setting/auth/list',
      {
        params: this.authSelectSearchData,
      }
    )
  },

  methods: {
    async register() {
      try {
        await this.$axios.post('/lunar/admin/system/save/user', this.adminUserData)
        this.$router.push('/')
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  }
}
</script>