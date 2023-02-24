import { messageRoomFragment, messageRoomMessagesFragment } from './Fragment'

/**
 * User MessageRooms Query
 * */
export const userMessageRooms = gql`
    query userMessageRooms($userId: ID, $first: Int!, $after: String, $search: String) {
        user(id: $userId) {
            id
            name
            unreadMessageRooms
            message_rooms(first: $first, after: $after, search: $search) {
                edges {
                    node {
                        ...messageRoom
                        users {
                            id
                            name
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    startCursor
                }
            }
        }
    }
    ${messageRoomFragment}
`

/**
 * MessageRoom Query
 * */
export const messageRoom = gql`
    query messageRoom(
        $id: ID
        $MessageRoomConditions: QueryMessageRoomWhereWhereConditions
        $first: Int! = 30
    ) {
        messageRoom(id: $id, where: $MessageRoomConditions) {
            ...messageRoom
            ...messageRoomMessages
            users {
                id
                name
            }
        }
    }
    ${messageRoomFragment}
    ${messageRoomMessagesFragment}
`

/**
 * Upsert MessageRoom Mutation
 * */
export const upsertMessageRoom = gql`
    mutation upsertMessageRoom($input: MessageRoomInput) {
        upsertMessageRoom(input: $input) {
            ...messageRoom
            users {
                id
                name
            }
        }
    }
    ${messageRoomFragment}
`

/**
 * MessageRoom Upserted Subscription
 * */
export const messageRoomUpserted = gql`
    subscription onMessageRoomUpserted($input: MessageRoomUpsertedInput, $userId: ID!, $first: Int!) {
        messageRoomUpserted(input: $input) {
            ...messageRoom
            user(id: $userId) {
                id
                name
                unreadMessageRooms
                message_rooms(first: $first, after: "", search: "") {
                    edges {
                        node {
                            ...messageRoom
                            users {
                                id
                                name
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                        startCursor
                    }
                }
            }
        }
    }
    ${messageRoomFragment}
`

/**
 * Mark as read message_room
 * */
export const upsertUser = gql`
    mutation upsertUser($input: UserInput, $roomId: ID) {
        upsertUser(input: $input) {
            id
            name
            unreadMessageRooms
            message_room(id: $roomId) {
                ...messageRoom
            }
        }
    }
    ${messageRoomFragment}
`
