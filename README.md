# Saucedemo E2E Tests (Playwright)

Automated end to end test suite for https://www.saucedemo.com/ using Playwright.

## Goals
- Validate the main user journey on Saucedemo with automated E2E tests
- Run the same scenarios on multiple browsers (Chromium, Firefox, WebKit)
- Provide actionable reporting (HTML report, trace, screenshots) locally and in CI
- Demonstrate defect detection via a dedicated `problem_user` branch

## Tech stack
- Playwright: 1.57.0
- dotenv: 17.2.3
- Node.js: 25.0.9

Playwright was chosen because it provides native multi browser support, strong debugging tools (trace viewer, screenshots, video), and supports more complex end to end scenarios compared to Cypress or Robot Framework.


## Project structure
- `tests/`  
  - `login.spec.ts`, `inventory.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`, `pages_snapshot.spec.ts`
  - `helpers/` reusable helpers and utilities  
  - `pages_snapshot.spec.ts-snapshots` snapshot images used by snapshot tests
- `pages/` Page Object Model helpers per page (ex: `login.ts`)
- `playwright-report/` HTML report output
- `test-results/` Playwright raw results, traces, videos, etc (generated)

## Page Object Model
The project uses the Page Object Model pattern.

Page logic is centralized inside the `pages` folder.  
Tests can call high level actions (for example `login()`), which improves readability and maintainability.  
If a page behavior changes, only the related page object needs to be updated.

## Test coverage
Tests are organized in 4 categories:
- Login
- Inventory
- Cart
- Checkout

Browsers:
- Chromium
- Firefox
- WebKit

User scope:
- Main suite targets `standard_user` as the expected normal behavior baseline
- A dedicated branch `problem_user` is used to show how the suite detects unexpected behavior and produces evidence in reports

## Environment variables
This project uses `.env` variables via dotenv.

Example `.env`:
```bash
USERNAME=standard_user
PASSWORD=secret_sauce
WRONG_USER=wrong_user
WRONG_PASSWORD=wrong_password
LOCKED_OUT_USER=locked_out_user
PRODUCTS=sauce-labs-backpack,sauce-labs-bike-light,sauce-labs-bolt-t-shirt,sauce-labs-fleece-jacket,sauce-labs-onesie,test.allthethings()-t-shirt-(red)
CHECKOUT_FIRST_NAME=standard
CHECKOUT_LAST_NAME=user
CHECKOUT_POSTAL_CODE=myAwesomePostalCode9999
```
The values shown above are example credentials provided by the Saucedemo website and correspond to the `standard_user`.

Create a local `.env` file at repo root (do not commit secrets).

## Install and run
### Install dependencies
```bash
npm ci install
npx playwright install
```
### Run all tests
```bash
npm run test
```
### Run with UI
```bash
npm run test:ui
```
### Run a specific file
```bash
npm run test tests/login.spec.ts
```
### Updating snapshot references

This project includes UI snapshot tests.

If you are running the project for the first time, the reference images for snapshots may be missing.  
In this case, tests comparing snapshots will fail until the reference images are generated.

To generate or update snapshot reference images, run:
```bash
npm run update:snapshots
```

## Reports and debugging
After a run, an HTML report is generated under:
- playwright-report/

Open it locally
```bash
npx playwright show-report
```
## Traces
Traces are generated depending on execution context and are stored under `test-results/`.

You can view traces by uploading the `.zip` file to the Playwright Trace Viewer:
https://trace.playwright.dev/

This works for both local runs and CI artifacts.

## CI behavior (GitHub Actions)

- Tests run on Chromium, Firefox, and WebKit
- CI uses 2 worker
- Retry policy:
  - Default branch: 1 retry
  - `problem_user` branch: 0 retries (failures are expected)
- CI uploads an artifact containing:
  - The Playwright HTML report
  - Traces and debugging assets

## Additional documentation 
More detailed documentation is available in the `docs` folder:

- [docs/test-strategy.md](./docs/test-strategy.md)
- [docs/test-cases.md](./docs/test-cases.md)
- [docs/reporting.md](./docs/reporting.md)
- [docs/branch-policy.md](./docs/branch-policy.md)
