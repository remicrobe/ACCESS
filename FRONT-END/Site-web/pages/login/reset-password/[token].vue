<template>
    <v-container fluid class="fill-height">
      <VRow  align="center" justify="center" class="fill-height">
        <VCol cols="12" md="6" lg="5" sm="6">
          <VRow  align="center" justify="center">
            <VCol cols="12" md="7">
              <VImg
            src="/mns-fulllogo.png"
            cover
            class="h-100 rounded-xl d-flex align-center justify-center"
          />
              <h1>Changer votre mot de passe</h1>
  
              <VForm ref="loginform" @submit.prevent="submit" class="mt-7">
                <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Mot de passe</label>
                <VTextField
                  :rules="[useFormRules.ruleRequired, useFormRules.rulePassLen, repassword===password]"
                  v-model="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Confirmer mot de passe</label>
                <VTextField
                  :rules="[useFormRules.ruleRequired, useFormRules.rulePassLen, repassword===password]"
                  v-model="repassword"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="repassword"
                  name="repassword"
                  type="password"
                />
              </div>
                <div class="mt-5">
                  <VBtn type="submit" :loading="loading" :disabled="loading" block min-height="44" :color="buttonColor"
                    >Changer le mot de passe !</VBtn
                  >
                </div>
              </VForm>
            </VCol>
          </VRow>
        </VCol>
        <VCol class="hidden-md-and-down fill-height" md="5" lg="7">
          <VImg
            src="/bg-login.jpg"
            cover
            class="h-100 rounded-xl d-flex align-center justify-center"
          >
            <div class="text-center w-50 text-white mx-auto">
              <h2 class="mb-4">Bienvenue sur AccessLink</h2>
            </div>
          </VImg>
        </VCol>
      </VRow>
    </v-container>
  </template>
  
  <script>
  import { useFormRules } from '#imports';
  import { useGlobalStore } from "~/services/globalStore";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        repassword: "",
        loading:false,
        buttonColor: 'primary'
      };
    },
    methods:{
      async submit(){
        this.loading = true
        const valid = await this.$refs.loginform.validate(); // Vérifiez les règles

        if(valid.valid){
          if(await useGlobalStore().setPassword(this.$route.params.token,this.password)){
            this.buttonColor = 'success'
            setTimeout(()=>this.$router.push('/login'),3000)
          }else{
            this.buttonColor = 'error'
          }
        }
        this.loading = false
      }
    }
  }
  </script>
  
  