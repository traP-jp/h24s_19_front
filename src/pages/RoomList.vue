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
  <div>
    <div v-for="room in rooms" :key="room.roomId">
      <div
        v-if="room.roomId && typeof room.isPublic == 'boolean'"
        class="roomListForms"
      >
        <!-- 下のpathは選択した部屋に入るページに飛ぶようにする -->
        <button
          @click="
            () => {
              enterRoom(room)
            }
          "
        >
          <div v-if="room.isPublic">フリールーム</div>
          <div v-if="!room.isPublic">プライベートルーム</div>
          {{ room.roomName }}, {{ room.userCount }}人参加中
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.roomListForms {
  margin: 10px;
}
</style>
