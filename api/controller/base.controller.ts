import { APIRequestContext } from "@playwright/test";
import { PWRequest } from "../request";

export type ControllerOptions = {
    token?: string,
    prefixUrl: string,
    prefixPath: string,
    apiRequestContext: APIRequestContext
}

export class BaseController {
    constructor(protected readonly options: ControllerOptions) { }

    protected request() {
        const preparedRequest = new PWRequest(this.options.apiRequestContext)
        
        if (this.options.token) {
            return preparedRequest.headers({ token: this.options.token })
        }

        return preparedRequest;
    }
}