import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

const MIN_TEXT_CONTRAST = 4.5;
const LIGHT_PAGE = [255, 247, 241] as const;
const LIGHT_WHITE = [255, 255, 255] as const;
const DARK_PAGE = [17, 17, 17] as const;

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

function parseRgba(value: string) {
  const match = String(value)
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!match) {
    return null;
  }
  return {
    rgb: [Number(match[1]), Number(match[2]), Number(match[3])],
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function composite(fg: readonly number[], bg: readonly number[], alpha: number) {
  return fg.map((channelValue, i) => Math.round(alpha * channelValue + (1 - alpha) * bg[i]));
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
  const rgba = parseRgba(cleaned);
  if (rgba) {
    if (rgba.alpha !== 1) {
      throw new Error(`opaque resolve expected, got alpha ${rgba.alpha} in ${cleaned}`);
    }
    return rgba.rgb;
  }
  return parseHex(cleaned);
}

function resolveFill(value: string, vars: Record<string, string>, page: readonly number[]) {
  const cleaned = value.replace(/!important/gi, '').trim();
  const ref = cleaned.match(/^var\((--[a-z0-9-]+)(?:,\s*([^)]+))?\)/i);
  if (ref) {
    const fallback = ref[2];
    const resolved = vars[ref[1]] ?? fallback;
    if (!resolved) {
      throw new Error(`block is missing ${ref[1]}`);
    }
    return resolveFill(resolved, vars, page);
  }
  const rgba = parseRgba(cleaned);
  if (rgba) {
    return composite(rgba.rgb, page, rgba.alpha);
  }
  return parseHex(cleaned);
}

function heroKickerDecl(css: string, property: string) {
  const block = css.match(/\.hero-kicker\s*\{([\s\S]*?)\n\}/);
  if (!block) {
    throw new Error('missing .hero-kicker block');
  }
  const match = block[1].match(new RegExp(`${property}\\s*:\\s*([^;]+);`, 'i'));
  if (!match) {
    throw new Error(`missing .hero-kicker ${property}`);
  }
  return match[1].trim();
}

module('Unit | host hero kicker text contrast', function () {
  test('hero kicker and light brand-accent meet WCAG 1.4.3 in both host themes', function (assert) {
    assert.true(
      demoSource.includes('class="hero-kicker"') && demoSource.includes('Qrati Connect Demo'),
      'demo still renders the hero kicker',
    );
    assert.true(
      /class="hero-copy"[\s\S]*href="https:\/\/qrati\.com"/.test(demoSource),
      'demo still renders in-copy Qrati brand links',
    );

    const colorDecl = heroKickerDecl(appCss, 'color');
    const backgroundDecl = heroKickerDecl(appCss, 'background');
    assert.strictEqual(
      colorDecl,
      'var(--brand-accent)',
      'kicker color uses the themed brand-accent token',
    );

    const light = blockVars(appCss, /\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/);
    const dark = blockVars(appCss, /\[data-theme='dark'\]\s*\{([\s\S]*?)\n\}/);

    const lightAccent = resolveColor(light['--brand-accent'], light);
    const darkAccent = resolveColor(dark['--brand-accent'], dark);
    const lightKickerBg = resolveFill(backgroundDecl, light, LIGHT_PAGE);
    const darkKickerBg = resolveFill(backgroundDecl, dark, DARK_PAGE);

    const cases: Array<[string, number[], readonly number[]]> = [
      ['light brand-accent on white', lightAccent, LIGHT_WHITE],
      ['light brand-accent on page cream', lightAccent, LIGHT_PAGE],
      ['light kicker on composite pill', lightAccent, lightKickerBg],
      ['dark kicker on composite pill', darkAccent, darkKickerBg],
      ['dark brand-accent on page', darkAccent, DARK_PAGE],
    ];

    for (const [label, fg, bg] of cases) {
      const ratio = contrastRatio(fg, bg);
      assert.ok(
        ratio >= MIN_TEXT_CONTRAST,
        `${label} ${ratio.toFixed(3)}:1 is below ${MIN_TEXT_CONTRAST}:1`,
      );
    }
  });
});
