import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/pages/RoomList.vue'),
  },
  {
    path: '/rooms/:id',
    name: 'IndividualRoom',
    component: () => import('@/pages/IndividualRoom.vue'),
  },
  {
    path: '/rooms/:id/enter',
    name: 'EnterRoom',
    component: () => import('@/pages/EnterRoom.vue'),
  },
  {
    path: '/rooms/create',
    name: 'CreateRoom',
    component: () => import('@/pages/CreateRoom.vue'),
  },
  {
    // 404 page
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
