import { module, test } from 'qunit';
import consentSource from '../../app/lib/cookieConsent.ts?raw';

module('Unit | cookie-consent geo response validation', function () {
  test('non-OK and non-boolean geo payloads fail closed without caching', function (assert) {
    assert.true(
      /if\s*\(\s*!response\.ok\s*\)\s*return\s+true/.test(consentSource),
      'non-OK geo responses fail closed (opt-in) instead of reading required',
    );

    assert.true(
      /typeof\s+payload\.required\s*!==\s*['"]boolean['"]/.test(consentSource),
      'non-boolean required fails closed',
    );

    assert.true(
      /sessionStorage\.setItem\(\s*GEO_STORAGE_KEY,\s*String\(\s*payload\.required\s*\)\s*\)/.test(
        consentSource,
      ),
      'only a validated boolean required is cached',
    );

    assert.false(
      /const\s+\{\s*required\s*\}\s*=\s*\(\s*await\s+response\.json\(\)\s*\)/.test(
        consentSource,
      ),
      'does not destructure required from unvalidated JSON',
    );

    const fetchIdx = consentSource.indexOf(
      "await fetch(geoUrl, { cache: 'no-store' })",
    );
    const okIdx = consentSource.search(/if\s*\(\s*!response\.ok\s*\)\s*return\s+true/);
    const jsonIdx = consentSource.indexOf('await response.json()');
    const cacheIdx = consentSource.indexOf(
      'sessionStorage.setItem(GEO_STORAGE_KEY, String(payload.required))',
    );

    assert.true(fetchIdx !== -1 && okIdx > fetchIdx, 'ok check is after fetch');
    assert.true(jsonIdx > okIdx, 'JSON parse is after the ok check');
    assert.true(
      cacheIdx > jsonIdx && cacheIdx !== -1,
      'cache write is after JSON validation',
    );
  });
});
