# CLAUDE.md

Guidance for Claude Code when working in this repo. See also `README.md` (theme structure, local dev commands) and `TODO.md` (running implementation/product-strategy backlog) — read those for details this file doesn't repeat.

## Business context

- **Brand**: WENNEM — premium trousers for petite body types, with a specific focus on the petite Asian (East Asian) proportions: shorter rise, narrower hip-to-waist ratio, shorter inseam than standard petite sizing typically assumes. This is the core fit differentiator, not just "petite" generically.
- **Stage**: Pre-launch, heading into **soft launch**. The near-term goal is to start taking **pre-orders** soon — prioritize work that unblocks pre-order flow (product pages, checkout-adjacent messaging, sizing/fit confidence, email capture) over polish that doesn't move that forward.
- **Catalog**: Starts with 2 trouser styles; expect the catalog to stay small through soft launch.
- **Imagery**: Product/lifestyle images currently in the repo are **stock/placeholder**, not owned photography. Do not treat current images as final — flag when work depends on real photography being swapped in later, and don't over-invest in image-specific polish that owned photography would invalidate.
- **Visual direction**: Minimal, editorial, luxury-adjacent. References: DRESSAGE, Aritzia, COS, Toteme, The Row, Khaite.

## Stack

- Shopify Online Store 2.0 theme: Liquid, JSON templates, CSS, small vanilla JS. No build/package.json — see `README.md` for Shopify CLI commands (`theme dev`, `theme check`, `theme package`, `theme push`).
- Branching: work happens on `staging`; `main` is protected — use PRs, not direct pushes.

## Working notes

- Run `shopify theme check` after Liquid/CSS/JS changes.
- Keep Theme Editor configurability high (copy, timing, tags, images) so non-engineers can adjust content pre- and post-launch.
- Avoid heavy carousel/modal libraries unless necessary.
- Current pre-launch priorities live in `TODO.md` — check it before starting new feature work so effort lines up with the pre-order push.
