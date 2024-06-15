import { defineStore } from 'pinia';

export const useStoreUser = defineStore('user', {
  state: () => ({
    userName: "",
    userId: "",
  }),
  action: {
    setUserParameter(name,id){
        this.userName = name;
        this.userId = id;
    },
  },
});