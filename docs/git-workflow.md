# Git Workflow

Recommended Shopify branch mapping:

- `staging` -> unpublished Shopify preview theme
- `main` -> live Shopify theme

Daily workflow:

1. Create feature branches from `staging`.
2. Open PRs from feature branches into `staging`.
3. Preview the Shopify theme connected to `staging`.
4. When ready, use the automated `Promote staging to main` PR.
5. Merge that PR to update the live theme connected to `main`.

GitHub branch protection to configure:

- Protect `staging`.
- Require PRs before merging into `staging`.
- Require the `Shopify theme check` status check.
- Protect `main`.
- Require PRs before merging into `main`.
- Require the `Shopify theme check` and `Require staging source branch` status checks.
- Disable direct pushes to `main` and `staging`.

Local setup:

```sh
git config core.hooksPath .githooks
```

The pre-commit hook validates JSON, validates Shopify section schemas, checks whitespace, and runs `shopify theme check` when Shopify CLI is available.
