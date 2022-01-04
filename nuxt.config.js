import { getMetaData } from './utils/getMetaData'
import { redirects } from './redirects'

const meta = getMetaData()

export default {
  router: {
    trailingSlash: undefined,
    extendRoutes(routes, resolve) {
      routes.push(...redirects)
    },
  },
  generate: {
    routes: ['404'],
  },
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Cypress Documentation',
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' }],
    script: [{ src: '/js/removeTrailingSlash.js' }],
  },
  /*
   ** Global CSS
   */
  css: ['@/styles/content.css'],
  env: {
    FULLSTORY_ORG_ID: process.env.FULLSTORY_ORG_ID,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/vue-scrollactive',
    '@/plugins/sanity-client',
    { src: '@/plugins/fullstory', mode: 'client' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome',
    '@nuxt/image',
    'nuxt-build-optimisations',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxt/content',
    '@nuxtjs/gtm',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
  ],
  sitemap: {
    hostname: 'https://docs.cypress.io',
  },
  sentry: {
    dsn:
      (process.env.VERCEL_ENV === 'production' && process.env.SENTRY_DSN) ||
      undefined,
  },
  /*
   ** Google Tag Manager
   */
  gtm: {
    // The env var VERCEL_ENV is set by Vercel and can be 'production', 'deploy-preview', or 'branch-deploy'
    id:
      (process.env.VERCEL_ENV === 'production' && 'GTM-KNKBWLD') ||
      'GTM-XXXXXXX',
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {
    markdown: {
      remarkPlugins: (_defaultPlugins) => {
        return [
          'remark-directive',
          '~/scripts/remark-directives.js',
          'remark-squeeze-paragraphs',
          'remark-slug',
          'remark-autolink-headings',
          'remark-external-links',
          'remark-footnotes',
          'remark-gfm',
        ]
      },
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css',
      },
      liveEdit: false,
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    loadingScreen: process.env.NODE_ENV === 'development',
  },
  /*
   ** Font Awesome Configuration
   */
  fontawesome: {
    icons: {
      solid: [
        'faAngleRight',
        'faBan',
        'faBook',
        'faBug',
        'faCamera',
        'faCheck',
        'faCheckCircle',
        'faCheckSquare',
        'faChevronLeft',
        'faChevronRight',
        'faCode',
        'faCog',
        'faCogs',
        'faCopy',
        'faCrosshairs',
        'faDownload',
        'faExclamationTriangle',
        'faExternalLinkAlt',
        'faFileCode',
        'faFolderOpen',
        'faGlobe',
        'faGraduationCap',
        'faHeart',
        'faHistory',
        'faImage',
        'faLongArrowAltUp',
        'faMagic',
        'faMousePointer',
        'faPlayCircle',
        'faPlus',
        'faQuestionCircle',
        'faSearch',
        'faStar',
        'faSyncAlt',
        'faTerminal',
        'faTimes',
        'faTree',
        'faVideo',
      ],
      brands: ['faGithub', 'faTwitter', 'faYoutube'],
    },
  },
}
