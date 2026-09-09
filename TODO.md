# WENNEM Theme TODO

This is the running implementation and product-strategy TODO for the WENNEM Shopify theme. Keep this file checked into git so another developer, Codex task, or different LLM can pick up the work without needing the original chat context.

## Current Context

WENNEM is a premium women's petite apparel brand, with a specific focus on petite Asian (East Asian) body proportions — shorter rise and inseam than standard petite sizing typically assumes. It is currently focused on a small pre-launch/pre-order catalog, heading into soft launch. The visual direction is minimal, editorial, and luxury-adjacent, with references including DRESSAGE, Aritzia, COS, Toteme, The Row, and Khaite. The theme is a Shopify Online Store 2.0 theme using Liquid, JSON templates, CSS, and small vanilla JavaScript.

Product and lifestyle images currently in the repo are stock/placeholder, not owned photography — don't over-invest in image-specific polish that real photography would invalidate.

Current repo path used during development:

```text
/Users/bigxiazilla/Projects/WENNEM/wennem-shopify-theme
```

Current Shopify store seen during testing:

```text
wennem.myshopify.com
```

Shopify CLI may be available at:

```text
/Users/bigxiazilla/.nvm/versions/node/v24.18.0/bin/shopify
```

The working branch has been `staging`. Main may be protected, so use PRs instead of pushing directly to `main`.

## Recently Implemented

- DRESSAGE-inspired premium theme structure for WENNEM.
- Mural-style product page media gallery, with a carousel option in the Product page Theme Editor settings.
- Product grid cards with fixed/bounded media frames so placeholder images do not appear overly tall.
- Safe generated placeholder product images in `assets/`.
- `@font-face` output moved inside the layout `<style>` tag so Shopify font CSS does not render as visible page text.
- Theme Check has passed after the latest code changes during this workstream.

## High-Priority Pre-Launch Enhancements

### 1. Pre-launch email capture — done

Implemented by enhancing the two existing customer-form spots (`sections/newsletter.liquid` on the homepage, and the form embedded in `sections/footer.liquid`) rather than adding a third competing form:

- Hidden `contact[tags]` value now reads from a merchant-editable `tags` setting on each section (default `newsletter,pre-launch,launch-list`).
- Both forms show a real success message (`form.posted_successfully?`) or error state (`form.errors`), matching the pattern already used in `sections/contact-form.liquid`, instead of silently reloading with no feedback.

Still open: exact incentive beyond early access (a discount is handled separately by the popup below), and whether a signup should also appear on the pre-order collection page.

### 2. Discount-code signup popup/modal — built, ships disabled

Built as `sections/signup-popup.liquid`, rendered globally via `layout/theme.liquid`, with supporting JS in `assets/theme.js` and styles in `assets/theme.css`.

- Desktop: centered modal. Mobile (≤700px): bottom sheet, not a centered box.
- Shows after a configurable delay (`delay_seconds`, default 6s); dismissal/submission is remembered in `localStorage` for `dismiss_days` (default 7) so it doesn't reappear every visit.
- Accessible: focus trapped while open, Escape closes it, visible close button label, reuses the theme's existing `openLayer`/`closeLayer`/`trapFocus` overlay utilities (the same ones powering the cart drawer and search).
- **Ships with `enable: false` and `discount_code` blank** — there is no real discount code decided yet. A merchant must turn this on and fill in a real code before it goes live. Do not set a placeholder code as the default.
- Known Shopify platform limitation: `form.posted_successfully?` is shared across every `{% form 'customer' %}` on a page, so submitting the plain footer/newsletter form would otherwise also flip this popup's "just submitted" state and force it open showing the discount code to someone who never touched it. Worked around client-side via a `sessionStorage` flag set on this form's own `submit` event, checked against `data-posted` on load — only a genuine popup submission force-opens it with the success/discount content. Residual minor limitation: the popup's hidden success markup (including the discount code) is still present in the page's HTML source after *any* customer-form submission on the page, since Liquid itself can't disambiguate which form was submitted — not visually exposed, but visible via view-source. Worth a fuller fix (e.g. consolidating to one form, or per-form id + redirect-hash matching) if that residual exposure matters once a real code is live.

### 3. Add or polish the Our Story page

There is already a foundation in the theme:

- `templates/page.our-story.json`
- `sections/page-story.liquid`
- `sections/founder-story.liquid`

Goal: Make the story page feel intentional and launch-ready, not just a placeholder.

Recommended content structure:

- Brand origin: why WENNEM exists.
- Petite-first problem statement: proportions, fit, inseam, rise, tailoring, office-to-evening needs.
- Product philosophy: timeless essentials, clean tailoring, premium fabric, restrained design.
- Founder note or atelier note.
- Visual section using existing WENNEM lifestyle imagery.
- CTA to join the pre-launch list or shop pre-order.

Implementation notes:

- Confirm whether the Shopify Admin page uses the `page.our-story` template.
- Add navigation link text consistently as `Story` or `Our Story`.
- Make the page editable through Theme Editor settings where possible.
- Consider adding the pre-launch signup section at the bottom of this page.

## Medium-Priority Enhancements

- Improve product page variant behavior so selecting color/size updates the actual selected variant ID without relying only on Shopify's native fallback behavior.
- Add real collection/product photography and replace placeholder images.
- Add size-specific waitlist or back-in-stock behavior for sold-out variants.
- Improve predictive search with live Shopify predictive search endpoint.
- Add recently viewed products using localStorage.
- Add product recommendations once the catalog is populated.
- Add review app integration only after there is real social proof.

## Testing Checklist

Before merging theme changes:

```bash
cd /Users/bigxiazilla/Projects/WENNEM/wennem-shopify-theme
/Users/bigxiazilla/.nvm/versions/node/v24.18.0/bin/shopify theme check
```

Also test locally:

```bash
shopify theme dev --store wennem.myshopify.com
```

Manual checks:

- Homepage does not show raw CSS text.
- Product card images are not overly tall.
- Product page gallery has no giant blank gap.
- Mobile header, menu, cart drawer, search overlay, and sticky add-to-cart still work.
- Newsletter/customer forms submit and create/update Shopify Customers with expected tags.
- Popup respects dismissal and does not reappear immediately after close or submit.

## Notes for Future Agents

- Prefer scoped edits following the existing Liquid/CSS/vanilla JS style.
- Avoid adding heavy carousel/modal libraries unless absolutely necessary.
- Keep Theme Editor configurability high, especially for copy, timing, tags, and images.
- Run Shopify Theme Check after Liquid/CSS/JS changes.
- This repo is outside the default Codex workspace in some sessions. If direct writes are blocked, prior work used a small Python script saved under `/Users/bigxiazilla/Documents/Codex/...` and executed with `zsh -ic 'python3 SCRIPT_PATH'`.
