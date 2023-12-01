import type { PlaywrightTestConfig } from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();

const config: PlaywrightTestConfig = {
    testDir: './test',
    fullyParallel: true,
    workers: process.env.CI ? 9 : undefined,
    forbidOnly: process.env.CI ? true : undefined,
    timeout: 2 * 60 * 1000, // 5 minutes
    reporter: [
        // ['html'],
        ['list'],
    ],
    // use: {
    //     trace: {
    //         mode: 'on',
    //     },
    // }
};

export default config;
