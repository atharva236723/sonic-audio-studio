# Cloudflare Workers deployment

Live site: https://sonic-audio-studio.atharva-shukla2367.workers.dev
Worker: sonic-audio-studio
Wrangler: 4.148.0
Deployment version: 51d80e59-716f-4b8a-ba86-131ca20d4070

Deployment configuration is wrangler.jsonc. The Worker serves dist through the ASSETS binding, preserves .html tool URLs and language directory homepages, handles localized error responses, and replaces the original registered hostname in HTML metadata, JSON-LD, sitemap.xml and robots.txt with the public request origin. An optional SITE_ORIGIN Worker variable can fix a preferred canonical origin if a custom domain is added later. The local static source still uses its registered fallback origin; deployed responses use the actual live hostname.

To update after editing:

    node build-i18n.cjs
    npx wrangler@4.148.0 deploy

Run these in the repository root with Node.js available and the desired Cloudflare account signed in. No Cloudflare credentials are stored in this project or static bundle. Local hosting registration and Cloudflare state are excluded from this repository.

Verified public homepage, slowed reverb landing page, combination editor, Spanish homepage, Japanese reverb page, root and French 404 responses, 500 response, sitemap (248 content URLs), robots sitemap reference, MP3 worker/encoder files and Google Analytics tag. Local Worker routing tests passed 768 checks. Live browser interaction testing was unavailable, so these checks verify HTTP responses, page content and asset delivery rather than visual/audio interactions.
