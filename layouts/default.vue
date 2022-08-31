<template>
  <v-app>
    <section id="main">
      <Navigation  class="main-navigation" v-if="isAuthenticated"/>
      <div class="content_wrap">
        <v-main>
          <v-container class="main-container">
            <Nuxt keep-alive :max="300" />
          </v-container>
        </v-main>
      </div>
    </section>
    <v-footer fixed>
      <span>COPYRIGHT © WISEAI. All Rights Reserved</span>
    </v-footer>
    <TheLoading />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Navigation from '~/components/navigation/TheNavigation.vue'

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },

  components: {
    Navigation
  }
}
</script>


<style lang="scss">
:root {
  --var-nav-width: 192px;
}

#main {
  display: flex;
  height: 100%;
  margin-bottom: 32px;

  &>* {
    // float: left;
    display: inline-block;
  }

  .main-navigation {
    width: var(--var-nav-width);
    transition: width 0.2s;
  }

  .container {
    max-width: 100%;
    padding: 0;
  }

  .content_wrap {
    width: 100%;
    height: 100%;
    margin-left: var(--var-nav-width);
    transition: margin-left 0.2s;

    .v-main {
      margin-top: 105px !important;
      height: calc(100% - 105px);
    }

    .main-container {
      padding: 0;
      height: 100%;
    }
  }
}

.v-input,
.v-list-item__title {
  font-size: 1.6rem;
}
</style>