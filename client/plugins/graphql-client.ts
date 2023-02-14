import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client/core'
// import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist'
// import localforage from 'localforage'
import { createApolloProvider } from '@vue/apollo-option'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import Pusher from 'pusher-js'
import { onError } from '@apollo/client/link/error'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig } from '#app'
import PusherLink from '~/plugins/graphql/pusher'

export default defineNuxtPlugin((nuxtApp) => {
    const auth = useAuth()
    const runtimeConfig = useRuntimeConfig()
    const event = useRequestEvent()
    const cache = new InMemoryCache()
    // if (process.client) {
    //     const persistor = new CachePersistor({
    //         cache,
    //         storage: new LocalForageWrapper(localforage),
    //     })
    //
    //     if (window.navigator.onLine) {
    //         persistor.purge().then(() => console.log('New apollo cache ready'))
    //     } else {
    //         persistor.restore()
    //         console.log('Using old cache for offline mode')
    //     }
    // }

    const authFetch = async (uri: string, options: any) => {
        if (auth.userId) {
            if (auth.isTokenExpired() && auth.isRefreshTokenExpired()) {
                auth.logout(true)
                return { text: () => Promise.resolve('{data:{}}') }
            } else if (auth.isTokenExpired()) await auth.refresh()
            options.headers.authorization = auth.token
        }
        return fetch(uri, options)
    }

    const host = event?.node?.req?.headers?.host ?? location.hostname
    const subdomain = getSubdomain(host)

    const link = ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                )
            if (networkError) console.log(`[Network error]: ${networkError}`)
        }),
        ...(process.client
            ? [
                  new PusherLink({
                      pusher: new Pusher(runtimeConfig.pusherKey, {
                          auth: {
                              params: {},
                              headers: { 'X-Tenant': subdomain },
                          },
                          cluster: runtimeConfig.public.pusherCluster,
                          wsHost: runtimeConfig.public.wsHostname,
                          wsPort: +runtimeConfig.public.wsPort,
                          wssPort: +runtimeConfig.public.wsPort,
                          forceTLS: false,
                          disableStats: true,
                          authEndpoint: `${runtimeConfig.public.graphqlEndpoint}/graphql/subscriptions/auth`,
                          enabledTransports: ['ws', 'wss'],
                      }),
                  }),
              ]
            : []),
        new BatchHttpLink({
            uri: `${runtimeConfig.public.graphqlEndpoint}/graphql`,
            headers: { 'X-Tenant': subdomain, Authorization: auth.token },
            fetch: authFetch as WindowOrWorkerGlobalScope['fetch'],
            batchDebounce: true,
        }),
    ])

    const apolloClient = new ApolloClient({
        link,
        cache,
        assumeImmutableResults: true,
        ...(process.server ? { ssrMode: true } : { ssrForceFetchDelay: 100 }),
    })

    nuxtApp.hook('app:rendered', () => (nuxtApp.payload.data.apollo = cache.extract() as any))
    if (process.client && window?.__NUXT__?.data.apollo) cache.restore(window?.__NUXT__.data.apollo)
    const apolloProvider = createApolloProvider({ defaultClient: apolloClient })

    provideApolloClient(apolloClient)
    nuxtApp.provide('$apollo', { DefaultApolloClient, apolloClient })
    nuxtApp.vueApp.use(apolloProvider)
})
