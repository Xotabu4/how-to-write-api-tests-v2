import { strict as assert } from 'assert'
import { definitions } from '../.temp/types';
import { apiTest } from '../fixtures';

apiTest.describe('Store', () => {
    apiTest('can return his inventory, and correctly updates statuses', async function ({ admin }) {
        // Potential issue when running in parallel, and other threads will add pets as well.
        const inventory = await admin.store.getInventory();
        assert(Object.keys(inventory).length > 0, `List of inventory statuses must not be empty`)

        await admin.pet.addNew(petWithStatus('available'))
        const inventoryWithAvailableAdded = await admin.store.getInventory()
        assert.equal(inventoryWithAvailableAdded.available, inventory.available + 1, `Available value in inventory must be increased by 1`)

        await admin.pet.addNew(petWithStatus('pending'))
        const inventoryWithPendingAdded = await admin.store.getInventory()
        assert.equal(inventoryWithPendingAdded.pending, inventory.pending + 1, `Pending value in inventory must be increased by 1`)

        await admin.pet.addNew(petWithStatus('sold'))
        const inventoryWithSoldAdded = await admin.store.getInventory()
        assert.equal(inventoryWithSoldAdded.sold, inventory.sold + 1, `Sold value in inventory must be increased by 1`)
    })

    apiTest('allows to place order by user, and admin can see created order', async function ({ user, admin }) {
        const order: Omit<definitions['Order'], 'id'> = {
            petId: 1,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed'
        }
        const placedOrder = await user.store.placeOrder(order)
        await admin.store.getOrderById(placedOrder.id)
    })
})

function petWithStatus(status: definitions['Pet']['status']) {
    return {
        "category": {
            "id": 0,
            "name": "string"
        },
        "name": "Cat",
        "photoUrls": [
            "http://test.com/image.jpg"
        ],
        "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
        status
    }
}