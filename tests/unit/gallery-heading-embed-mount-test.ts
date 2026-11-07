import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

module('Unit | live gallery heading vs embed remount', function () {
  test('sr-only gallery heading is not a child of the mountEmbed target', function (assert) {
    assert.false(
      /element\.innerHTML\s*=\s*['"]{2}/.test(demoSource),
      'mountEmbed no longer clears the mount node (theme updates in place)',
    );
    assert.true(
      /\{\{mountEmbed this\.theme\}\}/.test(demoSource),
      'modifier still depends on host theme',
    );
    assert.true(
      /<h2\s+class="sr-only">Live Event Photo Gallery Component<\/h2>/.test(
        demoSource,
      ),
      'visually hidden live-gallery heading is present',
    );

    const headingInsideMountTarget =
      /<([a-z]+)[^>]*\{\{mountEmbed this\.theme\}\}[^>]*>\s*<h2\s+class="sr-only">Live Event Photo Gallery Component<\/h2>/;

    assert.false(
      headingInsideMountTarget.test(demoSource),
      'gallery heading is not a child of the node whose innerHTML is cleared',
    );

    assert.true(
      /<section\b[^>]*class="widget-frame"[^>]*>[\s\S]*<h2\s+class="sr-only">Live Event Photo Gallery Component<\/h2>/.test(
        demoSource,
      ),
      'gallery heading stays inside the labeled widget-frame region',
    );
  });
});
