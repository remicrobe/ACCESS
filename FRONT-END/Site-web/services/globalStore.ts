import { defineStore } from 'pinia'
import { useApiService } from "~/services/apiServices";
import { Collaborateur, ICollaborateur } from "~/interface/interface";




export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
    role: null,
    loggedUser: null as ICollaborateur | null
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
      let {status,data} = await useApiService('https://restful-booker.herokuapp.com/auth', {method:"post",body:{email,password}})
      if(status.value==="success" ){
        this.loggedUser = data.value.collab
        console.log(this.loggedUser.grade)
        if((this.loggedUser.grade === 'drh' || this.loggedUser.grade === 'arh' || this.loggedUser.grade === 'rh') || this.loggedUser.service && (this.loggedUser.id === this.loggedUser.service.chefservice.id)){
          auth.value = data.value.jwtToken
        }else{
          useNuxtApp().$toast(`${this.loggedUser.prenom}, vous n'avez aucune permission sur cet outil, utiliser l'application Access`, {
            type: 'error',
            hideProgressBar: true,
          });
          this.disconnect()
        }


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
