export default {
  auth: false,

  server: {
    host: '0.0.0.0',
    port: 3000,
  },

  head: {
    titleTemplate: '%s - hq-admin-front',
    title: 'hq-admin-front',
    htmlAttrs: {
      lang: 'kr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css'
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/common/common.scss',
  ],
  
  styleResources: {
    scss: ['~/assets/variables.scss'],
  },

  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  dayjs: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    defaultTimeZone: 'Asia/Seoul',
    plugins: [
      'utc', // import 'dayjs/plugin/utc'
      'timezone', // import 'dayjs/plugin/timezone'
      'duration', // import 'dayjs/plugin/duration'
    ],
  },

  router: {
    middleware: ['auth'], // 미드웨어에서 동작할 auth 설정을 아래와 같이 정의 한다.
  },

  auth: {
    strategies: {// 전략
      local: {
        scheme: 'refresh',// 계획은 refresh를 사용한다.
        token: {
          property: 'access_token',
          global: true,
          type: '',
        },
        refreshToken: {
          property: 'refresh_token',
        },
        user: {
          property: false,// 아래의 login으로 실행 후 데이터 reponse명을 따로 지정하지 않는다.
        },
        autoLogout: true,
        endpoints: {
          login: { url: '/lunar/admin/auth/login', method: 'post' },
          refresh: { url: '/lunar/admin/auth/refresh', method: 'post' },
          user: { url: '/lunar/admin/auth/user', method: 'get' },
          logout: false
        },
      },
    },
  },

  axios: {
    retry: false,
    proxy: true,
  },

  proxy: {
    '/lunar/admin/': {
      target: 'http://localhost:8080',
    },
  },
}