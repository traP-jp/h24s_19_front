import { ref } from 'vue'
import { defineStore } from 'pinia'

type IndividualRoomState =
  | {
      ws: null
    }
  | {
      ws: WebSocket
      roomId: string
      posts: Post[]
      rejectedPosts: RejectedPostResponse[]
    }

interface BasicPost {
  wordId: number
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
  wordId: number
  additionalScore: number
  basicScore: number
  totalScore: number
  isInvalid: boolean
}

type WebSocketResponse = PostedWord | RejectedPostResponse | ScoreChangeResponse

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'wss://trap.show/h24s_19_server'
    : 'ws://localhost:3000'
const websocketUrl = (roomId: string) => `${BASE_URL}/api/ws/${roomId}`

export const useIndividualRoom = defineStore('individualRoom', () => {
  const state = ref<IndividualRoomState>({
    ws: null,
  })

  const connect = (roomId: string) => {
    const ws = new WebSocket(websocketUrl(roomId))
    ws.onopen = () => {
      console.log('connected')
      state.value = { ws, roomId, posts: [], rejectedPosts: [] }
    }

    ws.onclose = () => {
      console.log('disconnected')
      state.value = { ws: null }
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

  const reportPost = (wordId: number) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }
    state.value.ws.send(
      JSON.stringify({ type: 'reportWord', args: { wordId } }),
    )
  }

  const goodPost = (wordId: number, score: number) => {
    if (state.value.ws === null) {
      throw new Error('WebSocket is not connected')
    }
    state.value.ws.send(
      JSON.stringify({ type: 'goodWord', args: { wordId, score } }),
    )
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
