import { definitions, operations } from "../../.temp/types";
import { STEP } from "../../utils/step";
import { BaseController } from "./base.controller";

export class StoreController extends BaseController {

    @STEP(`[StoreController] getOrderById`)
    async getOrderById(orderId: number | string) {
        return (await this.request()
            .url(`store/order/${orderId}`)
            .send<operations['getOrderById']['responses']['200']['schema']>()
        ).body
    }

    @STEP(`[StoreController] getOrderById`)
    async placeOrder(order: Omit<definitions["Order"], "id" | "status">) {
        return (await this.request()
            .url(`store/order`)
            .method('POST')
            .body(order)
            .send<operations['placeOrder']['responses']['200']['schema']>()
        ).body
    }

    @STEP(`[StoreController] getInventory`)
    async getInventory() {
        return (await this.request()
            .url(`store/inventory`)
            .send<operations['getInventory']['responses']['200']['schema']>()
        ).body
    }
}