# Test Strategy 

## Objective
Create a maintainable and reliable automated E2E test suite for Saucedemo that validates expected behavior and clearly exposes defects.

## Scope
### In scope
- Login and logout flows
- Inventory interactions and sorting
- Cart behavior and persistence
- Checkout flow and price calculation
- Selected UI snapshot coverage

### Out of scope
- Performance testing
- Security testing
- Accessibility testing
- Mobile responsive testing

## Test types
- End to end functional tests
- Negative tests (invalid credentials, missing checkout info)
- UI snapshot tests

## Browsers
- Chromium
- Firefox
- WebKit

## Test users
- `standard_user`: baseline for expected behavior
- `problem_user`: used in a dedicated branch to demonstrate defect detection

## Automation approach
- Playwright for E2E automation
- Page Object Model for maintainability
- Fully parallel execution
- CI integrated execution with artifacts

## Retries and timeouts
- Default branch: 1 retry
- `problem_user` branch: 0 retry
- Reduced timeouts on the problematic branch to surface issues faster

## Reporting
- HTML report
- Traces
- Screenshots and videos on failure