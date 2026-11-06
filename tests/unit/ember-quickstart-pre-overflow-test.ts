import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function lastBlock(css: string, selector: string) {
  const matches = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  let body: string | undefined;
  for (const match of matches) {
    const selectors = match[1].split(',').map((part) => part.trim());
    if (selectors.includes(selector)) {
      body = match[2];
    }
  }
  return body;
}

function declaration(block: string | undefined, property: string) {
  if (!block) {
    return undefined;
  }
  let value: string | undefined;
  const pattern = new RegExp(
    `(?:^|;)\\s*${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`,
    'gi',
  );
  for (const match of block.matchAll(pattern)) {
    value = match[1].trim();
  }
  return value;
}

module('Unit | ember quickstart pre overflow', function () {
  test('quickstart still ships a preformatted embed snippet', function (assert) {
    const quickstart = demoSource.match(
      /id="quickstart-heading"[\s\S]*?<\/section>/,
    );

    assert.ok(quickstart, 'quickstart section is present');

    const snippet = quickstart?.[0] ?? '';

    assert.true(
      /<pre>\s*<code>[\s\S]*embed\/embed\.js[\s\S]*<\/code>\s*<\/pre>/.test(
        snippet,
      ),
      'quickstart uses a <pre><code> embed.js sample',
    );
  });

  test('quickstart pre is contained and horizontally scrollable', function (assert) {
    const block = lastBlock(appCss, '.seo-section pre');

    assert.ok(block, 'a .seo-section pre rule exists');
    assert.strictEqual(
      declaration(block, 'max-width'),
      '100%',
      'pre cannot grow past the section',
    );
    assert.strictEqual(
      declaration(block, 'overflow-x'),
      'auto',
      'long src lines scroll inside the pre instead of clipping',
    );
    assert.strictEqual(
      declaration(block, 'text-align'),
      'left',
      'code is left-aligned inside the centered seo section',
    );
  });
});
