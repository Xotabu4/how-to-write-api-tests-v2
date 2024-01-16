import { APIRequestContext } from "@playwright/test";
import { PWRequest } from "../request";
import { BASE_URL } from "../../config/env";

export type ControllerOptions = {
    token?: string,
    prefixUrl: string,
    prefixPath: string,
    apiRequestContext?: APIRequestContext
}

export class BaseController {
    constructor(protected readonly options: ControllerOptions) { }

    protected request() {
        const preparedRequest = new PWRequest(this.options.apiRequestContext)
            .prefixUrl(BASE_URL.toString())
        
        if (this.options.token) {
            return preparedRequest.headers({ token: this.options.token })
        }

        return preparedRequest;
    }
}