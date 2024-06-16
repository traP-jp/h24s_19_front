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
    : router.currentRoute.value.params.id,
)

const individualRoomStore = useIndividualRoom()
const posts = computed(() => individualRoomStore.state.posts)

const userStore = useStoreUser()
const userName = computed(() => userStore.$state.userName)

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
  postWordInput.value = ''
  postReadingInput.value = ''
}

const goodWord = (post: Post) => {
  // TODO: デバウンス入れて連打時のリクエスト回数減らしたい
  individualRoomStore.goodPost(post, 1)
}

const reportWord = (post: Post) => {
  individualRoomStore.reportPost(post)
}

const ranking = computed(() => {
  if (individualRoomStore.state.ws === null) {
    return []
  }

  const ranking: { name: string; score: number }[] = []
  for (const userName of Object.keys(individualRoomStore.state.userScoreMap)) {
    ranking.push({
      name: userName,
      score: individualRoomStore.state.userScoreMap[userName],
    })
  }
  ranking.sort((a, b) => b.score - a.score)
  return ranking
})
</script>

<template>
  <div class="container">
    <div class="post-area-container">
      <div class="posted-word-container">
        <div v-for="post in posts" :key="post.wordId" class="word-card">
          <span class="user-name">{{ post.userName }}</span>
          <span class="word">{{ `${post.word} (${post.reading})` }}</span>
          <div class="word-footer">
            <span>{{ `基礎点: ${post.basicScore}` }}</span>
            <div class="icons-container">
              <div class="thumb-container">
                <ThumbUpIcon
                  :class="{ 'icon-disabled': userName === post.userName }"
                  :color="userName === post.userName ? '#a8d89c' : '#24A005'"
                  @click="() => goodWord(post)"
                />
                <span>{{ post.additionalScore }}</span>
              </div>
              <ReportIcon
                :class="{ 'icon-disabled': userName === post.userName }"
                :color="userName === post.userName ? '#c15353' : '#FF0000'"
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

    <div class="ranking-container">
      <div class="ranking-title">{{ 'ランキング' }}</div>
      <div class="ranking-list">
        <div
          v-for="(user, index) in ranking"
          :key="user.name"
          class="ranking-individual"
        >
          <div>
            <span :style="{ fontWeight: 'bold', marginRight: '16px' }">
              {{ `${index + 1}位` }}
            </span>
            <span>{{ user.name }}</span>
          </div>
          <span>{{ `${user.score}点` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 400px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.post-area-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 20px;
  margin-right: 10px;
  box-sizing: border-box;
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

.ranking-container {
  width: 100%;
  overflow-y: auto;
  padding: 10px;
  margin: 10px;
  border-left: 2px solid #5b5b5b;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
}

.ranking-title {
  font-size: 25px;
  font-weight: bold;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ranking-individual {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}
</style>
