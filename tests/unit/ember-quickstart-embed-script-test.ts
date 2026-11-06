import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

module('Unit | ember quickstart embed script', function () {
  test('on-page quickstart shows the embed script, not the web component', function (assert) {
    const quickstart = demoSource.match(
      /id="quickstart-heading"[\s\S]*?<\/section>/,
    );

    assert.ok(quickstart, 'quickstart section is present');

    const snippet = quickstart?.[0] ?? '';

    assert.true(
      /embed\/embed\.js/.test(snippet),
      'quickstart includes the classic embed.js loader URL',
    );
    assert.true(
      /data-organization-id/.test(snippet),
      'quickstart passes organization id as a data attribute',
    );
    assert.false(
      /pnpm add @qratilabs\/qrati-connect/.test(snippet),
      'quickstart does not tell Ember hosts to install the package',
    );
    assert.false(
      /&lt;qrati-connect\b/.test(snippet),
      'quickstart does not show the web-component element',
    );
  });

  test('FAQ describes the embed script, not rendering a custom element', function (assert) {
    assert.true(
      /<summary>How do I embed an event photo gallery in Ember\?<\/summary>\s*<p>[^<]*embed script[^<]*<\/p>/.test(
        demoSource,
      ),
      'first FAQ answer names the embed script',
    );
    assert.false(
      /<summary>How do I embed an event photo gallery in Ember\?<\/summary>\s*<p>Load Qrati Connect and render its element with your organization ID\.<\/p>/.test(
        demoSource,
      ),
      'first FAQ answer no longer says to render the element',
    );
  });
});
