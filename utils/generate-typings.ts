import { CONFIG } from '../config/env'
import { execSync } from 'child_process'

async function globalSetup(/** config: FullConfig */) {
    execSync(`npx openapi-typescript ${CONFIG.PETSTORE_SWAGGER_URL} --output ./.temp/types.ts`, { stdio: 'inherit' })
}

export default globalSetup;
