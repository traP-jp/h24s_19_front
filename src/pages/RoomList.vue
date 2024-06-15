<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { stringifyQuery } from 'vue-router';
import api,{GetRoomsInner,EnterRoom,EnterRoomSuccess} from '@/lib/apis'

const rooms =ref<GetRoomsInner[]>([])
const selectedRoomId = ref("")
const isSelectedRoomPublic = ref(true)
const userName = ref("")
const password = ref("")
const isRoomSelected=ref(false)

onMounted(async () => {
  const res = await api.apiRoomsGet()
    rooms.value = res.data
})
function AskNames(roomId: string, isPublic: boolean){
  selectedRoomId.value = roomId
  isSelectedRoomPublic.value = isPublic
  isRoomSelected.value = true
}
const user = ref<EnterRoomSuccess>({userId: "",userName: "" })
function EnterSelectedRoom(roomId: string){
  const data = ref<EnterRoom>({userName:userName.value,password: password.value})
  
  onMounted(async () => {
    const res = await api.apiRoomRoomIdEnterPost(roomId,data.value)
      user.value = res.data
      //IndividualRoomにuser送る？？？？？
  })
}
</script>

<template>
  <div v-if="!isRoomSelected">
    <div v-for="room in rooms" :key="room.roomId">
      <div v-if="room.roomId && typeof(room.isPublic) =='boolean'" class="roomListForms">
        <button @click="AskNames(room.roomId,room.isPublic)">{{room.isPublic}}, {{ room.roomName }}, {{ room.userCount }}人参加中</button>
      </div>
    </div>
  </div>
  <div v-if="isRoomSelected">
    <label class="roomListForms">
      handle name
      <input v-model="userName" />
    </label>
    <br>
    <label v-if="!isSelectedRoomPublic" class="roomListForms">
      password
      <input v-model="password" />
    </label>
    <br>
    <button @click="EnterSelectedRoom(selectedRoomId)" class="roomListForms">ルームに入る</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.roomListForms{
  margin:10px
}
</style>
