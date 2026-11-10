import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

module('Unit | host target=_blank new-tab indication', function () {
  test('every target=_blank host link associates opens-in-a-new-tab text', function (assert) {
    const anchors = [...demoSource.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(
      (match) => match[0],
    );
    const blankTargets = anchors.filter((anchor) =>
      /\btarget\s*=\s*["']_blank["']/.test(anchor),
    );

    assert.strictEqual(
      blankTargets.length,
      8,
      'hero, action-pill, and footer new-tab links are still present',
    );

    for (const anchor of blankTargets) {
      assert.true(
        /class=["']sr-only["']/.test(anchor) &&
          /opens in a new tab/i.test(anchor),
        `target=_blank link includes sr-only new-tab text: ${anchor.slice(0, 160)}`,
      );
    }

    assert.true(
      /class=["']btn-cta-primary["'][^>]*href=["']https:\/\/qrati\.com\/contact-us["']/.test(
        demoSource,
      ) ||
        /class=["']btn-cta-primary["'][\s\S]*?href=["']https:\/\/qrati\.com\/contact-us["']/.test(
          demoSource,
        ) ||
        /href=["']https:\/\/qrati\.com\/contact-us["'][^>]*class=["']btn-cta-primary["']/.test(
          demoSource,
        ),
      'Contact CTA remains present',
    );
    assert.false(
      /href=["']https:\/\/qrati\.com\/contact-us["'][^>]*target=/.test(demoSource),
      'Contact CTA does not set target',
    );
  });
});
