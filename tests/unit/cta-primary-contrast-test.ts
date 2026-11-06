import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

const MIN_TEXT_CONTRAST = 4.5;
const WHITE = [255, 255, 255] as const;

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

function ctaBackgroundDeclaration(css: string) {
  const match = css.match(/\.btn-cta-primary\{[^}]*background:([^;]+);/i);
  if (!match) {
    throw new Error('missing .btn-cta-primary background declaration');
  }
  return match[1].trim();
}

module('Unit | host Contact CTA text contrast', function () {
  test('btn-cta-primary white label meets WCAG 1.4.3 in both host themes', function (assert) {
    assert.true(
      demoSource.includes('class="btn-cta-primary"') &&
        demoSource.includes('https://qrati.com/contact-us'),
      'demo still renders the Contact Qrati CTA',
    );

    const backgroundDecl = ctaBackgroundDeclaration(appCss);
    const light = blockVars(appCss, /\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/);
    const dark = blockVars(appCss, /\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/);

    assert.strictEqual(
      light['--brand-accent'],
      '#c24100',
      'light --brand-accent stays at the WCAG 1.4.3 hero token',
    );
    assert.strictEqual(
      dark['--brand-accent'],
      '#ff6b35',
      'dark --brand-accent is unchanged',
    );

    const lightBg = resolveColor(backgroundDecl, light);
    const darkBg = resolveColor(backgroundDecl, dark);
    const lightRatio = contrastRatio(WHITE, lightBg);
    const darkRatio = contrastRatio(WHITE, darkBg);

    assert.ok(
      lightRatio >= MIN_TEXT_CONTRAST,
      `light CTA ${lightRatio.toFixed(3)}:1 is below ${MIN_TEXT_CONTRAST}:1`,
    );
    assert.ok(
      darkRatio >= MIN_TEXT_CONTRAST,
      `dark CTA ${darkRatio.toFixed(3)}:1 is below ${MIN_TEXT_CONTRAST}:1`,
    );
  });
});
