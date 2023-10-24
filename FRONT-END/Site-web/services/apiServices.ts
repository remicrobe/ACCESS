import { UseFetchOptions } from "#app";
import defu from "defu";
import { FetchContext, FetchResponse } from "ofetch";
import { R } from "vite-node/types-516036fa";

export function useApiService<T> (url: string, options: UseFetchOptions<T> = {}, needAuth: boolean = true) {
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
        },
        onResponseError(context: FetchContext & { response: FetchResponse<R> }): Promise<void> | void {
        }
    }

    const params = defu(options, defaults);

    return useFetch(url, params);
}
