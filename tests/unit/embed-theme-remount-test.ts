import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function mountEmbedBody(source: string) {
  const match = source.match(
    /const mountEmbed = modifier\(([\s\S]*?)\n\}\);/,
  );
  return match?.[1] ?? '';
}

module('Unit | embed theme remount vs document.body fallback', function () {
  test('theme changes update the existing embed instead of wiping the mount node', function (assert) {
    const body = mountEmbedBody(demoSource);

    assert.ok(body.length > 0, 'mountEmbed modifier is present');
    assert.false(
      /innerHTML\s*=\s*['"]{2}/.test(body),
      'mountEmbed does not clear innerHTML (detached classic scripts still execute)',
    );
    assert.true(
      /querySelector\(\s*['"]qrati-connect['"]\s*\)/.test(body),
      'already-upgraded widget is reused',
    );
    assert.true(
      /setAttribute\(\s*['"]theme['"]/.test(body),
      'existing qrati-connect receives the host theme',
    );
    assert.true(
      /dataset\.theme\s*=\s*theme/.test(body),
      'in-flight embed script data-theme is updated instead of injecting another loader',
    );
    assert.true(
      /\{\{mountEmbed this\.theme\}\}/.test(demoSource),
      'modifier still depends on host theme',
    );
  });
});
