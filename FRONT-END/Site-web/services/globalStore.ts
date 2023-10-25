import { defineStore } from 'pinia'
import { useApiService } from "~/services/apiServices";
import { Collaborateur, ICollaborateur } from "~/interface/interface";




export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
    role: null,
    loggedUser: null as ICollaborateur | null
  }),
  actions: {
    async login(email:string,password:string) {
      let auth = useCookie('auth');
      let {status,data} = await useApiService('https://restful-booker.herokuapp.com/auth', {method:"post",body:{email,password}})
      if(status.value==="success" ){
        auth.value = 'OK'
        return true
      }else{
        useNuxtApp().$toast(`Vos informations de connexion semblent non correct`, {
          type: 'error',
          hideProgressBar: true
        });
        return false
      }

    },
    async forgotPassword(email:string) {
      let {status,data} = await useApiService('https://restful-booker.herokuapp.com/auth', {method:"post",body:{email}})
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
    async setPassword(token:string,email:string) {
      let {status,data} = await useApiService('https://restful-booker.herokuapp.com/auth', {method:"post",body:{email,token}})
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
    getUserInfo(){
      if(this.isLogin()){
        if(this.loggedUser){
          return this.loggedUser
        }else{
          // On récupère ici les data user blablabla on les stock dans loggedUser puis voila
        }
      }
    }
  },
})
