<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api,{GetRoomsInner,EnterRoom,EnterRoomSuccess} from '../lib/apis'
import { useStoreUser } from '@/stores/user';

const User = useStoreUser();
const rooms =ref<GetRoomsInner[]>([])
const selectedRoomName = ref("")
const selectedRoomId = ref("")
const isSelectedRoomPublic = ref(true)
const userName = ref("")
const password = ref("")
const isRoomSelected=ref(false)

onMounted(async () => {
  const res = await api.apiRoomsGet()
    rooms.value = res.data
})
function BackSelectPage(roomName: string,roomId: string, isPublic: boolean){
  selectedRoomName.value = ""
  selectedRoomId.value = ""
  isSelectedRoomPublic.value = true
  isRoomSelected.value = false
}
function GoAskPage(roomName: string,roomId: string, isPublic: boolean){
  selectedRoomName.value = roomName
  selectedRoomId.value = roomId
  isSelectedRoomPublic.value = isPublic
  isRoomSelected.value = true
}
const user = ref<EnterRoomSuccess>({userId: "",userName: "" })
async function EnterSelectedRoom(roomId: string){
  const data = ref<EnterRoom>({userName:userName.value,password: password.value})
  
  const res = await api.apiRoomRoomIdEnterPost(roomId,data.value)
  user.value = res.data
  User.$patch({
    userName: res.data.userName,
    userId: res.data.userId,
  });
}
</script>

<template>
  <div v-if="!isRoomSelected">
    <div v-for="room in rooms" :key="room.roomId">
      <div v-if="room.roomName && room.roomId && typeof(room.isPublic) =='boolean'" class="roomListForms">
        <button @click="GoAskPage(room.roomName,room.roomId,room.isPublic)"><div v-if="!room.isPublic">プライベートルーム</div><div v-if="room.isPublic">フリールーム</div>{{ room.roomName }}, {{ room.userCount }}人参加中</button>
      </div>
    </div>
  </div>
  <div v-if="isRoomSelected">
    <h2>{{ selectedRoomName }}に入る</h2>
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
    <button @click="BackSelectPage" class="roomListForms">戻る</button>
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
