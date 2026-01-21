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
const isProblematic = process.env.CI && process.env.GITHUB_REF_NAME === 'problem_user'
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: isProblematic ? 0 : 1,
  timeout: isProblematic ? 15_000 : 30_000,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['github']],
  use: {
    actionTimeout: isProblematic ? 5_000 : 0,
    navigationTimeout: isProblematic ? 10_000 : 30_000,
    baseURL: 'https://www.saucedemo.com/',
    trace: isProblematic ? 'retain-on-failure' : 'on-first-retry',
    video: isProblematic ? 'retain-on-failure' : 'on-first-retry',
    screenshot:'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    timeout: isProblematic ? 3_000 : 5_000,
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
