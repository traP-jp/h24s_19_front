import {defineStore} from 'pinia'
import { ref } from 'vue'

export const userUserStore = defineStore('userInfo',() => {
  const userId=ref('')
  const userName=ref('')
  function setUser(newName: string,newId: string){
    userName.value=newName
    userId.value=newId
  }
  return {userId,userName,setUser}
})