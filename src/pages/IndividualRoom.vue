<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Post, useIndividualRoom } from '@/stores/individualRoom'
import ThumbUpIcon from '@/icons/ThumbUpIcon.vue'
import ReportIcon from '@/icons/ReportIcon.vue'
import { useStoreUser } from '@/stores/user'

const router = useRouter()
const roomId = computed(() =>
  Array.isArray(router.currentRoute.value.params.id)
    ? router.currentRoute.value.params.id[0]
    : router.currentRoute.value.params.id
)

const individualRoomStore = useIndividualRoom()
const posts = computed(() => individualRoomStore.state.posts)

const userStore = useStoreUser()
const userId = computed(() => userStore.$state.userId)

onMounted(async () => {
  try {
    await individualRoomStore.connect(roomId.value)
  } catch (e) {
    console.error(e)
  }
})

const postWordInput = ref('')
const postReadingInput = ref('')
const postWord = () => {
  individualRoomStore.sendPost(postWordInput.value, postReadingInput.value)
}

const goodWord = (post: Post) => {
  // TODO: デバウンス入れて連打時のリクエスト回数減らしたい
  individualRoomStore.goodPost(post, 1)
}

const reportWord = (post: Post) => {
  individualRoomStore.reportPost(post)
}
</script>

<template>
  <div class="container">
    <div class="posted-word-container">
      <div v-for="post in posts" :key="post.wordId" class="word-card">
        <span class="user-name">{{ post.senderName }}</span>
        <span class="word">{{ `${post.word} (${post.reading})` }}</span>
        <div class="word-footer">
          <span>{{ `基礎点: ${post.basicScore}` }}</span>
          <div class="icons-container">
            <div class="thumb-container">
              <ThumbUpIcon
                :class="{ 'icon-disabled': userId === post.senderId }"
                :color="userId === post.senderId ? '#a8d89c' : '#24A005'"
                @click="() => goodWord(post)"
              />
              <span>{{ post.additionalScore }}</span>
            </div>
            <ReportIcon
              :class="{ 'icon-disabled': userId === post.senderId }"
              :color="userId === post.senderId ? '#c15353' : '#FF0000'"
              @click="() => reportWord(post)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="input-container">
      <div class="input-area">
        <label class="input-label">
          {{ '単語' }}
          <input v-model="postWordInput" type="text" />
        </label>
        <label class="input-label">
          {{ '単語の読み' }}
          <input v-model="postReadingInput" type="text" />
        </label>
      </div>
      <button @click="postWord">
        {{ '送信' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.posted-word-container {
  overflow-y: auto;
  contain: strict;
  height: 100%;
  width: 100%;
  flex-grow: 1;
}
.posted-word-container > * {
  padding: 10px 0;
}
.posted-word-container > :not(:last-child) {
  border-bottom: 2px solid #d9d9d9;
}

.word-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
}

.word {
  font-size: 15px;
}

.word-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5b5b5b;
  font-size: 12px;
}

.icons-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.thumb-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-disabled {
  cursor: not-allowed;
}

.input-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 10px 0;
  gap: 10px;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.input-label {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 4px;
  width: 100%;
  font-size: 20px;
}
</style>
