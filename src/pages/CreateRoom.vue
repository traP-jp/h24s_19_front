<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// 部屋を作る
// 必須: 部屋の名前, open/private 選択
// private -> passwordも必要

// const baseUrl=''
const isPublic = ref(true)
const roomName = ref('')
const roomPassrowd = ref('')
const errorMsg = ref('')

const submit = () => {
  if (roomName.value == '') {
    errorMsg.value = '部屋名を設定してください'
  } else if (!isPublic.value && !roomPassrowd.value) {
    errorMsg.value = '合言葉を設定してください'
  } else {
    // 全ての設定がOK
    // errorMsg.value=''
    // const url=baseUrl+"/api/room"
    // const roominfo=JSON.stringify({
    //   "isPublic": isPublic.value,
    //   "name": roomName.value,
    //   "password": roomPassrowd.value
    // })
    // res,err =post(url,body)
    const roomId = 'xxxx'
    router.push({
      path: `/rooms/${roomId}`,
      query: { password: roomPassrowd.value },
    })
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
      <input v-model="roomName" type="text" />
    </p>
  </label>
  <label v-if="!isPublic">
    <p>
      合言葉
      <input v-model="roomPassrowd" type="text" />
    </p>
  </label>
  <div>
    <h2>現在の設定</h2>
    <p>部屋名: {{ roomName }}</p>
    <p>
      部屋を全体公開
      <span v-if="isPublic">する</span>
      <span v-else>しない</span>
    </p>
    <p v-if="!isPublic">合言葉: {{ roomPassrowd }}</p>
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
