import { module, test } from 'qunit';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function sliceFrom(source: string, startMarker: string, endMarker: string) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1) {
    throw new Error(`missing ${startMarker} .. ${endMarker}`);
  }
  return source.slice(start, end);
}

module('Unit | host theme persistence', function () {
  test('qc-theme localStorage read is guarded and only light/dark are accepted', function (assert) {
    const reader = sliceFrom(
      demoSource,
      'function readHostTheme',
      'function persistHostTheme',
    );

    assert.true(
      /try\s*\{[\s\S]*localStorage\.getItem\(THEME_STORAGE_KEY\)/.test(reader),
      'getItem runs inside try so SecurityError cannot crash QratiDemo',
    );
    assert.true(
      /catch\s*\{/.test(reader),
      'storage read failures are caught',
    );
    assert.true(
      /stored === 'light' \|\| stored === 'dark'/.test(reader),
      'only light and dark stored values become the host theme',
    );
    assert.true(
      /matchMedia\('\(prefers-color-scheme: dark\)'\)/.test(reader),
      'blocked or invalid storage falls back to prefers-color-scheme',
    );
    assert.true(
      /return 'light'/.test(reader),
      'matchMedia failure falls back to light',
    );

    assert.false(
      /@tracked theme:[^=]*=\s*\n?\s*\(localStorage\.getItem/.test(demoSource),
      'class-field initializer must not call localStorage.getItem unguarded',
    );
  });

  test('qc-theme localStorage write is guarded', function (assert) {
    const writer = sliceFrom(
      demoSource,
      'function persistHostTheme',
      'const mountEmbed',
    );

    assert.true(
      /try\s*\{[\s\S]*localStorage\.setItem\(THEME_STORAGE_KEY, theme\)/.test(
        writer,
      ),
      'setItem runs inside try so a later toggle cannot throw',
    );
    assert.true(/catch\s*\{/.test(writer), 'storage write failures are caught');
    assert.true(
      /persistHostTheme\(this\.theme\)/.test(demoSource),
      'toggleTheme persists through the guarded helper',
    );
    assert.false(
      /localStorage\.setItem\('qc-theme'/.test(demoSource),
      'toggleTheme must not call localStorage.setItem unguarded',
    );
  });
});
