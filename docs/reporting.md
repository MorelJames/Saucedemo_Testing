# Reporting and Debugging

## HTML report

Generated under:
- `playwright-report/`

Contains:
- Test results per browser
- Error messages
- Screenshots
- Links to traces

Open locally with:
```bash
npx playwright show-report
```

## Raw results

Stored under:
- `test-results/`
includes:
- Traces
- Screenshots
- Videos

## Trace Viewer

Traces provide step by step replay of test execution.

To view a trace:
- Obtain the trace `.zip`
- Open https://trace.playwright.dev/
- Upload the `.zip` file