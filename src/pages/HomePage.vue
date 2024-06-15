<template>
  <div>
    <button @click="() => $router.push({ path: '/rooms' })" class="changePageButton">ルームを探す</button>
    <button @click="() => $router.push({ path: '/rooms/create' })"  class="changePageButton">ルームを作成</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.changePageButton{
  margin:10px;
}
</style>
