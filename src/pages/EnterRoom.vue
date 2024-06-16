<script setup lang="ts">
import { ref,onMounted } from 'vue'
import api,{EnterRoom} from '@/lib/apis'
import router from '@/router';

// 部屋に入る前のページ
// 必須: 名前
// private -> 合言葉の入力欄
// 名前を適切に設定 && 合言葉が正しい -> IndividualRoom へ
// 名前に被り || 合言葉が不正 -> 失敗を表示して再入力へ

const thisRoomId=ref('')
const userNickName=ref('')
const roomPassword=ref('')
const errMsg=ref('')
const submit = async () => {
  const enterInfo:EnterRoom={
    "userName": userNickName.value,
    "password": roomPassword.value
  }
  try{
    // enterRoom を送る
     const resp = (await api.apiRoomRoomIdEnterPost(thisRoomId.value,enterInfo)).data
    // ここで resp から userId と userName を持たせて IndividualRoom へ
    userNickName.value=resp.userName
    const userId=resp.userId
    userNickName.value=resp.userName
    // stores/user に userId と userName を記録して、 /rooms/:id に移動させる
     router.push(
      {path: `/rooms/${thisRoomId}`}
     )
  }catch (e){
    // 通信エラー or userNameエラー or password エラー
    console.error(e)
  }
}

onMounted(
  ()=>{
    const roomId=router.currentRoute.value.params.id
    if(typeof roomId == 'string'){
      thisRoomId.value=roomId
    }else{
      console.error("Invalid RoomId type")
    }
    const queryPassword=router.currentRoute.value.query['password']
    if(typeof queryPassword == 'string'){
      roomPassword.value=queryPassword
    }
  }

)
</script>
<template>
<h1>
  部屋に入る
</h1>
<p>部屋ID: {{ thisRoomId }}</p>
<p>この部屋で使うニックネームを設定してください。</p>
<p>
  <label>
    ニックネーム
    <input v-model="userNickName">
  </label>
</p>
<p>
  <label>
    合言葉
    <input v-model="roomPassword">
  </label>
</p>

<p><button @click="submit">参加</button></p>

<p>{{ errMsg }}</p>
</template>