# WENNEM Shopify Theme

Production-oriented Shopify Online Store 2.0 theme for WENNEM, a premium petite workwear brand launching with two focused trouser styles.

## Included

- JSON templates for homepage, product, collection, cart, standard pages, FAQ, size guide, contact, 404, and search.
- Configurable sections for editorial hero, featured collections, editorial story, shop the look, featured products, testimonials, Instagram gallery, newsletter, header, footer, announcement bar, cart drawer, predictive search shell, and quick view shell.
- Petite-fit homepage sections for fit education and standard-versus-petite comparison.
- Reusable snippets for product cards, price display, breadcrumbs, and quantity selection.
- Product page with media gallery, video support, sticky purchase panel, variant selectors, quantity selector, petite fit summary, model reference, garment measurements, shipping estimate, inventory messaging, accordions, trust badges, mobile sticky add to cart, and recommendation sections.
- Collection page with collection banner, product count, breadcrumbs, sticky filter panel, Shopify storefront filters, compact add/view actions, hover image swap, and load-more pagination.
- Merchant-editable colors, fonts, spacing, button radius, logo, announcement, menus, and product badges.

## Launch assumptions

- WENNEM starts with 2 products and expands after fit, sizing, and merchandising have been validated.
- Search, shop-by-fit/category navigation, social proof, and recommended filter strategy are intentionally not prioritized for the first pass.

## Product metafields

Create product metafields in the `custom` namespace for the two launch trousers:

- `subtitle`
- `fit_summary`
- `fit_rating`
- `recommended_height_range`
- `model_height`
- `model_size`
- `model_inseam`
- `rise`
- `inseam`
- `waist_measurement`
- `hip_measurement`
- `thigh_measurement`
- `leg_opening`
- `stretch_level`
- `fit_notes`
- `fabric_composition`
- `care_instructions`
- `shipping_note`
- `styling_notes`
- `available_inseams`

These fields hide gracefully when empty and can be expanded into metaobjects later for size charts, fit guides, model profiles, and fabric stories.

## Local testing

From the theme folder:

```bash
cd /Users/bigxiazilla/Projects/WENNEM/wennem-shopify-theme
```

Install or update Shopify CLI if needed:

```bash
npm install -g @shopify/cli@latest
```

Log in and preview the theme locally against your Shopify store:

```bash
shopify theme dev --store YOUR-STORE.myshopify.com
```

Run Theme Check before pushing:

```bash
shopify theme check
```

Package an uploadable zip:

```bash
shopify theme package
```

Push to a development theme when you are ready to test in Shopify Admin:

```bash
shopify theme push --unpublished --store YOUR-STORE.myshopify.com
```

If this repo is connected through Shopify's GitHub integration, use the `staging` branch and PR flow rather than pushing directly to protected `main`.

## Placeholder product images

Generated safe placeholder product images live in `assets/`:

- `wennem-product-black-placeholder.png`
- `wennem-product-beige-placeholder.png`
- `wennem-product-espresso-placeholder.png`

These are original generated assets for theme mockups and should be replaced with owned WENNEM product photography before launch.

## Notes

- Upload `premium-fashion-theme-upload.zip` through Shopify Admin > Online Store > Themes > Add theme > Upload zip file.
- Assign real collections/products/images in the theme editor after upload.
- The quick-view and predictive-search shells are intentionally lightweight for performance and ready to connect to Shopify Ajax endpoints when the live catalog is configured.
