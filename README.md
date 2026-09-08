# Qrati Connect — Ember Example

[![Qrati Connect — embeddable event photo galleries](public/qrati-connect-og.png)](https://qrati.com/connect)

Embed a live event photo gallery in Ember with guest uploads, full-screen lightbox, emoji reactions, and photo-contest rankings. [Explore Qrati Connect](https://qrati.com/connect) or [view the live Ember example](https://qrati.com/connect/ember-example).

Embeds [Qrati Connect](https://qrati.com) into an Ember app using the no-code
**embed script**, with a host-controlled light/dark theme. The demo org used
here is configured for custom storage on the Qrati backend — that's a
server-side setting with no frontend impact, so the embed code below is
unchanged from a standard org.

## Integration method: Embed script

A single `async` script tag mounts the widget where it sits; config travels in
`data-*` attributes:

```html
<script
  async
  src="https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js"
  data-organization-id="your-org-id"
  data-router="hash"
></script>
```

See `app/components/qrati-demo.gts` — the script tag is re-injected whenever
the theme toggle changes, since scripts don't react to attribute mutation.

## Run it

```bash
pnpm install
pnpm start
```

## Configuration

| Variable               | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `VITE_ORGANIZATION_ID` | Your Qrati organization ID                     |
| `VITE_CDN_URL`         | CDN URL of the embed script (`embed/embed.js`) |

## Other integration methods

- **React component** — `import { QratiConnect }` (see the React / Next / Preact examples).
- **Web component** — `<qrati-connect>` from the CDN (see the Svelte / Solid / Qwik / Lit examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
