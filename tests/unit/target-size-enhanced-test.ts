import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

const MIN_PX = 44;
const SELECTORS = [
  '.theme-toggle',
  '.action-pills a',
  '.faq-list summary',
  '.footer nav a',
  '.footer-cookie-btn',
] as const;

function mergedDeclarations(css: string, selector: string) {
  const chunks: string[] = [];
  const rules = css.match(/[^{}]+\{[^{}]*\}/g) ?? [];
  for (const rule of rules) {
    const brace = rule.indexOf('{');
    const selectors = rule
      .slice(0, brace)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split(',')
      .map((part) => part.trim());
    if (selectors.includes(selector)) {
      chunks.push(rule.slice(brace + 1, rule.lastIndexOf('}')));
    }
  }
  if (chunks.length === 0) {
    throw new Error(`no CSS rule contains ${selector}`);
  }
  return chunks.join('\n');
}

function declarationPx(body: string, property: string) {
  const matches = [
    ...body.matchAll(new RegExp(`${property}\\s*:\\s*([0-9.]+)px`, 'gi')),
  ];
  if (matches.length === 0) {
    return null;
  }
  return Number(matches[matches.length - 1][1]);
}

module('Unit | host WCAG 2.5.5 target size (enhanced)', function () {
  test('non-inline host pointer targets declare a 44px minimum hit box', function (assert) {
    assert.true(
      /class="theme-toggle"/.test(demoSource),
      'theme toggle is still in the demo',
    );
    assert.true(
      /class="action-pills"/.test(demoSource),
      'action pills are still in the demo',
    );
    assert.true(
      /<details[\s\S]*?<summary>/.test(demoSource),
      'FAQ summaries are still in the demo',
    );
    assert.true(
      /<nav aria-label="Footer navigation">/.test(demoSource),
      'footer nav is still in the demo',
    );
    assert.true(
      /class="footer-cookie-btn"/.test(demoSource),
      'footer cookie-preferences control is still in the demo',
    );

    for (const selector of SELECTORS) {
      const body = mergedDeclarations(appCss, selector);
      const minHeight = declarationPx(body, 'min-height');
      const minWidth = declarationPx(body, 'min-width');
      assert.ok(
        minHeight !== null && minHeight >= MIN_PX,
        `${selector} min-height is ${minHeight}px, expected >= ${MIN_PX}px`,
      );
      assert.ok(
        minWidth !== null && minWidth >= MIN_PX,
        `${selector} min-width is ${minWidth}px, expected >= ${MIN_PX}px`,
      );
      const honorsMinSize =
        selector === '.faq-list summary'
          ? !/display\s*:\s*inline\s*(;|$)/i.test(body)
          : /display\s*:\s*(inline-flex|flex|inline-block)\b/i.test(body);
      assert.true(
        honorsMinSize,
        `${selector} uses a box that honors min-height/min-width`,
      );
    }
  });
});
