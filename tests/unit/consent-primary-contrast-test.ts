import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

const MIN_TEXT_CONTRAST = 4.5;

function channel(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: readonly number[]) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastRatio(fg: readonly number[], bg: readonly number[]) {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseHex(value: string) {
  const match = String(value).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (!match) {
    throw new Error(`expected a hex color, got ${JSON.stringify(value)}`);
  }
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function blockVars(css: string, pattern: RegExp) {
  const block = css.match(pattern);
  if (!block) {
    throw new Error(`missing CSS block ${pattern}`);
  }
  const vars: Record<string, string> = {};
  for (const match of block[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    vars[`--${match[1]}`] = match[2].trim();
  }
  return vars;
}

function resolveColor(value: string, vars: Record<string, string>): number[] {
  const cleaned = value.replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)(?:,\s*([^)]+))?\)/i);
  if (ref) {
    const fallback = ref[2];
    const resolved = vars[ref[1]] ?? fallback;
    if (!resolved) {
      throw new Error(`block is missing ${ref[1]}`);
    }
    return resolveColor(resolved, vars);
  }
  return parseHex(cleaned);
}

module('Unit | cookie-consent primary button contrast', function () {
  test('Accept all / Save preferences white-on-fill meets WCAG 1.4.3 in both themes', function (assert) {
    assert.true(
      /acceptAllBtn:\s*'Accept all'/.test(consentSource) &&
        /savePreferencesBtn:\s*'Save preferences'/.test(consentSource),
      'consent config still exposes primary Accept all and Save preferences actions',
    );

    const light = blockVars(appCss, /#cc-main\s*\{([\s\S]*?)\n\}/);
    const dark = blockVars(
      appCss,
      /html\.dark #cc-main,\s*\[data-theme='dark'\] #cc-main\s*\{([\s\S]*?)\n\}/,
    );

    assert.strictEqual(light['--cc-toggle-on-bg'], '#ff4800', 'light toggle-on token unchanged');
    assert.strictEqual(dark['--cc-toggle-on-bg'], '#ff4800', 'dark toggle-on token unchanged');
    assert.strictEqual(
      light['--cc-btn-secondary-bg'],
      '#fff0e9',
      'light secondary fill unchanged',
    );
    assert.strictEqual(
      dark['--cc-btn-secondary-bg'],
      '#2a2020',
      'dark secondary fill unchanged',
    );

    for (const [theme, vars] of [
      ['light', light],
      ['dark', dark],
    ] as const) {
      const fg = resolveColor(vars['--cc-btn-primary-color'], vars);
      const bg = resolveColor(vars['--cc-btn-primary-bg'], vars);
      const hoverBg = resolveColor(vars['--cc-btn-primary-hover-bg'], vars);
      const rest = contrastRatio(fg, bg);
      const hover = contrastRatio(fg, hoverBg);
      assert.ok(
        rest >= MIN_TEXT_CONTRAST,
        `${theme} consent primary ${rest.toFixed(3)}:1 is below ${MIN_TEXT_CONTRAST}:1`,
      );
      assert.ok(
        hover >= MIN_TEXT_CONTRAST,
        `${theme} consent primary hover ${hover.toFixed(3)}:1 is below ${MIN_TEXT_CONTRAST}:1`,
      );
    }
  });
});
