import { request } from '@playwright/test'
// import { ResponseValidator } from "response-openapi-validator";
// import { CONFIG } from "../config/env";

// const responseValidator = new ResponseValidator({
//     openApiSpecPath: CONFIG.PETSTORE_SWAGGER_URL,
//     apiPathPrefix: CONFIG.PETSTORE_API_PREFIX_PATH,
//     ajvOptions: {
//         allErrors: true,
//         verbose: true,
//         jsonPointers: true,
//         formats: {
//             double: "[+-]?\\d*\\.?\\d+",
//             int32: /^\d+$/,
//             int64: /^\d+$/,
//         },
//     },
// })

// export class JsonRequestWithValidation extends JsonRequest {
//     constructor() {
//         super()
//         this.options = {
//             ...this.options,
//         }
//     }

//     async send<T = any>() {
//         // Example is simplified: in case 4xx/5xx validation won't be applied
//         const response = await super.send<T>()

//         await responseValidator.assertResponse({
//             method: response.request?.options?.method,
//             requestUrl: response?.request?.requestUrl,
//             statusCode: response?.statusCode,
//             body: response.body,
//         });
//         return response
//     }
// }

type Method = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE" | "OPTIONS" | "TRACE" | "get" | "post" | "put" | "patch" | "head" | "delete" | "options" | "trace"

export class PWRequest {
    protected options: Partial<{
        prefixUrl: string | URL
        method: Method
        headers: Record<string, string>
        params: {
            [key: string]: string | number | boolean;
        }
        body: any
    }> & { url: string | URL } = { url: '' };

    public prefixUrl(url: string | URL): this {
        this.options.prefixUrl = url
        return this
    }
    /**
     * @param url Can be full url, but only in case prefixUrl is not set
     */
    public url(url: string | URL): this {
        this.options.url = url
        return this
    }
    public method(method: Method): this {
        this.options.method = method
        return this
    }
    public headers(headers: Record<string, string>): this {
        this.options.headers = this.options.headers ?? {}
        this.options.headers = {
            ...this.options.headers,
            ...headers
        }
        return this;
    }
    public bearerToken(bearerToken: string): this {
        return this.headers({
            'Authorization': bearerToken
        })
    }
    public searchParams(searchParams: {
        [key: string]: string | number | boolean;
    }): this {
        this.options.params = searchParams
        return this
    }
    public body(body: any): this {
        this.options.body = body
        return this;
    };
    public async send<T = never>() {
        const reqContext = await request.newContext({
            baseURL: this.options.prefixUrl?.toString()
        });

        const response = await reqContext.fetch(this.options.url.toString(), {
            method: this.options.method,
            data: this.options.body,
            headers: this.options.headers,
            params: this.options.params,
            failOnStatusCode: true,
        });

        return {
            body: await response.json() as T,
            headers: response.headers()
        }
    }
}