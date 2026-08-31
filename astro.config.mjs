// @ts-check
import { defineConfig } from 'astro/config';

// Static output. No UI framework, no CSS framework, no client router.
// Cross-document view transitions come from @view-transition in CSS, not from Astro's router.
export default defineConfig({
  site: 'https://rbpl.lk',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
