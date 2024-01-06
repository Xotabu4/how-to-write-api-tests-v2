import { URLSearchParams } from 'url';
import { definitions, operations } from '../../.temp/types'
import { step } from '../../utils/step';
import { BaseController } from './base.controller';

export class PetController extends BaseController {
    @step(`[PetController] getById`)
    async getById(id: number | string) {
        return (
            await this.request()
                .url(`pet/${id}`)
                .send<operations['getPetById']['responses']['200']['schema']>()
        ).body;
    }

    @step(`[PetController] findByTags`)
    async findByTags(tags: string | string[]) {
        const searchParams = new URLSearchParams({ tags }).toString()
        return (
            await this.request()
                .url(`pet/findByTags?${searchParams}`)
                .send<operations['findPetsByTags']['responses']['200']['schema']>()
        ).body;
    }

    @step(`[PetController] findByStatus`)
    async findByStatus(status: string | string[]) {
        const searchParams = new URLSearchParams({ status }).toString()
        return (
            await this.request()
                .url(`pet/findByStatus?${searchParams}`)
                .send<operations['findPetsByStatus']['responses']['200']['schema']>()
        ).body;
    }

    @step(`[PetController] addNew`)
    async addNew(pet: Omit<definitions['Pet'], "id">) {
        return (
            await this.request()
                .url(`pet`)
                .method('POST')
                .body(pet)
                .send<Required<operations['addPet']['responses']['200']['schema']>>()
        ).body;
    }

    @step(`[PetController] update`)
    async update(pet: definitions['Pet']) {
        return (
            await this.request()
                .url(`pet`)
                .method('PUT')
                .body(pet)
                .send<operations['updatePet']['responses']['200']['schema']>()
        ).body;
    }

    @step(`[PetController] delete`)
    async delete(id: number | string) {
        return (
            await this.request()
                .url(`pet/${id}`)
                .method('DELETE')
                .send<{ message: string }>()
        ).body;
    }
}