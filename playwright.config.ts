import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options.js';
import 'dotenv/config';

export default defineConfig<TestOptions>({
  timeout: 40000,
  //globalTimeout: 60000,

  //overwrite timeout for the locator assetion (expect)
  expect: {
    timeout: 2000,
    toMatchSnapshot: {maxDiffPixels: 50}
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['json', {outputFile: 'test-results/jsonReport.json'}],
    ['junit', {outputFile: 'test-results/junitReport.xml'}],
    //['allure-playwright'],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:4200',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4200'
    //   : process.env.STAGING === '1' ? 'http://localhost:4202'
    //   : 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      "Authorization": `Token ${process.env.ACCESS_TOKEN}`
    },
    actionTimeout: 20000,
    navigationTimeout: 25000,

    video: {
      mode: "off",
      size: {width: 1920, height: 1080}
    }
  },

  //globalSetup: './global-setup.ts',
  //globalTeardown: './global-teardown.ts',
  // Temporarily disabled during the cleanup phase.
  // The original globalSetup/globalTeardown hit external services


  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup', 
      testMatch: 'auth.setup.ts'
    },

    {
      name: 'articleSetup',
      testMatch: 'newArticle.setup.ts',
      dependencies: ['setup'],
      teardown: "articleCLeanUp"
    },
    {
      name: "articleCLeanUp",
      testMatch: "articleCLeanUp.setup.ts"
    },

    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
        baseURL: 'http://localhost:4200',
      },
      dependencies: ['setup']
    },

    {
      name: 'staging',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/user.json',
        baseURL: 'http://localhost:4202',
      },

      dependencies: ['setup']
    },

    {
      name: 'regression',
      testIgnore: 'likesCounter.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },

    {
      name: 'likeCounter',
      testMatch: "likesCounter.spec.ts",
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['articleSetup']
    },

    {
      name: 'likeCounterGlobal',
      testMatch: "likesCounterGlobal.spec.ts",
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'}
    },

    {
      //isolated project to run fully offline without hitting external services
      name: 'ui',
      testMatch: 'ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200',
        extraHTTPHeaders: {},
      },
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },
    {
      name: "pageObjectFullScreen",
      testMatch: "usePageObjsects.spec.ts",
      use: {
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
          ...devices ['iPhone 13 Pro']
      }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },


  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200'
  }
});
