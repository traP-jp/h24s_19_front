<script setup lang="ts">
import { ref,onMounted } from 'vue'
import api,{EnterRoom} from '@/lib/apis'
import router from '@/router';

import {useRoomStore} from '@/stores/room'
const store=useRoomStore()
// 部屋に入る前のページ
// 必須: 名前
// private -> 合言葉の入力欄
// 名前を適切に設定 && 合言葉が正しい -> IndividualRoom へ
// 名前に被り || 合言葉が不正 -> 失敗を表示して再入力へ

const thisRoomId=ref('')
const userNickName=ref('')
const roomPassword=ref('')
const submitError=ref(false)
const userSettingError=ref(false)
const submit = async () => {
  const enterInfo:EnterRoom={
    "userName": userNickName.value,
    "password": roomPassword.value
  }
  try{
    // enterRoom を送る
     const resp = (await api.apiRoomRoomIdEnterPost(thisRoomId.value,enterInfo))
    // ここで resp から userId と userName を持たせて IndividualRoom へ
    if(resp.status==200){
      userNickName.value=resp.data.userName
      const userId=resp.data.userId
      userNickName.value=resp.userName
      store.setName(userNickName.value)
      submitError.value=false
      // stores/user に userId と userName を記録して、 /rooms/:id に移動させる
      router.push(
        {path: `/rooms/${thisRoomId.value}`}
      )
    }else{
      userSettingError.value=true
    }
  }catch (e){
    // 通信エラー or userNameエラー or password エラー
    console.error(e)
    submitError.value=true
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
<div v-if="userSettingError">
  <p>ニックネームが使用不可能。もしくは間違った合言葉です。</p>
</div>
<div v-if="submitError">
  <p>エラーが発生しました。操作をやり直してください。</p>
</div>
</template>