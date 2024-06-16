<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api, { EnterRoom } from '@/lib/apis'
import router from '@/router'

import { useStoreUser } from '@/stores/user'
const store = useStoreUser()
// 部屋に入る前のページ
// 必須: 名前
// private -> 合言葉の入力欄
// 名前を適切に設定 && 合言葉が正しい -> IndividualRoom へ
// 名前に被り || 合言葉が不正 -> 失敗を表示して再入力へ

const thisRoomId = ref('')
const userNickName = ref('')
const roomPassword = ref('')
const submitError = ref(false)
const userSettingError = ref(false)
const submit = async () => {
  const enterInfo: EnterRoom = {
    userName: userNickName.value,
    password: roomPassword.value,
  }
  try {
    // enterRoom を送る
    const resp = await api.apiRoomRoomIdEnterPost(thisRoomId.value, enterInfo)
    // ここで resp から userId と userName を持たせて IndividualRoom へ

    submitError.value = false
    // stores/user に userId と userName を記録して、 /rooms/:id に移動させる
    const userId = resp.data.userId
    store.setUser(resp.data.userName, userId)
    router.push({ path: `/rooms/${thisRoomId.value}` })
  } catch (e) {
    // 通信エラー or userNameエラー or password エラー
    console.error(e)
    submitError.value = true
  }
}

const isPrivate = computed(() => 'isPrivate' in router.currentRoute.value.query)

onMounted(() => {
  const roomId = router.currentRoute.value.params.id
  if (typeof roomId == 'string') {
    thisRoomId.value = roomId
  } else {
    console.error('Invalid RoomId type')
  }
  const queryPassword = router.currentRoute.value.query['password']
  if (typeof queryPassword == 'string') {
    roomPassword.value = queryPassword
  }
})
</script>
<template>
  <div class="enterRoomContents">
    <h2>部屋に入る</h2>
    <p>部屋ID: {{ thisRoomId }}</p>
    <p>この部屋で使うニックネームを設定してください。</p>
    <table class="widthMax">
      <label class="widthMax">
        <tr class="widthMax">
          <th>ニックネーム</th>
          <td class="Td">
            <input v-model="userNickName" class="enterRoomInputText" />
          </td>
        </tr>
      </label>
      <label v-if="isPrivate" class="widthMax">
        <tr class="widthMax">
          <th>合言葉</th>
          <td class="Td">
            <input v-model="roomPassword" class="enterRoomInputText" />
          </td>
        </tr>
      </label>
    </table>
    <div style="text-align: right">
      <button class="enterRoomButton" @click="submit()">作成</button>
    </div>
    <div v-if="userSettingError">
      <p>ニックネームが使用不可能。もしくは間違った合言葉です。</p>
    </div>
    <div v-if="submitError">
      <p>エラーが発生しました。操作をやり直してください。</p>
    </div>
  </div>
</template>
<style scoped>
.read-the-docs {
  color: #888;
}
.err {
  color: red;
}
.Td {
  width: calc(100% - 70px);
  display: inline-block;
}
.widthMax {
  width: 100%;
  display: inline-block;
}
.enterRoomContents {
  margin: 20px;
}
.enterRoomInputCheckBox {
  accent-color: #78996f;
}
.enterRoomInputLabel {
  margin-right: 90px;
}
.enterRoomInputText {
  width: 100%;
}
.enterRoomButton {
  font-weight: bold;
  width: 100px;
  height: 50px;
  margin: 10px;
  margin-right: 30px;
}
</style>
