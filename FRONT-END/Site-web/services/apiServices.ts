import { UseFetchOptions } from "#app";
import defu from "defu";
import { FetchContext, FetchResponse } from "ofetch";
import { R } from "vite-node/types-516036fa";

/*
How to use api service,
You just do useApiService(url, useFetchOptions, needAuth)

exemple of useFetch options : {method:"post",body:"......")

needAuth is faculative default is false

how need auth is use
reead auth token with useCookie('auth');

so you need to define the cookie
 */

export function useApiService<T> (url: string, options: UseFetchOptions<T> = {}, needAuth: boolean = true, notif = false, typenotif='Récupération') {
    const config = useRuntimeConfig().public.apiUrl
    let authHeader: HeadersInit = {};

    if (needAuth) {
        let authToken = useCookie('auth');
        authHeader = { Authorization: `Bearer ${authToken.value}` };
    }

    const defaults: UseFetchOptions<T> = {
        baseURL: config,
        headers: authHeader,
        onResponse(context: FetchContext & { response: FetchResponse<R> }): Promise<void> | void {
            if(notif){
                useNuxtApp().$toast(`${typenotif} effectué avec succés !`, {
                    type: 'success',
                    hideProgressBar: true,
                });
            }
        },
        onResponseError(context: FetchContext & { response: FetchResponse<R> }): Promise<void> | void {
            if(notif) {
                useNuxtApp().$toast(`Une erreur est survenue.`, {
                    type: 'error',
                    hideProgressBar: true,
                });
            }
        }
    }

    const params = defu(options, defaults);

    return useFetch(url, params);
}
