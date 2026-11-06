import { module, test } from 'qunit';
import appCss from '../../app/styles/app.css?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';
import indexHtml from '../../index.html?raw';

function iconifyHostBlock(css: string) {
  const match = css.match(/(?:^|\n)iconify-icon\s*\{([^}]*)\}/);
  if (!match) {
    throw new Error('missing iconify-icon host rule');
  }
  return match[1];
}

module('Unit | iconify-icon reserved size', function () {
  test('deferred Iconify hosts are used in feature and SEO cards', function (assert) {
    assert.true(
      /iconify-icon\/2\.1\.0\/iconify-icon\.min\.js/.test(indexHtml) &&
        /\sdefer/.test(indexHtml.match(/iconify-icon\.min\.js[^>]*>/)?.[0] ?? ''),
      'index.html still loads iconify-icon with defer',
    );

    const iconCount = (demoSource.match(/<iconify-icon\b/g) ?? []).length;
    assert.strictEqual(
      iconCount,
      10,
      'QratiDemo still renders ten iconify-icon hosts',
    );
    assert.true(
      /class="feature-map-heading">\s*<iconify-icon\b/.test(demoSource),
      'feature-map headings still start with iconify-icon',
    );
    assert.true(
      /class="seo-feature-card">\s*<iconify-icon\b/.test(demoSource),
      'SEO feature cards still start with iconify-icon',
    );
  });

  test('iconify-icon host CSS reserves an inline-block 1em box', function (assert) {
    const block = iconifyHostBlock(appCss);

    assert.true(
      /display:\s*inline-block/.test(block),
      'host is display:inline-block before the web component upgrades',
    );
    assert.true(/width:\s*1em/.test(block), 'host width is reserved at 1em');
    assert.true(/height:\s*1em/.test(block), 'host height is reserved at 1em');
    assert.true(
      /\.feature-map-heading iconify-icon[^{]*\{[^}]*font-size:\s*1\.5rem/.test(
        appCss,
      ),
      'feature-map / SEO icon font-size remains 1.5rem',
    );
  });
});
