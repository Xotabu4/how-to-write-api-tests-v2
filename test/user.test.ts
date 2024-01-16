import { definitions } from "../.temp/types"
import { strict as assert } from "assert"
import { apiTest } from '../fixtures'

apiTest.describe('User', () => {
    apiTest('can register', async function ({ guest }) {
        const userToCreate: Omit<definitions['User'], 'id' | 'userStatus'> = {
            firstName: 'Test',
            lastName: 'Test',
            email: `user+${Date.now()}@93.126.97.71`,
            phone: '12312312',
            username: `user${Date.now()}`,
            password: '123456'
        }

        const createdUser = await guest.user.register(userToCreate)

        assert.deepEqual(
            createdUser,
            {
                ...userToCreate,
                id: createdUser.id,
                userStatus: createdUser.userStatus,
            }
        )
    })
})