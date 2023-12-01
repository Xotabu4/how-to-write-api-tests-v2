import 'dotenv/config'
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './test',
    fullyParallel: false,
    workers: process.env.CI ? 9 : undefined,
    forbidOnly: process.env.CI ? true : undefined,
    timeout: 2 * 60 * 1000, // 5 minutes
    reporter: [
        // ['html'],
        ['list'],
    ],
    globalSetup: 'utils/generate-typings.ts',
    // use: {
    //     trace: {
    //         mode: 'on',
    //     },
    // }
};

export default config;
