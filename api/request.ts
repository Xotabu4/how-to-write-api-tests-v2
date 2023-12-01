// import { APIRequest, request, Request} from '@playwright/test'
import { JsonRequest } from "http-req-builder";
import { ResponseValidator } from "response-openapi-validator";
import { CONFIG } from "../config/env";
// import { CookieJar } from "tough-cookie";
// import { URLSearchParams } from "url";

const responseValidator = new ResponseValidator({
    openApiSpecPath: CONFIG.PETSTORE_SWAGGER_URL,
    apiPathPrefix: CONFIG.PETSTORE_API_PREFIX_PATH,
    ajvOptions: {
        allErrors: true,
        verbose: true,
        jsonPointers: true,
        formats: {
            double: "[+-]?\\d*\\.?\\d+",
            int32: /^\d+$/,
            int64: /^\d+$/,
        },
    },
})

export class JsonRequestWithValidation extends JsonRequest {
    constructor() {
        super()
        this.options = {
            ...this.options,
        }
    }

    async send<T = any>() {
        // Example is simplified: in case 4xx/5xx validation won't be applied
        const response = await super.send<T>()

        await responseValidator.assertResponse({
            method: response.request?.options?.method,
            requestUrl: response?.request?.requestUrl,
            statusCode: response?.statusCode,
            body: response.body,
        });
        return response
    }
}

// export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'trace';

// export class PwJsonRequest implements BaseHttpRequest {
//     // @ts-ignore error!
//     protected options: Parameters<APIRequest['newContext']>[0] = {};
//     protected urlPath: string | URL = '';
    
//     body(body: any): this {
//         throw new Error("Method not implemented.");
//     }
//     prefixUrl(url: string | URL): this {
//         return this;
//     }
//     url(url: string | URL): this {
//         return this;
//     }
//     cookieJar(cookiesJar: CookieJar): this {
//         return this;
//     }
//     headers(headers: Record<string, string | undefined>): this {
//         return this;
//     }
//     bearerToken(bearerToken?: string | undefined): this {
//         return this;
//     }
//     searchParams(searchParams: string | Record<string, string | number | boolean | null | undefined> | URLSearchParams | undefined): this {
//         return this;
//     }
//     method(method: Method): this {
//         return this;
//     }
//     async send<T = any>(req?: Request) {
//         const ctx = await request.newContext(this.options);
//         if (req) ctx.fetch(req);

//         await ctx.fetch(this.urlPath, this.options)
//     }
// }