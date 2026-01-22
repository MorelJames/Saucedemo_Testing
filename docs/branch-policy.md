# Branch Policy

## Default branch
- Uses `standard_user`
- Failures indicate regressions or unexpected behavior
- 1 retry enabled in CI

## problem_user branch
- Uses `problem_user`
- Failures are expected
- 0 retries in CI
- Purpose is to demonstrate defect detection and reporting