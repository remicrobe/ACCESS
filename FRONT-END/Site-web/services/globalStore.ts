import { defineStore } from 'pinia'
import { useApiService } from "~/services/apiServices";




export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
    role: null,
    loggedUser: undefined as any
  }),
  getters:{
    async getUserInfo(): Promise<any>{
      let auth = useCookie('auth');
      console.log(auth.value)
      if( auth.value === undefined ) return
        if(this.loggedUser){
          console.log(this.loggedUser)
          return this.loggedUser
        }else{
          let {status,data} = await useApiService<any>('/collab/infoCollab', {method:"GET"},true)
          if(status.value==="success" ){
            this.loggedUser = data.value
            return this.loggedUser
          }

        }


    }
  },
  actions: {
    async login(mail:string,motdepasse:string) {
      let auth = useCookie('auth');
      console.log(useNuxtApp().$toast)
      let {status,data} = await useApiService<any>('/collab/connect', {method:"post",body:{mail,motdepasse}})
      if(status.value==="success" ){
        auth.value = data.value.jwtToken
        this.loggedUser = data.value.collab
        return true
      }else{
        useNuxtApp().$toast(`Vos informations de connexion semblent non correct`, {
          type: 'error',
          hideProgressBar: true
        });
        return false
      }

    },
    async forgotPassword(mail:string) {
      let {status,data} = await useApiService('/collab/demande-recuperation/', {method:"post",body:{mail}})
      if(status.value==="success" ){
        useNuxtApp().$toast(`Vous avez reçu un mail !`, {
          type: 'success',
          hideProgressBar: true
        });
      }else{
        useNuxtApp().$toast(`Une erreur est survenue`, {
          type: 'error',
          hideProgressBar: true
        });
      }
    },
    async setPassword(token:string,motdepasse:string) {
      let {status,data} = await useApiService(`/collab/recuperation/${token}`, {method:"post",body:{motdepasse}})
      if(status.value==="success" ){
        useNuxtApp().$toast(`Votre mot de passe a bien été modifiée !`, {
          type: 'success',
          hideProgressBar: true
        });
        return true
      }else{
        useNuxtApp().$toast(`Une erreur est survenue`, {
          type: 'error',
          hideProgressBar: true
        });
        return false
      }
    },
    disconnect() {
      let auth = useCookie('auth');
      auth.value = undefined
    },
    isLogin() {
      let auth = useCookie('auth');
      return auth.value !== undefined

    },
    getRole() {

    },
  },
})
