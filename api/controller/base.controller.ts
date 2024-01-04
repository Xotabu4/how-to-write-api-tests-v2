import { PWRequest } from "../request";
import { APIRequestContext } from "@playwright/test";

export type ControllerOptions = {
    token?: string,
    baseApiRequestContext?: APIRequestContext,
    prefixUrl: string,
    prefixPath: string,
}

export class BaseController {
    constructor(protected readonly options: ControllerOptions) { }
    protected request() {
        const preparedUrl = new URL(
            this.options.prefixPath.endsWith('/') ? this.options.prefixPath : `${this.options.prefixPath}/`,
            this.options.prefixUrl
        )

        let preparedRequest: PWRequest = new PWRequest().prefixUrl(preparedUrl)

        if (this.options.baseApiRequestContext) {
            preparedRequest.apiContext(this.options.baseApiRequestContext)
        }

        if (this.options.token) {
            return preparedRequest.headers({ token: this.options.token })
        }
        return preparedRequest
    }
}