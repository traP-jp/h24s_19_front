import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStoreUser } from './user'

type IndividualRoomState =
  | {
      ws: null
      roomId: undefined
      posts: []
      rejectedPosts: []
      userScoreMap: {}
    }
  | {
      ws: WebSocket
      roomId: string
      posts: Post[]
      rejectedPosts: RejectedPostResponse[]
      userScoreMap: Record<string, number>
    }

interface BasicPost {
  wordId: string
  word: string
  reading: string
  basicScore: number
  senderId: string
  senderName: string
}

export interface Post extends BasicPost {
  additionalScore: number
  totalScore: number
  isInvalid: boolean
}

interface RejectedPostResponse {
  type: 'post_word_rejected'
  word: string
  reading: string
}

interface PostedWord extends BasicPost {
  type: 'posted_word'
}

interface ScoreChangeResponse {
  // いいねや通報で得点が変動した時
  type: 'score_change'
  wordId: string
  additionalScore: number
  basicScore: number
  totalScore: number
  isInvalid: boolean
}

type WebSocketResponse = PostedWord | RejectedPostResponse | ScoreChangeResponse

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'h24s-19.trap.show/server'
    : 'ws://localhost:3000'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const websocketUrl = () => `${BASE_URL}/api/ws`

export const useIndividualRoom = defineStore('individualRoom', () => {
  const initialState: IndividualRoomState = {
    ws: null,
    roomId: undefined,
    posts: [] as [],
    rejectedPosts: [] as [],
    userScoreMap: {},
  }

  const state = ref<IndividualRoomState>(initialState)

  const userStore = useStoreUser()

  const connect = (roomId: string) => {
    // cookie のセット
    document.cookie = 'userId=; max-age=0'
    document.cookie = 'roomID=; max-age=0'
    document.cookie = `userId=${userStore.$state.userId}`
    document.cookie = `roomID=${roomId}`

    const ws = new WebSocket(websocketUrl())
    ws.onopen = () => {
      console.log('connected')
      state.value = {
        ws,
        roomId,
        posts: [],
        rejectedPosts: [],
        userScoreMap: {},
      }
    }

    ws.onclose = () => {
      console.log('disconnected')
      state.value = initialState
    }

    ws.onmessage = (event) => {
      if (state.value.ws === null) {
        throw new Error('WebSocket is not connected')
      }
      console.log('message', event.data)

      const data: WebSocketResponse = JSON.parse(event.data)
      switch (data.type) {
        case 'posted_word':
          state.value.posts.push({
            ...data,
            additionalScore: 0,
            totalScore: data.basicScore,
            isInvalid: false,
          })
          userScoreChange(data.senderName, data.basicScore)
          break
        case 'post_word_rejected':
          state.value.rejectedPosts.push(data)
          break
        case 'score_change':
          const post = state.value.posts.find(
            (post) => post.wordId === data.wordId,
          )
          if (post === undefined) {
            throw new Error('Post not found')
          }

          userScoreChange(post.senderName, data.totalScore - post.totalScore)

          post.additionalScore = data.additionalScore
          post.basicScore = data.basicScore
          post.totalScore = data.totalScore
          post.isInvalid = data.isInvalid
          break
        default:
          throw new Error('Unknown message type')
      }
    }
  }

  const close = () => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }
    state.value.ws.close()
  }

  const sendPost = (word: string, reading: string) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }
    state.value.ws.send(
      JSON.stringify({ type: 'postWord', args: { word, reading } }),
    )
  }

  const reportPost = (post: Post) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }

    if (post.senderId === userStore.userId) {
      return
    }

    state.value.ws.send(
      JSON.stringify({ type: 'reportWord', args: { wordId: post.wordId } }),
    )
  }

  const goodPost = (post: Post, score: number) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }

    if (post.senderId === userStore.userId) {
      return
    }

    state.value.ws.send(
      JSON.stringify({
        type: 'goodWord',
        args: { wordId: post.wordId, score },
      }),
    )
  }

  const userScoreChange = (userName: string, score: number) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }

    const prevScore = state.value.userScoreMap[userName] || 0
    state.value.userScoreMap[userName] = prevScore + score
  }

  return {
    state,
    connect,
    close,
    sendPost,
    reportPost,
    goodPost,
  }
})
