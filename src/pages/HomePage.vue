<template>
  <div>
    <button
      class="changePageButton"
      @click="() => $router.push({ path: '/rooms' })"
    >
      ルームを探す
    </button>
    <button
      class="changePageButton"
      @click="() => $router.push({ path: '/rooms/create' })"
    >
      ルームを作成
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.changePageButton {
  margin: 10px;
}
</style>
