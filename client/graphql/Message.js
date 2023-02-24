import { messageRoomFragment, messageRoomMessagesFragment } from './Fragment'

/* Queries */
export const messagesPaginate = gql`
    query messagePaginate(
        $first: Int!
        $MessageCondition: QueryMessagesPaginateWhereWhereConditions!
        $after: String
    ) {
        messagesPaginate(first: $first, where: { AND: [$MessageCondition] }, after: $after) {
            edges {
                cursor
                node {
                    id
                    content
                    user {
                        id
                        name
                    }
                }
            }

            pageInfo {
                hasNextPage
                startCursor
                endCursor
            }
        }
    }
`

export const upsertMessage = gql`
    mutation upsertMessage($input: MessageInput, $messageRoomId: ID, $first: Int! = 30) {
        upsertMessage(input: $input) {
            id
            content
            user {
                id
                name
                unreadMessageRooms
                message_room(id: $messageRoomId) {
                    ...messageRoom
                    ...messageRoomMessages
                }
            }
            created_at
            updated_at
        }
    }
    ${messageRoomFragment}
    ${messageRoomMessagesFragment}
`

export const messageUpserted = gql`
    subscription onMessageUpserted($input: MessageUpsertedInput, $userId: ID) {
        messageUpserted(input: $input) {
            id
            content
            created_at
            updated_at
            user {
                id
                name
            }
            room(userId: $userId) {
                ...messageRoom
                users {
                    id
                    name
                }
            }
            subscriber(id: $userId) {
                id
                name
                unreadMessageRooms
            }
        }
    }
    ${messageRoomFragment}
`
