<template>
  <VContainer fluid class="fill-height">
    <VRow  align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow  align="center" justify="center">
          <VCol cols="12" md="7">
            <VImg
            src="/mns-fulllogo.png"
            cover
            class="h-100 rounded-xl d-flex align-center justify-center"
          />
            <h1>Se connecter</h1>
            <p class="text-medium-emphasis">Entrer vos détails de connexion</p>

            <VForm ref="loginform" @submit.prevent="submit" class="mt-7">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Email</label>
                <VTextField
                  :rules="[useFormRules.ruleRequired, useFormRules.ruleEmail]"
                  v-model="email"
                  prepend-inner-icon="fluent:mail-24-regular"
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Mot de passe</label>
                <VTextField
                  :rules="[useFormRules.ruleRequired, useFormRules.rulePassLen]"
                  v-model="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div class="mt-5">
                <VBtn :loading=loading type="submit" block min-height="44" color="primary">Se connecter</VBtn>
              </div>
            </VForm>
            <p class="text-body-2 mt-10">
              <NuxtLink to="/login/reset-password" class="font-weight-bold text-primary"
                >Première connexion / Mot de passe oubliée</NuxtLink
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
          </div>
        </VImg>
      </VCol>
    </VRow>
  </VContainer>
</template>


<script>
import { useFormRules } from '#imports';
import { useGlobalStore } from "~/services/globalStore";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
    };
  },
  methods:{
    async submit(){
      this.loading = true
      const valid = await this.$refs.loginform.validate(); // Vérifiez les règles

      if(valid.valid){
        if(await useGlobalStore().login(this.email,this.password)){
          this.loading = false
          this.$router.push(useRouter().currentRoute.value.query.ref ? useRouter().currentRoute.value.query.ref : '/')
        }
      }
      this.loading = false
    }
  }
}
</script>

