import { PetController } from "./controller/pet.controller";
import { StoreController } from "./controller/store.controller";
import { UserController } from "./controller/user.controller";
import { CONFIG } from "../config/env";
import type { ControllerOptions } from "./controller/base.controller";

export class ApiClient {
    public readonly pet: PetController;
    public readonly store: StoreController;
    public readonly user: UserController;

    constructor(options?: Partial<ControllerOptions>) {
        const defaultOptions = {
            prefixUrl: CONFIG.PETSTORE_URL,
            prefixPath: CONFIG.PETSTORE_API_PREFIX_PATH,
        }
        const mergedOptions = {
            ...defaultOptions,
            ...options
        }
        this.pet = new PetController(mergedOptions)
        this.store = new StoreController(mergedOptions)
        this.user = new UserController(mergedOptions)
    }

    static unauthorized(options?: Partial<ControllerOptions>) {
        return new ApiClient(options);
    }

    static async loginAs(credentials: { username: string, password: string }, options?: Partial<ControllerOptions>) {
        return new ApiClient({
            ...options,
            token: await new ApiClient(options).user.login(credentials),
        })
    }

}