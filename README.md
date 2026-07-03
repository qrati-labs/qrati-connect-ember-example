# Qrati Connect — Ember Example

Embeds [Qrati Connect](https://qrati.com) into a Ember app using the no-code
**embed script**, with a host-controlled light/dark theme.

## Integration method: Embed script

A single `async` script tag mounts the widget where it sits; config travels in
`data-*` attributes:

```html
<script async
  src="https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js"
  data-organization-id="your-org-id"
  data-router="hash"></script>
```

This example injects that tag with the current theme (see `app/components/qrati-demo.gts`).

## Run it

```bash
bun install
bun start
```

## Configuration

| Variable                 | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `VITE_ORGANIZATION_ID`   | Your Qrati organization ID                                        |
| `VITE_QRATI_EMBED_URL`   | CDN URL of the embed script (`embed/embed.js`)                     |

## Other integration methods

- **React component** — `import { QratiConnect }` (see the React / Next / Preact examples).
- **Web component** — `<qrati-connect>` from the CDN (see the Svelte / Solid / Qwik / Lit examples).

Docs: <https://www.npmjs.com/package/@qratilabs/qrati-connect>
