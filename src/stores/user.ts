import { defineStore } from 'pinia';

export const useStoreUser = defineStore('user', {
  state: () => ({
    userName: "",
    userId: "",
  }),
});