import { APIRequestContext, request } from "@playwright/test";
import { ResponseValidator } from "response-openapi-validator";
import { CONFIG } from "../config/env";

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

export class PWRequest {
    protected options: Partial<{
        url: string,
        method: string,
        headers: Record<string, string>,
        params: { [key: string]: string | number | boolean }
        data: any
    }> = {}

    constructor(protected apiRequestContext: APIRequestContext) {}

    url(url: string | URL): this {
        this.options.url = url.toString();
        return this;
    }
    method(method: string): this {
        this.options.method = method
        return this;
    }
    headers(headers: Record<string, string>): this {
        this.options.headers = this.options.headers ?? {}
        this.options.headers = {
            ...this.options.headers,
            ...headers
        }
        return this;
    }
    searchParams(searchParams: { [key: string]: string | number | boolean }) {
        this.options.params = searchParams
        return this;
    }
    body(data: any) {
        this.options.data = data
        return this;
    }
    async send<T = never>() {
        if (this.options.url) {
            const response = await this.apiRequestContext.fetch(this.options.url, {
                ...this.options
            });

            const responseBody = await response.json()

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
        throw new Error('[PWRequest] url is undefined, make sure you called .url("some/url") method')
    }
}