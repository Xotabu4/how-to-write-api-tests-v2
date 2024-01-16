import { test } from "@playwright/test"
import { ApiClient } from "../api/client"

export const apiTest = test.extend<{
    adminCredentials: { username: string, password: string }
    userCredentials: { username: string, password: string }
    admin: ApiClient, user: ApiClient, guest: ApiClient
}>({
    adminCredentials: [{ username: 'admin', password: 'admin' }, { option: true }],
    userCredentials: [{ username: 'user', password: 'user' }, { option: true }],
    guest: async ({ request }, use) => {
        await use(ApiClient.unauthorized({ apiRequestContext: request }))
    },
    user: async ({ userCredentials, request }, use) => {
        await use(await ApiClient.loginAs(userCredentials, { apiRequestContext: request }))
    },
    admin: async ({ adminCredentials, request }, use) => {
        await use(await ApiClient.loginAs(adminCredentials, { apiRequestContext: request }))
    },
})