# Sonic on-page SEO

- Homepage: primary keyword Audio Studio in title, H1 and editorial guide; approximately 1,030 words of new visible copy.
- Supporting topics: naturally distributed through effect guides and homepage copy; service names are discovery context, not integrations. Echo is explained accurately as unavailable.
- All 24 English routes and their seven language variants (192 pages total) have localized titles, descriptions, self-canonical URLs, Open Graph title/description/type/site/locale/URL, X summary metadata and WebPage JSON-LD. Homepages include WebSite and SoftwareApplication data, without invented reviews.
- Every page has reciprocal en/es/ja/fr/de/pt/ko/it hreflang links, including itself and an x-default pointing to its equivalent English page. The sitemap lists all 192 canonical routes. Visible content is delivered in the initial HTML, including localized FAQ/schema. See I18N.md for the generator and final-domain configuration.
- The source build defaults to its original registered origin. Cloudflare Workers rewrites served metadata, sitemap and robots to the live request origin. For other hosting, build with SONIC_SITE_URL set to the public origin.
- No social image existed. Image metadata is omitted rather than referencing a missing asset.
- No keyword meta tag or hidden keyword lists.
- SEO changes alone do not publish the site or submit it to search engines.

## Homepage FAQ
16 visible, native details/summary entries have matching FAQPage JSON-LD. Answers are present in the initial HTML and remain usable without JavaScript. JavaScript adds reversible 280 ms height/fade animation, with reduced-motion support. Health answers link to NIMH/NCCIH and avoid 8D treatment claims. Google retired FAQ rich results on May 7, 2026; markup is not a promise of an enhanced search listing.

## Dedicated effect search intent (v40)
All 17 tools have independently crawlable landing URLs, effect-specific English titles/H1s and descriptions, localized headings/descriptions in all seven additional languages, a self-canonical and matching WebApplication/WebPage JSON-LD. Homepage metadata remains focused on Audio Studio and online audio editing. The effect catalog links directly to every tool. For example, slowed reverb queries target /effect-slowed.html, 8D queries target /effect-eightd.html and bass booster queries target /effect-bass.html. Search engines choose ranking, snippets and landing pages; these signals do not enforce query-based routing. Localhost is not publicly crawlable. Before indexing, deploy publicly, use the actual domain via SONIC_SITE_URL, verify domain ownership in the applicable webmaster tools and submit /sitemap.xml. No deployment or search-engine submission was performed in this task. Reference: https://developers.google.com/search/docs/appearance/title-link .

Seven additional tools now have dedicated effect pages in all eight languages. The sitemap contains 248 indexable content URLs; all 48 error pages remain excluded.
