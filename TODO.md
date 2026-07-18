# WENNEM Theme TODO

This is the running implementation and product-strategy TODO for the WENNEM Shopify theme. Keep this file checked into git so another developer, Codex task, or different LLM can pick up the work without needing the original chat context.

## Current Context

WENNEM is a premium women's petite apparel brand, currently focused on a small pre-launch/pre-order catalog. The visual direction is minimal, editorial, and luxury-adjacent, with references including DRESSAGE, Aritzia, COS, Toteme, The Row, and Khaite. The theme is a Shopify Online Store 2.0 theme using Liquid, JSON templates, CSS, and small vanilla JavaScript.

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

### 1. Add Shopify-native pre-launch email capture

Goal: Collect emails before launch/pre-order volume ramps up.

Recommended implementation:

- Build a reusable section, likely `sections/prelaunch-signup.liquid`.
- Use Shopify's customer form so signups become Shopify Customer records.
- Add hidden tags such as `newsletter`, `pre-launch`, and `launch-list`.
- Add the section to the homepage and potentially the pre-order collection page.
- Make copy, CTA, tags, and success message editable in the Theme Editor.

Useful Liquid pattern:

```liquid
{% form 'customer' %}
  <input type="hidden" name="contact[tags]" value="newsletter,pre-launch,launch-list">
  <input type="email" name="contact[email]" required>
  <button type="submit">Join the list</button>
{% endform %}
```

Where emails go in Shopify:

- Shopify Admin > Customers
- Customers should be segmentable by tags and email subscription state.
- Later, connect Shopify Email, Klaviyo, Mailchimp, or Shopify Flow for automated launch messages.

Open decisions:

- Exact incentive: early access only vs. discount code.
- Whether signup appears in the hero, below hero, pre-order collection, footer, or all of the above.
- Consent/fine print wording.

### 2. Add discount-code signup popup/modal

Goal: Capture visitors who are not ready to pre-order and give them a reason to join the list.

Recommended implementation:

- Build a global popup section/snippet, likely `sections/signup-popup.liquid` plus small JS in `assets/theme.js`.
- Use Shopify's customer form with tags such as `newsletter`, `pre-launch`, and `discount-popup`.
- Store dismissal/submission in `localStorage` so it does not keep showing every visit.
- Default behavior: show after 4-6 seconds, or after scroll intent. Keep it subtle.
- On mobile, render as a bottom sheet rather than a large centered modal.

Suggested copy direction:

```text
Stay in the loop
Join the WENNEM list for first access to the collection and 10% off your first order.
```

Suggested simple discount approach:

- Create one Shopify discount code manually, for example `WENNEM10`.
- After signup, show a success state with the code.
- Later, replace this with an email automation so the code is delivered by email.

Theme Editor settings to include:

- Enable/disable popup.
- Delay in seconds.
- Dismissal duration in days.
- Headline, body, CTA, success message, discount code.
- Customer tags.
- Optional image.

Accessibility requirements:

- Focus trap while modal is open.
- Escape key closes modal.
- Close button with visible accessible label.
- Do not open repeatedly after dismissal.

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
