import { module, test } from 'qunit';
import indexHtml from '../../index.html?raw';

const OG_IMAGE = 'https://qrati.com/connect/ember-example/qrati-connect-og.png';
const CANONICAL = 'https://qrati.com/connect/ember-example';
const PNG_ICON = '/connect/ember-example/qrati-connect-logo-square.png';
const SVG_ICON = '/connect/ember-example/qrati-logo-square.svg';

module('Unit | production index.html social identity', function () {
  test('declares Open Graph and Twitter image URLs for the ember-example subpath', function (assert) {
    assert.true(
      indexHtml.includes('property="og:type"') &&
        indexHtml.includes('content="website"'),
      'og:type is website',
    );
    assert.true(
      indexHtml.includes('property="og:url"') &&
        indexHtml.includes(`content="${CANONICAL}"`),
      'og:url matches the canonical public URL',
    );
    assert.true(
      indexHtml.includes('property="og:image"') &&
        indexHtml.includes(`content="${OG_IMAGE}"`),
      'og:image points at the hosted ember-example OG asset',
    );
    assert.true(
      indexHtml.includes('name="twitter:card"') &&
        indexHtml.includes('content="summary_large_image"'),
      'twitter:card is summary_large_image',
    );
    assert.true(
      indexHtml.includes('name="twitter:image"') &&
        indexHtml.includes(`content="${OG_IMAGE}"`),
      'twitter:image matches og:image',
    );
  });

  test('favicon hrefs are worker-subpath absolute, not document-relative', function (assert) {
    assert.true(
      indexHtml.includes(`rel="icon" type="image/svg+xml" href="${SVG_ICON}"`),
      'SVG favicon uses the ember-example subpath',
    );
    assert.true(
      indexHtml.includes(`href="${PNG_ICON}"`),
      'PNG favicon uses the ember-example subpath',
    );
    assert.false(
      /rel="icon"[^>]*href="\.\//.test(indexHtml),
      'icon hrefs are not document-relative',
    );
  });
});
