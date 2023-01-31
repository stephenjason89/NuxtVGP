import { ApolloLink, Observable } from '@apollo/client/core'

// Inspired by https://github.com/rmosolgo/graphql-ruby/blob/master/javascript_client/src/subscriptions/PusherLink.ts
class PusherLink extends ApolloLink {
    constructor(options) {
        super()

        this.pusher = options.pusher
    }

    request(operation, forward) {
        const subscribeObservable = new Observable((_observer) => {
            //
        })

        // Capture the super method
        const prevSubscribe = subscribeObservable.subscribe.bind(subscribeObservable)

        // Override subscribe to return an `unsubscribe` object, see
        // https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L182-L212
        subscribeObservable.subscribe = (observerOrNext, onError, onComplete) => {
            prevSubscribe(observerOrNext, onError, onComplete)

            const observer = getObserver(observerOrNext, onError, onComplete)

            let subscriptionChannel

            forward(operation).subscribe({
                next: (data) => {
                    // If the operation has the subscription channel, it's a subscription
                    subscriptionChannel = data?.extensions?.lighthouse_subscriptions.channel ?? null

                    // No subscription found in the response, pipe data through
                    if (!subscriptionChannel) {
                        observer.next(data)
                        observer.complete()

                        return
                    }

                    this.subscribeToChannel(subscriptionChannel, observer)
                },
            })

            // Return an object that will unsubscribe_if the query was a subscription
            return {
                closed: false,
                unsubscribe: () => {
                    subscriptionChannel && this.unsubscribeFromChannel(subscriptionChannel)
                },
            }
        }

        return subscribeObservable
    }

    subscribeToChannel(subscriptionChannel, observer) {
        this.pusher.subscribe(subscriptionChannel).bind('lighthouse-subscription', (payload) => {
            if (!payload.more) {
                this.unsubscribeFromChannel(subscriptionChannel)

                observer.complete()
            }

            const result = payload.result

            if (result) {
                observer.next(result)
            }
        })
    }

    unsubscribeFromChannel(subscriptionChannel) {
        this.pusher.unsubscribe(subscriptionChannel)
    }
}

// Turn `subscribe` arguments into an observer-like thing, see getObserver
// https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L329-L343
function getObserver(observerOrNext, onError, onComplete) {
    if (typeof observerOrNext === 'function') {
        // Duck-type an observer
        return {
            next: (v) => observerOrNext(v),
            error: (e) => onError && onError(e),
            complete: () => onComplete && onComplete(),
        }
    } else {
        // Make an object that calls to the given object, with safety checks
        return {
            next: (v) => observerOrNext.next && observerOrNext.next(v),
            error: (e) => observerOrNext.error && observerOrNext.error(e),
            complete: () => observerOrNext.complete && observerOrNext.complete(),
        }
    }
}

export default PusherLink
