<script setup lang="ts">
import { ref } from 'vue'
import api, { PostRoom } from '@/lib/apis'
import router from '@/router'

// 部屋を作る
// 必須: 部屋の名前, open/private 選択
// private -> passwordも必要
const isPublic = ref(true)
const newRoomName = ref('')
const roomPassword = ref('')
const errorMsg = ref('')

const submit = async () => {
  if (newRoomName.value == '') {
    errorMsg.value = '部屋名を設定してください'
  } else if (!isPublic.value && !roomPassword.value) {
    errorMsg.value = '合言葉を設定してください'
  } else {
    // 全ての設定がOK
    errorMsg.value = ''
    const roomInfo: PostRoom = {
      isPublic: isPublic.value,
      roomName: newRoomName.value,
      password: roomPassword.value,
    }
    try {
      const resp = await api.apiRoomPost(roomInfo)
      const roomId = resp.data.roomId

      let query = undefined
      if (!isPublic.value) {
        query = { password: roomPassword.value, isPrivate: 1 }
      }

      router.push({
        path: `/rooms/${roomId}/enter`,
        query,
      })
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<template>
  <h1 id="title">部屋を作る</h1>
  <label>
    部屋を全体公開する
    <input v-model="isPublic" type="checkbox" />
  </label>
  <label>
    <p>
      部屋名
      <input v-model="newRoomName" type="text" />
    </p>
  </label>
  <label v-if="!isPublic">
    <p>
      合言葉
      <input v-model="roomPassword" type="text" />
    </p>
  </label>
  <div>
    <h2>現在の設定</h2>
    <p>部屋名: {{ newRoomName }}</p>
    <p>
      部屋を全体公開
      <span v-if="isPublic">する</span>
      <span v-else>しない</span>
    </p>
    <p v-if="!isPublic">合言葉: {{ roomPassword }}</p>
  </div>
  <button @click="submit()">作成する</button>
  <div class="err">
    {{ errorMsg }}
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.err {
  color: red;
}
</style>
