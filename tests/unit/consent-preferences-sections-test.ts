import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

const MIN_NONTEXT_CONTRAST = 3;

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

module('Unit | cookie-consent preferences sections', function () {
  test('preferences modal links necessary and analytics categories', function (assert) {
    assert.true(
      /categories:\s*\{\s*necessary:\s*\{\s*enabled:\s*true,\s*readOnly:\s*true\s*\},\s*analytics:\s*\{\s*\}/.test(
        consentSource,
      ),
      'consent still configures necessary (readonly) and analytics categories',
    );

    assert.true(
      /linkedCategory:\s*'necessary'/.test(consentSource),
      'preferences sections include linkedCategory necessary',
    );
    assert.true(
      /linkedCategory:\s*'analytics'/.test(consentSource),
      'preferences sections include linkedCategory analytics',
    );

    const emptySections = /preferencesModal:[\s\S]*sections:\s*\[\s*\]/.test(consentSource);
    assert.false(emptySections, 'preferencesModal.sections is not an empty array');
  });

  test('light-theme analytics-off toggle meets WCAG 1.4.11 against the category block', function (assert) {
    const light = blockVars(appCss, /#cc-main\s*\{([\s\S]*?)\n\}/);
    const off = resolveColor(light['--cc-toggle-off-bg'], light);
    const block = resolveColor(light['--cc-cookie-category-block-bg'], light);
    const knob = parseHex('#ffffff');
    const trackVsBlock = contrastRatio(off, block);
    const knobVsTrack = contrastRatio(knob, off);

    assert.ok(
      trackVsBlock >= MIN_NONTEXT_CONTRAST,
      `light off-toggle vs category block ${trackVsBlock.toFixed(3)}:1 is below ${MIN_NONTEXT_CONTRAST}:1`,
    );
    assert.ok(
      knobVsTrack >= MIN_NONTEXT_CONTRAST,
      `light off-toggle knob vs track ${knobVsTrack.toFixed(3)}:1 is below ${MIN_NONTEXT_CONTRAST}:1`,
    );
  });
});
