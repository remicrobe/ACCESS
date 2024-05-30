import { defineStore } from 'pinia'
import { useApiService } from "~/services/apiServices";
import { Collaborateur, ICollaborateur } from "~/interface/interface";




export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
    role: null,
    loggedUser: undefined as ICollaborateur | undefined
  }),
  getters:{
    isRH():boolean{
      if(!this.loggedUser) return false
      return this.loggedUser.grade === 'drh' || this.loggedUser.grade === 'arh' || this.loggedUser.grade === 'rh';
    }
  },
  actions: {
    async getUserInfo(): Promise<any>{
      let auth = useCookie('auth');
      if( auth.value === undefined ) return
      if(this.loggedUser){
        return this.loggedUser
      }else{
        let {status,data} = await useApiService<any>('/collab/infoCollab', {method:"GET"},true)
        if(status.value==="success" && data.value){
          this.loggedUser = data.value
          if ((this.loggedUser?.grade === 'drh' || this.loggedUser?.grade === 'arh' || this.loggedUser?.grade === 'rh') || this.loggedUser?.service && (this.loggedUser.id === this.loggedUser.service.chefservice.id)) {
            return this.loggedUser
          }
        }
      }
    },
    async login(mail:string,motdepasse:string) {
      let auth = useCookie('auth');
      let {status,data} = await useApiService<any>('/collab/connect', {method:"post",body:{mail,motdepasse}})
      if(status.value==="success"  && data.value){
        this.loggedUser = data.value.collab
        if((this.loggedUser?.grade === 'drh' || this.loggedUser?.grade === 'arh' || this.loggedUser?.grade === 'rh') || this.loggedUser?.service && (this.loggedUser.id === this.loggedUser.service.chefservice.id)){
          auth.value = data.value.jwtToken
        }else{
          useNuxtApp().$toast(`${this.loggedUser?.prenom}, vous n'avez aucune permission sur cet outil, utiliser l'application Access`, {
            type: 'error',
            hideProgressBar: true,
          });
          this.disconnect()
          return false
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
        return true
      }else{
        useNuxtApp().$toast(`Une erreur est survenue`, {
          type: 'error',
          hideProgressBar: true
        });
        return false
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
    getStartPeriod() {
      return [
        { value: 0, text: 'Matin' },
        { value: 1, text: 'Midi' },
      ]
    },
    getEndPeriod() {
      return [
        { value: 1, text: 'Midi' },
        { value: 2, text: 'Soir' },
      ]
    }
  },
})
