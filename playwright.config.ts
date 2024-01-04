import type { PlaywrightTestConfig } from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();

const config: PlaywrightTestConfig = {
    testDir: './test',
    fullyParallel: false,
    workers: 1,
    forbidOnly: process.env.CI ? true : undefined,
    timeout: 2 * 60 * 1000, // 5 minutes
    globalSetup: 'utils/generate-typings.ts',
    reporter: [
        ['list'],
        ['html'],
    ],
    use: {
        trace: {
            mode: 'on'
        }
    }
};

export default config;