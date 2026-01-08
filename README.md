### Ngx-Admin Angular 14 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Playwright.

The original repo is here: https://github.com/akveo/ngx-admin


Install: `npm install --force`
Run: `npm start`


PW Cheatsheet

`npx playwright test` - run tests
`npx playwright test --headed` - run tests headed
`npx playwright test --ui` - run tests ui mode
`npx playwright test example.spec.ts` - run specific spec file
`npx playwright test -g "has titile"` - run specific test
`npx playwright test --project=chromium` - run tests in chromium

`npx playwright show-report` - run reports

`npx playwright test --trace on` - run with testing evidences

`npx playwright test --debug` - run in debug mode