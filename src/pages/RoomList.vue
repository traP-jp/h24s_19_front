<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api, { GetRoomsInner } from '@/lib/apis'

const rooms = ref<GetRoomsInner[]>([])
onMounted(async () => {
  const res = await api.apiRoomsGet()
  rooms.value = res.data
})
</script>

<template>
<div>
  <div v-for="room in rooms" :key="room.roomId">
    <div
      class="roomListForms"
      v-if="room.roomId && typeof(room.isPublic) == 'boolean'"
    >
      <!-- 下のpathは選択した部屋に入るページに飛ぶようにする -->
      <button
        @click="
          () => {
            $router.push({ path: '/room/' + room.roomId + '/enter' })
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
