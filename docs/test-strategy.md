## Testing strategy

The testing strategy for this project focuses on validating the main end to end user journey of the Saucedemo website through automated browser based tests. The objective is not to exhaustively test every edge case, but to cover the most critical business flows in a way that is reliable, maintainable, and easy to analyze when failures occur.

Tests are written with the `standard_user` as the reference baseline, representing how the application is expected to behave under normal conditions. This allows the suite to act as a regression safety net and quickly highlight unexpected changes in functionality or UI behavior.

The suite is organized by functional areas (login, inventory, cart, checkout) to mirror how users interact with the application and to keep test intent clear. A Page Object Model is used to separate test logic from page behavior, improving readability and reducing maintenance cost when the application evolves.

Multi browser execution (Chromium, Firefox, WebKit) is used to ensure consistent behavior across different rendering engines. Tests are executed in parallel to keep execution time reasonable while still providing broad coverage.

A dedicated `problem_user` branch is intentionally maintained to demonstrate defect detection. In this context, failures are expected and are used to showcase the quality of reporting, traceability, and debugging artifacts produced by the automation framework. Configuration such as retries and timeouts is adjusted on this branch to ensure that failures remain visible and reproducible.

Finally, the strategy emphasizes actionable reporting. Every failure should be accompanied by clear evidence (HTML report, screenshots, traces, videos when relevant) so that issues can be understood and diagnosed without rerunning the tests locally.
