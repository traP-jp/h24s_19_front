<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api, { GetRoomsInner } from '@/lib/apis'

const rooms = ref<GetRoomsInner[]>([])
onMounted(async () => {
  const res = await api.apiRoomsGet()
  rooms.value = res.data
})

const router = useRouter()
const enterRoom = (room: GetRoomsInner) => {
  let query = undefined
  if (!room.isPublic) {
    query = { isPrivate: 1 }
  }
  router.push({ path: '/rooms/' + room.roomId + '/enter', query })
}
</script>

<template>
  <div class="roomListContents">
    <h2>部屋一覧</h2>
    <p>プライベートルームに入るには合言葉が必要です</p>
    <div class="roomListForms">
      <div v-for="room in rooms" :key="room.roomId"
      >
        <!-- 下のpathは選択した部屋に入るページに飛ぶようにする -->
        <button
          @click="
            () => {
              enterRoom(room)
            }
          "
          class="roomListForm"
        >
          <div v-if="room.roomName.length <= 20"
            class="roomListFormName"
          >
            {{ room.roomName }}
            <img v-if="!room.isPublic" src="@/assets/lock.svg" alt="Lock SVG" class="lockImg" />
          </div>
          <div v-if="room.roomName.length > 20"
            class="roomListFormName"
          >
            {{ room.roomName.substring(0,19) }}...
            <img v-if="!room.isPublic" src="@/assets/lock.svg" alt="Lock SVG" class="lockImg" />
          </div>
          <div class="roomListFormNum">{{ room.userCount }}人が参加中</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.roomListContents{
  margin: 20px;
}
.roomListForms{
  display: flex;
	flex-wrap: wrap;
	padding: 20px;
}
.roomListForm {
  margin: 5px;
  width: 200px;
  height: 70px;
}
.roomListFormName{
  font-weight: bold;
}
.lockImg{
  width: 10px;
  height: 10px;
}
.roomListFormNum{
  margin-top: 5px;
  font-size: 60%;
}
</style>
