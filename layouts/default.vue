<template>
  <v-app>
    <section id="main">
      <MiscCombined />
      <div class="content_wrap">
        <Navbar />
        <v-main>
          <v-container class="main-container">
            <Nuxt keep-alive :max="300" />
          </v-container>
        </v-main>
      </div>
    </section>
  </v-app>
</template>

<script>
import Navbar from '~/components/Navbar'
import MiscCombined from '~/components/MiscCombined'

export default {
  components: {
    Navbar,
    MiscCombined
  }
}
</script>