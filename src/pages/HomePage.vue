<template>
  <div class="homePageContents">
    <button
      class="changePageButton"
      @click="() => $router.push({ path: '/rooms' })"
    >
      部屋を探す
    </button>
    <button
      class="changePageButton"
      @click="() => $router.push({ path: '/rooms/create' })"
    >
      部屋を作る
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.changePageButton {
  margin: 10px;
  font-weight: bold;
  width: 190px;
  height: 55px;
}
.homePageContents{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

</style>
