<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div>
    <router-link to="/rooms">ルームを探す</router-link>　
    <router-link to="/rooms/create">ルームを作成</router-link>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
