# Contributing

Use Node.js 20 or newer. Start the preview with `npm run dev`, make a focused change, then run `npm run build` and `npm test`.

Edit English source pages in `dist/` and translations in `i18n/`. Include generated pages when a rebuild changes them. Keep third-party source and license notices intact.

For interface changes, check narrow mobile and desktop widths, both themes, keyboard navigation, and reduced motion. For audio changes, listen to a short test track and verify original/result comparison and both download formats. Automated checks use mocks and cannot establish perceived audio quality.

Use concise commit subjects such as `fix: preserve settings when replacing audio` or `feat: add an audio effect`. Explain the resulting behavior and relevant validation in pull requests. Never commit credentials, uploaded user audio, local caches, or environment files.
