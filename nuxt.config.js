// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL,
        },
    },
    imports: {
        dirs: ['stores'],
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@kevinmarrec/nuxt-pwa',
        'nuxt-icon',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        // 增加授权 不支持nuxt3
        // '@nuxtjs/axios',
        // '@nuxtjs/auth-next'
        '@sidebase/nuxt-auth'
    ],
    auth: {
        isEnabled: true,
        origin: process.env.ORIGIN,
        basePath: '/api/auth',
        enableSessionRefreshPeriodically: false,
        globalAppMiddleware: false,
        defaultProvider: undefined,
        addDefaultCallbackUrl: true,
        globalMiddlewareOptions: {
            // Whether to allow access to 404 pages without authentication. Set this to `false` to force users to sign-in before seeing `404` pages. Setting this to false may lead to vue-router problems (as the target page does not exist)
            allow404WithoutAuth: true,
            // Whether to automatically set the callback url to the page the user tried to visit when the middleware stopped them. This is useful to disable this when using the credentials provider, as it does not allow a `callbackUrl`. Setting this to a string-value will result in that being used as the callbackUrl path. Note: You also need to set the global `addDefaultCallbackUrl` setting to `false` if you want to fully disable this for the global middleware.
            addDefaultCallbackUrl: true
        },
        enableGlobalAppMiddleware: true
    },
    css: [
        {
            src: '~/node_modules/highlight.js/styles/base16/dracula.css',
            lang: 'css',
        },
    ],
    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
    },
    pwa: {
        icon: {
            source: './public/icon.jpg',
            maskablePadding: 0,
        },
        meta: {
            name: 'Fisher Chat Bot',
            description: 'Multiple AI Web Chat Client',
            theme_color: '#7733ff',
            mobileAppIOS: true,
            nativeUI: true,
        },
        manifest: {
            name: 'Fisher Chat Bot',
            description: 'Multiple AI Web Chat Client',
            background_color: '#7733ff',
            lang: 'en',
            useWebmanifestExtension: false,
        },
    },
});
