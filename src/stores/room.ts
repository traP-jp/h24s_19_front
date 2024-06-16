import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useRoomStore=  defineStore('room',
  ()=>{
    const count=ref(0)
    const name=ref('')
    function setName(newName :string){
      name.value=newName
    }
    return {count,name,setName}
  }
)