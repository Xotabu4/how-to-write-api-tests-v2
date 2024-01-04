import { APIRequestContext, APIResponse, request } from '@playwright/test'
import { ResponseValidator } from "response-openapi-validator";
import { CONFIG } from "../config/env";

const responseValidator: ResponseValidator = new ResponseValidator({
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

type Method = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE" | "OPTIONS" | "TRACE" | "get" | "post" | "put" | "patch" | "head" | "delete" | "options" | "trace"

export class PWRequest {
    protected options: Partial<{
        apiContext?: APIRequestContext
        prefixUrl: string | URL
        method: Method
        headers: Record<string, string>
        params: {
            [key: string]: string | number | boolean;
        }
        body: any
    }> & { url: string | URL } = { url: '' };

    /**
     * Base api context to extend. Used to share cookies
     * @param apiContext 
     * @returns 
     */
    public apiContext(apiContext: APIRequestContext) {
        this.options.apiContext = apiContext;
        return this
    }

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
        const reqContext = this.options.apiContext ?? await request.newContext({
            baseURL: this.options.prefixUrl?.toString()
        });
        const response = await reqContext.fetch(this.options.url.toString(), {
            method: this.options.method,
            data: this.options.body,
            headers: this.options.headers,
            params: this.options.params,
            failOnStatusCode: true,
        });
        
        const responseBody = await response.json();

        await responseValidator.assertResponse({
            method: this.options.method ?? 'GET',
            requestUrl: response.url(),
            statusCode: response.status(),
            body: responseBody,
        });

        return {
            body: responseBody as T,
            headers: response.headers()
        }
    }
}