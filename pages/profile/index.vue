<template>
    <section class="section">
      <div class="container">
        <h2 class="title">My Profile</h2>
        <div class="content">
          <p>
            <strong>AdminUserId:</strong>
            {{ loggedInUser.adminUserId }}
          </p>
          <p>
            <strong>AdminUserNm:</strong>
            {{ loggedInUser.adminUserNm }}
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  
  export default {
    middleware: 'auth',
    computed: {
      ...mapGetters(['loggedInUser'])
    }
  }
  </script>