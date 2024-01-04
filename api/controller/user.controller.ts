import { definitions, operations } from "../../.temp/types";
import { step } from "../../utils/step";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {

    @step(`[UserController] register`)
    async register(userToCreate: Omit<definitions['User'], "id" | "userStatus">) {
        return (await this.request()
            .url(`user/register`)
            .method('POST')
            .body(userToCreate)
            .send<operations['registerUser']['responses']['200']['schema']>()
        ).body
    }

    @step(`[UserController] login`)
    async login(credentials: { username: string, password: string }) {
        return (
            await this.request()
                .url(`user/login`)
                .searchParams(credentials)
                .send<operations['loginUser']['responses']['200']['schema']>()
        ).headers['token'] as string
    }
}