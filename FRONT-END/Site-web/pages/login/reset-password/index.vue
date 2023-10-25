<template>
  <v-container fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="7">
            <VImg
            src="/mns-fulllogo.png"
            cover
            class="h-100 rounded-xl d-flex align-center justify-center"
          />
            <h1>Aide a la connexion</h1>

            <VForm ref="loginform" @submit.prevent="submit" class="mt-7">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Email</label>
                <VTextField
                  v-model="email"
                  :rules="[useFormRules.ruleRequired, useFormRules.ruleEmail]"
                  prepend-inner-icon="fluent:mail-24-regular"
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
              <div class="mt-5">
                <VBtn :loading=false type="submit" block min-height="44" color="primary"
                  >Envoyer les instuctions !</VBtn
                >
              </div>
            </VForm>
            <p class="text-body-2 mt-10">
              <span
                >Vous avez retrouvé vos accès ?
                <NuxtLink to="/login" class="font-weight-bold text-primary"
                  >Se connecter !</NuxtLink
                ></span
              >
            </p>
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
            <p>
              Vous avez un problème pour vous connecter ? <br/> Entrez votre e-mail et recevez les instructions pour vous connecter aussitôt ! 
            </p>
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
      loading: false
    };
  },
  methods:{
    async submit(){
      this.loading = true
      const valid = await this.$refs.loginform.validate(); // Vérifiez les règles

      if(valid.valid){
        if(await useGlobalStore().forgotPassword(this.password)){
          this.loading = false
        }
      }
      this.loading = false
    }
  }
}
</script>

