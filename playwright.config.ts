import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
dotenv.config({ path: './.env', override: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isProblematic = process.env.CI && process.env.GITHUB_REF_NAME === 'problematic-users'
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: isProblematic ? 0 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['github']],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.05,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
