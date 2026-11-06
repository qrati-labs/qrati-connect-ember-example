import { module, test } from 'qunit';
import indexHtml from '../../index.html?raw';
import demoSource from '../../app/components/qrati-demo.gts?raw';

function headScript(source: string) {
  const head = source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const inline = scripts.find((match) => {
    const attrs = match[1] ?? '';
    return (
      !/\bsrc\s*=/.test(attrs) &&
      /qc-theme/.test(match[2] ?? '') &&
      /data-theme/.test(match[2] ?? '')
    );
  });
  if (!inline) {
    throw new Error('missing inline qc-theme boot script in index.html head');
  }
  return inline[2] ?? '';
}

module('Unit | host theme first paint', function () {
  test('index.html head applies qc-theme before CSS and Ember boot', function (assert) {
    const head = indexHtml.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const bootIndex = head.search(/<script\b[^>]*>[\s\S]*qc-theme/);
    const cssIndex = head.search(/rel="stylesheet"/);

    assert.true(bootIndex >= 0, 'head contains an inline qc-theme boot script');
    assert.true(
      cssIndex >= 0 && bootIndex < cssIndex,
      'theme boot script appears before stylesheet links so first paint can use data-theme',
    );

    const script = headScript(indexHtml);

    assert.true(
      /try\s*\{[\s\S]*localStorage\.getItem\(\s*['"]qc-theme['"]\s*\)/.test(
        script,
      ),
      'localStorage qc-theme read is inside try so SecurityError cannot abort boot',
    );
    assert.true(
      /saved === 'light' \|\| saved === 'dark'|stored === 'light' \|\| stored === 'dark'/.test(
        script,
      ),
      'only light and dark stored values become the host theme',
    );
    assert.true(
      /matchMedia\(\s*['"]\(prefers-color-scheme: dark\)['"]\s*\)/.test(script),
      'invalid or missing storage falls back to prefers-color-scheme',
    );
    assert.true(
      /['"]light['"]/.test(script),
      'matchMedia/storage failure can fall back to light',
    );
    assert.true(
      /setAttribute\(\s*['"]data-theme['"]/.test(script),
      'boot script sets html data-theme before Ember constructs QratiDemo',
    );
    assert.true(
      /classList\.toggle\(\s*['"]dark['"]/.test(script),
      'boot script toggles html.dark for cookie-consent dark tokens',
    );
  });

  test('QratiDemo still syncs data-theme on construct and toggle', function (assert) {
    assert.true(
      /document\.documentElement\.setAttribute\(\s*['"]data-theme['"]/.test(
        demoSource,
      ),
      'constructor/toggle still writes data-theme after boot',
    );
    assert.true(
      /classList\.toggle\(\s*['"]dark['"]/.test(demoSource),
      'constructor/toggle still toggles html.dark',
    );
  });
});
