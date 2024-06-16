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
      router.push({
        path: `/rooms/${roomId}`,
        query: { password: roomPassword.value },
      })
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<template>
  <div class="createRoomContents">
    <h2 id="title">部屋を作る</h2>
    <table class="widthMax">
      <tr>
      <label>
        <th>部屋を全体公開する</th>
        <td><input v-model="isPublic" type="checkbox" class="createRoomInputCheckBox" /></td>
      </label>
      </tr>
      <tr class="widthMax">
        <label class="widthMax">
        <th><span class="createRoomInputLabel">部屋名</span></th>
        <td class="Td"><input v-model="newRoomName" type="text" placeholder="roomname" class="createRoomInputText" /></td>
      </label>
      </tr>
      <tr class="widthMax">
        <label v-if="!isPublic" class="widthMax">
          <th><span class="createRoomInputLabel">合言葉</span></th>
          <td class="Td"><input v-model="roomPassword" type="text" placeholder="password" class="createRoomInputText" /></td>
        </label>
      </tr>
      </table>
          <div style="text-align: right;">
            <button @click="submit()" class="createRoomButton">作成</button>
          </div>

  </div>
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
.Td{
  width: calc(100% - 70px);
  display: inline-block;
}
.widthMax{
  width: 100%;
  display: inline-block;
}
.createRoomContents{
  margin: 20px;
}
.createRoomInputCheckBox{ 
  accent-color: #78996f

}
.createRoomInputLabel{
  margin-right: 90px;
}
.createRoomInputText{ 
  width: 100%;
}
.createRoomButton{
  font-weight: bold;
  width: 100px;
  height: 50px;
  margin: 10px;
  margin-right: 30px;
}
</style>
