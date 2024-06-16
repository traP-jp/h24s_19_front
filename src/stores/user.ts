import { defineStore } from 'pinia'

export const useStoreUser = defineStore('user', {
  state: () => ({
    userName: '',
    userId: '',
  }),
  actions: {
    setUser(newName: string, newId: string) {
      this.userName = newName
      this.userId = newId
    },
  },
})
